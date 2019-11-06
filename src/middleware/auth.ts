import { Request, Response } from "express";
import { getUser } from "../services/auth";

export async function authMiddleware(
  req: Request,
  resp: Response,
  next: Function
) {
  const authResponse = await getUser(req.headers);
  if (authResponse.status !== 200) {
    resp.status(authResponse.status);
    resp.end();
  }
  if (!authResponse.user || !authResponse.user.roles.includes("admin-user")) {
    resp.status(403);
    resp.end();
  }
  next();
}
