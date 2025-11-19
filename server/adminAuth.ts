import type { Request, Response, NextFunction } from "express";

// Admin email whitelist - add authorized admin emails here
export const ADMIN_EMAILS = [
  "admin@haritsattva.com",
  "harshraisjc@gmail.com",
  // Add more admin emails as needed
];

export function isAdmin(req: any, res: Response, next: NextFunction) {
  // First check if user is authenticated
  if (!req.user || !req.user.claims) {
    return res.status(401).json({ message: "Unauthorized - not authenticated" });
  }

  // Get user email from the authenticated session
  const userEmail = req.user.claims.email;

  // Check if email is in admin whitelist
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
    return res.status(403).json({ message: "Forbidden - admin access required" });
  }

  next();
}

export function checkAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
