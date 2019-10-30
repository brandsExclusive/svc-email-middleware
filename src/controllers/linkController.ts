import { Request, Response } from "express";
import recommendation from "../lib/recommendation";

export async function index(
  req: Request,
  res: Response
): Promise<Response | void> {
  const recommended = await recommendation(req);
  res.status(302);
  res.redirect(recommended.link);
  return res.end();
}
