import redis from "./redis";
import { IRecommendations } from "../types";
import { Request } from "express";
import * as useragent from "useragent";
import * as MobileDetect from "mobile-detect";

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

function getUserAgentString(req: Request): string {
  return req.headers["user-agent"] ? req.headers["user-agent"] : "";
}

export function getDeviceData(req: Request) {
  const userAgentString = getUserAgentString(req);
  const agent = useragent.parse(userAgentString);
  const userDevice = new MobileDetect(userAgentString);
  req.headers["agentVersion"] = agent.toVersion();
  req.headers["device"] = agent.device.toString();
  req.headers["deviceVersion"] = agent.device.toVersion();
  req.headers["deviceType"] = userDevice.mobile();
  req.headers["os"] = agent.toString();
  req.headers["mobileOS"] = userDevice.os();
  req.headers["osVersion"] = agent.os.toVersion();
}

export async function userAnalytics(
  recommendations: IRecommendations[],
  req: Request
) {
  const key = `userData-${req.params.userId}`;
  let userData = JSON.parse(await redis.get(key)) || [];
  const data = {
    openTime: new Date().toISOString(),
    userAgent: req.headers["user-agent"],
    agentVersion: req.headers["agentVersion"],
    device: req.headers["device"],
    deviceVersion: req.headers["deviceVersion"],
    deviceType: req.headers["deviceType"],
    os: req.headers["os"],
    mobileOS: req.headers["mobileOS"],
    osVersion: req.headers["osVersion"],
    isMobileHeader: req.headers["cloudfront-is-mobile-viewer"] === "true",
    isMobileRequest: req.params.layout === "mobile",
    isMobileDevice: req.headers["deviceType"] === "phone",
    region: req.headers["geo-region"],
    regionName: req.headers["geo-region-name"],
    continentCode: req.headers["geo-continent_code"],
    countryCode: req.headers["geo-country_code"],
    city: req.headers["geo-city"],
    geoCharset: req.headers["geo-charset"],
    longitude: req.headers["geo-longitude"],
    latitude: req.headers["geo-latitude"],
    recommendations: recommendations
  };
  userData = userData.concat(data);
  userData = userData.sort(function(a, b) {
    return b.openTime < a.openTime ? -1 : b.openTime > a.openTime ? 1 : 0;
  });
  userData = userData.slice(0, 30);
  await redis.set(key, JSON.stringify(userData));
}
