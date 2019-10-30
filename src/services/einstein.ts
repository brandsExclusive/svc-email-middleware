import { Request } from "express";
import fetch from "node-fetch";
import { analytics, userAnalytics } from "../lib/analytics"

const MID = process.env.MID || "100016247";
const RECOMMENDATION = process.env.RECOMMENDATION || "home";
const CACHE_EXPIRY = process.env.CACHE_EXPIRY || 10;

export default async function einstein(
  userId: string,
  recommendationId: string,
  redis: any,
  req: Request
): Promise<any> {
  const url = `https://${MID}.recs.igodigital.com/a/v2/${MID}/${RECOMMENDATION}/recommend.json?email=${userId}`;
  const resp = await fetch(url);
  const data = await resp.json();
  if (resp.status === 200) {
    await redis.set(userId, JSON.stringify(data), "EX", CACHE_EXPIRY);
    await analytics(data)
    await userAnalytics(userId, data, req)
  } else {
    console.log(`Error getting recommendations from Einstein`);
    // TODO set default values to user key
    // if status is not 200 set the default recommendation to the user key
  }
}
