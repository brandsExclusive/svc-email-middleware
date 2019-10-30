import { Request, Response } from "express";
import recommendation from "../lib/recommendation";
import redis from "../lib/redis"

export async function index(
  req: Request,
  res: Response
): Promise<Response | void> {
    let index = 0
    const dateKeys: string[] = []
    while (index <= 30) {
        const date = new Date()
        date.setDate((date.getDate() - index))
        const dateKey = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
        dateKeys.push(dateKey)
        index++
    }
  let results = await redis.mget(dateKeys)
  results = results.filter(result => result !== null)
  let response: object[] = []
  for (var i = 0, len = results.length; i < len; i++) {
      let result = results[i]
      response.push(JSON.parse(result))

  }
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(response));
}

export async function userOpens(
  req: Request,
  res: Response
): Promise<Response | void> {
  const key = `userData-${req.params.userId}`
  const results = await redis.get(key)
  res.setHeader('Content-Type', 'application/json');
  return res.end(results);
}


