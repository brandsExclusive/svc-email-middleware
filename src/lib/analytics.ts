import redis from "./redis"
import { IRecommendations } from '../types'

export default async function analytics(recommendation: IRecommendations[]) {
  /*
 all recommendations get agregated and cached
 */
  const date = new Date()
  const dateKey = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
  await redis.unset(dateKey)
  const result = JSON.parse(await redis.get(dateKey)) || {}
  console.log('the current result is', result, recommendation); recommendation.forEach(rec => {
    console.log('setting recommendations');
    const recResult = result[rec.name] || {name: rec.name, title: rec.title, offers: {}}
    console.log('recResult', recResult);
    for (var index = 0, len = rec.items.length; index < len; index++) {
      const item = rec.items[index]
      console.log('item', item);
      const offerData = recResult.offers[item.product_code] || {totalViews: 0, indexViews: {}}
      console.log('offerData', offerData);
      offerData.totalViews = offerData.totalViews + 1
      offerData.indexViews[index] = offerData.indexViews[index] + 1 || 1
      recResult.offers[item.product_code] = offerData
      console.log('recResult', recResult);
      console.log('result', result);
      result[rec.name] = recResult
    }
  })
  console.log('the new result is ', result);
  await redis.set(dateKey, JSON.stringify(result))
}
