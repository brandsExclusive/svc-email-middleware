import { Request, Response } from "express";
import recommendation from "../lib/recommendation";

export async function index(
  req: Request,
  res: Response
): Promise<Response | void> {
  console.log('headers', JSON.stringify(req.headers));
  const recommended = await recommendation(
    req.params.userId,
    req.params.recommendationId,
    req.params.index
  );
  res.status(302);
  res.redirect(recommended.link);
  return res.end();
}
