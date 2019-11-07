import { AuthResponse } from "../types";
import fetch from "node-fetch";

export async function getUser(requestHeaders: any): Promise<AuthResponse> {
  const url = "http://prod-svc-auth.lescapes.com/current_user";
  delete requestHeaders.host;
  requestHeaders.origin = "https://luxuryescapes.com";
  const options = {
    method: "GET",
    headers: requestHeaders
  };
  try {
    const resp = await fetch(url, options);
    if (resp.status !== 200) {
      console.log(resp);
      return { status: resp.status, user: undefined };
    }
    const authUser = await resp.json();
    return { status: resp.status, user: authUser };
  } catch (err) {
    console.log("error authenticating", err);
    return { status: 400, user: undefined };
  }
}
