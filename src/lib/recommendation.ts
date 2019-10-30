import { Request } from "express";
import einstein from "../services/einstein";
import redis from "./redis";
import timeout from "../lib/timeout";
import { IRecommendation } from "../types";

export default async function recommendation(
  req: Request
): Promise<IRecommendation> {
  return new Promise(
    async (resolve, reject): Promise<IRecommendation | void> => {
      let allRecommendations;
      allRecommendations = await redis.get(req.params.userId);

      //  If the recommendations are not in the cache call Einstein and put them in the cache
      if (!allRecommendations) {
        let hasCalledEinstein = await redis.get(`called-${req.params.userId}`);
        if (!hasCalledEinstein) {
          hasCalledEinstein = await redis.set(
            `called-${req.params.userId}`,
            true,
            "EX",
            15
          );
          await einstein(redis, req);
          allRecommendations = await redis.get(req.params.userId);
        } else {
          await timeout(20);
          return resolve(recommendation(req));
        }
      }

      allRecommendations = JSON.parse(allRecommendations);
      const recommendations = allRecommendations.filter(rec => {
        if (rec.name === req.params.recommendationId) {
          return rec;
        }
      })[0];
      if (recommendations && recommendations.items) {
        return resolve(recommendations.items[req.params.index]);
      } else {
        return reject(
          new Error(
            `no recommendations found for req.params.recommendationId: ${req.params.recommendationId} req.params.index ${req.params.index}`
          )
        );
      }
    }
  );
}
