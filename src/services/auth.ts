import { AuthResponse } from "../types";
import fetch from "node-fetch";

const endpoint = process.env.API_HOST || "api.luxgroup.com";

export async function getUser(requestHeaders: any): Promise<AuthResponse> {
  const url = "https://" + endpoint + "/current_user";
  delete requestHeaders.host;
  const options = {
    method: "GET",
    headers: requestHeaders
  };
  try {
    const resp = await fetch(url, options);
    const authUser = await resp.json();
    return { status: resp.status, user: authUser };
  } catch (err) {
    console.log('error authenticating', err, resp);
    return { status: 400, user: undefined };
  }
}
