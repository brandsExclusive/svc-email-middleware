import { Request, Response } from "express";
import redis from "../lib/redis";

export async function index(
  req: Request,
  res: Response
): Promise<Response | void> {
  let index = 0;
  const dateKeys: string[] = [];
  while (index <= 30) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const dateKey = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    dateKeys.push(dateKey);
    index++;
  }
  let results = await redis.mget(dateKeys);
  results = results.filter(result => result !== null);
  const response: object[] = [];
  for (let i = 0, len = results.length; i < len; i++) {
    const result = results[i];
    response.push(JSON.parse(result));
  }
  res.setHeader("Content-Type", "application/json");
  return res.end(JSON.stringify(response));
}
