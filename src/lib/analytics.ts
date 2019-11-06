import redis from "./redis";
import { IRecommendations } from "../types";
import { Request } from "express";
import * as useragent from "useragent";
import * as Device from "device";

const RECOMMENDATION: string = process.env.RECOMMENDATION || "home";

export async function analytics(recommendation: IRecommendations[]) {
  /*
 all recommendations get agregated and cached
 */
  const date = new Date();
  const dateKey = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  const result = JSON.parse(await redis.get(dateKey)) || { date: dateKey };
  recommendation.forEach(rec => {
    const recResult = result[RECOMMENDATION] || {
      name: rec.name,
      title: rec.title,
      offers: {}
    };
    for (let index = 0, len = rec.items.length; index < len; index++) {
      const item = rec.items[index];
      const offerData = recResult.offers[item.product_code] || {
        totalViews: 0,
        offerName: item.name,
        indexViews: {}
      };
      offerData.totalViews = offerData.totalViews + 1;
      offerData.indexViews[index] = offerData.indexViews[index] + 1 || 1;
      recResult.offers[item.product_code] = offerData;
      result[RECOMMENDATION] = recResult;
    }
  });
  await redis.set(dateKey, JSON.stringify(result), "EX", 60 * 60 * 24 * 30);
}

export async function userAnalytics(
  recommendations: IRecommendations[],
  req: Request
) {
  const key = `userData-${req.params.userId}`;
  let userData = JSON.parse(await redis.get(key)) || [];
  const agent = useragent.parse(req.headers["user-agent"]);
  const userDevice = Device(req.headers["user-agent"]);
  console.log("agent", agent);
  const data = {
    openTime: new Date().toISOString(),
    UserAgent: req.headers["user-agent"],
    agentVersion: agent.toVersion(),
    device: agent.device.toString(),
    deviceVersion: agent.device.toVersion(),
    deviceType: userDevice.type,
    os: agent.toString(),
    osVersion: agent.os.toVersion(),
    isMobileHeader: req.headers["cloudfront-is-mobile-viewer"] === "true",
    isMobileRequest: req.params.layout === "mobile",
    geoRealIP: req.headers["geo-real-ip"],
    geoCountryCode: req.headers["geo-country_code"],
    geoCity: req.headers["geo-city"],
    geoLat: req.headers["geo-latitude"],
    geoLong: req.headers["geo-longitude"],
    recommendations: recommendations
  };
  userData = userData.concat(data);
  userData = userData.sort(function(a, b) {
    return b.openTime < a.openTime ? -1 : b.openTime > a.openTime ? 1 : 0;
  });
  userData = userData.slice(0, 30);
  await redis.set(key, JSON.stringify(userData));
}
