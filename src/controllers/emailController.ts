import { Request, Response } from "express";
import recommendation from "../lib/recommendation";
import buildImageUrl from "../lib/buildImageUrl";
import timeout from "../lib/timeout";
import * as useragent from "useragent";

export async function index(
  req: Request,
  res: Response
): Promise<Response | void> {
  /*
    Multiple requests come in at the same moment from a email open, manually add some latency to the
    process allowing the request with the lowest manual latency to trigger the function that gets
    recommendations from Einstien.

    If this is not set multiple calls will be made to Einstein costing us more money
  */
  const latency = Math.floor(Math.random() * 50);
  console.log("headers", req.headers);
  const isMobileHeader = req.headers["cloudfront-is-mobile-viewer"] === "true";
  const isMobileUrl = req.params.layout === "mobile";
  const locale = req.query.locale;
  let isMobile = false;
  if (isMobileUrl || isMobileHeader) {
    isMobile = true;
  }
  await timeout(latency);
  let recommended;
  try {
    recommended = await recommendation(req);
  } catch (err) {
    console.log(err);
    recommended.product_code = "default";
  }
  if (!recommended || !recommended.product_code) {
    recommended = {};
    recommended.product_code = "default";
  }
  const redirectUrl = buildImageUrl(recommended.product_code, isMobile, locale);
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  res.status(302);
  res.redirect(redirectUrl);
  return res.end();
}
