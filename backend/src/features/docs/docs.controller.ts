import { Request, Response, NextFunction } from "express";
import { DocsService } from "./docs.service";

export class DocsController {
  static getSitemap(_req: Request, res: Response, next: NextFunction): void {
    try {
      const sitemap = DocsService.getSitemap();
      res.status(200).json({
        success: true,
        data: sitemap,
      });
    } catch (error) {
      next(error);
    }
  }

  static getArticle(req: Request, res: Response, next: NextFunction): void {
    try {
      const { category, slug } = req.params as { category: string; slug: string };
      const article = DocsService.getDocArticle({ category, slug });


      if (!article) {
        res.status(404).json({
          success: false,
          error: {
            message: `Documentation article not found in category '${category}' with slug '${slug}'`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  }

  static search(req: Request, res: Response, next: NextFunction): void {
    try {
      const queryStr = req.query.q as string;
      if (!queryStr) {
        res.status(400).json({
          success: false,
          error: {
            message: "Search query 'q' parameter is required",
          },
        });
        return;
      }

      const results = DocsService.searchDocs({ q: queryStr });
      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default DocsController;
