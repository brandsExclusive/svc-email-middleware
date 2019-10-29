import redis from "./redis"

export default async function analytics(recommendation: object) {
  /*
 all recommendations get agregated and cached
 */
  const date = new Date()
  const dateKey = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
  const result = await redis.get(dateKey) || dateKey: {}
}
