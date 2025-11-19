import type { Request, Response, NextFunction } from "express";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!res.locals.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (res.locals.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
}
