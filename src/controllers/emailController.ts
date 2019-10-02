import { Request, Response } from "express";
import recommendation from "../lib/recommendation";
import buildImageUrl from "../lib/buildImageUrl";
import timeout from "../lib/timeout";

export async function index(req: Request, res: Response): Promise <Response|void> {
  /*
    Multiple requests come in at the same moment from a email open, manually add some latency to the
    process allowing the request with the lowest manual latency to trigger the function that gets
    recommendations from Einstien.

    If this is not set multiple calls will be made to Einstein costing us more money
  */
  const latency = Math.floor(Math.random() * 50);
  await timeout(latency);
  let recommendedProductCode;
  try {
    recommendedProductCode = await recommendation(
      req.params.userId,
      req.params.recommendationId,
      req.params.index
    );
  } catch (err) {
    console.log(err);
    recommendedProductCode = "default";
  }
  const redirectUrl = buildImageUrl(recommendedProductCode);
  res.status(302);
  res.redirect(redirectUrl);
  return res.end();
}
