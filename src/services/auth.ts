import { AuthResponse } from "../types";
import fetch from "node-fetch";

const endpoint = process.env.API_HOST || "api.luxgroup.com";

export async function getUser(requestHeaders: any): Promise<AuthResponse> {
  const url = "http://prod-svc-auth.lescapes.com/current_user";
  console.log('whats the url', url);
  delete requestHeaders.host;
  requestHeaders.origin = 'https://luxuryescapes.com'
  const options = {
    method: "GET",
    headers: requestHeaders
  };
  console.log('whats the headers', options);
  try {
    const resp = await fetch(url, options);
    if (resp.status !== 200) {
      console.log(resp);
      return {status: resp.status, user: undefined}
    }
    const authUser = await resp.json();
    console.log('whats the user', authUser);
    return { status: resp.status, user: authUser };
  } catch (err) {
    console.log('error authenticating', err);
    return { status: 400, user: undefined };
  }
}
