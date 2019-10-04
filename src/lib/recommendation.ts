import einstein from "../services/einstein";
import * as Redis from "ioredis";
import timeout from "../lib/timeout";

const redis = new Redis(process.env.REDIS_URL);

export default async function recommendation(
  userId: string,
  recommendationId: string,
  index: string
): Promise<string> {
  return new Promise(
    async (resolve, reject): Promise<string|void> => {
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
          allRecommendations = await redis.get(recommendationId);
        } else {
          await timeout(20);
          return resolve(recommendation(userId, recommendationId, index));
        }
      }

      allRecommendations = JSON.parse(allRecommendations);
      console.log('what is allRecommendations', allRecommendations);
      const recommendations = allRecommendations.filter(rec => {
        if (rec.name === recommendationId) {
          return rec;
        }
      })[0];
      if (recommendations && recommendations.items) {
        return resolve(recommendations.items[index].product_code);
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
