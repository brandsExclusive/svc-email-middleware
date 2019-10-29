import einstein from "../services/einstein";
import redis from "./redis"
import timeout from "../lib/timeout";
import { IRecommendation } from "../types";

export default async function recommendation(
  userId: string,
  recommendationId: string,
  index: string
): Promise<IRecommendation> {
  return new Promise(
    async (resolve, reject): Promise<IRecommendation | void> => {
      let allRecommendations;
      allRecommendations = await redis.get(userId);

      //  If the recommendations are not in the cache call Einstein and put them in the cache
      if (!allRecommendations) {
        let hasCalledEinstein = await redis.get(`called-${userId}`);
        if (!hasCalledEinstein) {
          hasCalledEinstein = await redis.set(
            `called-${userId}`,
            true,
            "EX",
            15
          );
          await einstein(userId, recommendationId, redis);
          allRecommendations = await redis.get(userId);
        } else {
          await timeout(20);
          return resolve(recommendation(userId, recommendationId, index));
        }
      }

      allRecommendations = JSON.parse(allRecommendations);
      const recommendations = allRecommendations.filter(rec => {
        if (rec.name === recommendationId) {
          return rec;
        }
      })[0];
      if (recommendations && recommendations.items) {
        return resolve(recommendations.items[index]);
      } else {
        return reject(
          new Error(
            `no recommendations found for recommendationId: ${recommendationId} index ${index}`
          )
        );
      }
    }
  );
}
