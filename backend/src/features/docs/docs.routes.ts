import { Router } from "express";
import { DocsController } from "./docs.controller";

export const docsRouter = Router();

docsRouter.get("/sitemap", DocsController.getSitemap);
docsRouter.get("/search", DocsController.search);
docsRouter.get("/:category/:slug", DocsController.getArticle);
