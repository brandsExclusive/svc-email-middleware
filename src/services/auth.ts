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
  let resp;
  try {
    resp = await fetch(url, options);
  } catch (err) {
    return { status: resp.status, user: undefined };
  }
  if (resp.status !== 200) {
    return { status: resp.status, user: undefined };
  }
  const authUser = await resp.json();
  return { status: resp.status, user: authUser };
}
