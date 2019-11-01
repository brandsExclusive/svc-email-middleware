const MOBILE_BUCKET_ID =
  process.env.MOBILE_BUCKET_ID || "5bbbf546d98e0373c1f51287";
const DESKTOP_BUCKET_ID =
  process.env.DESKTOP_BUCKET_ID || "5bbbf546c302b72b28aab603";

export default function buildImageUrl(
  productCode: string,
  isMobile: boolean,
  locale?: string
): string {
  let url = "";
  if (isMobile) {
    url = `https://pi-templates.s3.us-east-1.amazonaws.com/production/${MOBILE_BUCKET_ID}/${productCode}~1`;
  } else {
    url = `https://pi-templates.s3.us-east-1.amazonaws.com/production/${DESKTOP_BUCKET_ID}/${productCode}~1`;
  }
  if (locale) {
    url = `${url}_${locale}`;
  }
  return `${url}.png`;
}
