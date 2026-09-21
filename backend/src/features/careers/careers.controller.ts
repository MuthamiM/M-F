import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import * as careersService from "./careers.service";
import {
  deletePendingUploads,
  getPendingUpload,
  storePendingUpload,
  type PendingUpload,
} from "./careers.upload";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream", // Some browsers use this for DOCX files.
];
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

type CareerFiles = { [fieldname: string]: Express.Multer.File[] };

function getUploadedFiles(req: Request) {
  const files = req.files as CareerFiles | undefined;
  return {
    cv: files?.cv?.[0],
    resume: files?.resume?.[0],
  };
}

async function removeFiles(files: Array<Express.Multer.File | undefined>) {
  await Promise.all(
    files
      .filter((file): file is Express.Multer.File => Boolean(file))
      .map((file) => fs.unlink(file.path).catch(() => {}))
  );
}

function validateDocument(label: string, file: Express.Multer.File): string | null {
  const extension = file.originalname
    .toLowerCase()
    .slice(file.originalname.lastIndexOf("."));

  if (!ALLOWED_EXTENSIONS.includes(extension) || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return `${label} "${file.originalname}" is invalid. Only PDF, DOC, and DOCX files are accepted.`;
  }

  if (file.size === 0) {
    return `${label} is empty. Please choose a valid document.`;
  }

  if (file.size > MAX_FILE_BYTES) {
    return `${label} "${file.originalname}" exceeds the 10 MB size limit.`;
  }

  return null;
}

/**
 * POST /api/careers/upload
 * A document is stored as soon as the applicant chooses it. The opaque token
 * keeps it pending until the complete application is submitted or expires.
 */
export async function uploadDocumentsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { cv: cvFile, resume: resumeFile } = getUploadedFiles(req);
  const uploadedFiles = [cvFile, resumeFile];

  try {
    if (!cvFile && !resumeFile) {
      res.status(400).json({
        success: false,
        error: "Please choose a CV or résumé to upload.",
      });
      return;
    }

    for (const [label, file] of [
      ["CV", cvFile],
      ["Résumé", resumeFile],
    ] as const) {
      if (!file) continue;
      const validationError = validateDocument(label, file);
      if (validationError) {
        await removeFiles(uploadedFiles);
        res.status(400).json({ success: false, error: validationError });
        return;
      }
    }

    const upload = await storePendingUpload({ cv: cvFile, resume: resumeFile });
    res.status(200).json({
      success: true,
      files: {
        cv: upload.cv
          ? { token: upload.cv.token, name: upload.cv.originalName, size: upload.cv.size }
          : null,
        resume: upload.resume
          ? {
              token: upload.resume.token,
              name: upload.resume.originalName,
              size: upload.resume.size,
            }
          : null,
      },
      expiresInMinutes: 30,
    });
  } catch (error) {
    await removeFiles(uploadedFiles);
    next(error);
  }
}

function asToken(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * POST /api/careers/apply
 * Claims the previously uploaded CV and résumé, attaches them to the email,
 * then removes the temporary copies from disk.
 */
export async function submitApplicationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const rawIp =
      (req.headers["cf-connecting-ip"] as string) ||
      (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      "";

    const {
      name,
      email,
      phone,
      experience,
      portfolio,
      coverNote,
      cvUploadToken,
      resumeUploadToken,
      uploadToken,
    } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !coverNote?.trim()) {
      res.status(400).json({
        success: false,
        error: "Name, email, phone, and qualifications summary are required.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
      return;
    }

    // uploadToken supports the earlier combined-upload API during rollout.
    const cvToken = asToken(cvUploadToken) || asToken(uploadToken);
    const resumeToken = asToken(resumeUploadToken) || asToken(uploadToken);

    if (!cvToken || !resumeToken) {
      res.status(400).json({
        success: false,
        error: "Please upload both your CV and résumé before submitting.",
      });
      return;
    }

    const cvUpload = await getPendingUpload(cvToken, "cv");
    const resumeUpload = await getPendingUpload(resumeToken, "resume");
    if (!cvUpload || !resumeUpload) {
      res.status(400).json({
        success: false,
        error:
          "Your CV or résumé is missing or has expired. Please upload both documents again.",
      });
      return;
    }

    const upload: PendingUpload = {
      token: `${cvToken}:${resumeToken}`,
      kind: "cv",
      originalName: cvUpload.originalName,
      mimeType: cvUpload.mimeType,
      size: cvUpload.size,
      content: cvUpload.content,
      createdAt: cvUpload.createdAt,
      expiresAt: cvUpload.expiresAt,
    };

    const result = await careersService.submitApplication(
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        experience: experience?.trim() || "Not specified",
        portfolio: portfolio?.trim() || "",
        coverNote: coverNote.trim(),
      },
      {
        cv: upload,
        resume: resumeUpload,
      },
      rawIp
    );
    await deletePendingUploads([cvToken, resumeToken]);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
