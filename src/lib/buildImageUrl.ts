const MOBILE_BUCKET_ID =
  process.env.MOBILE_BUCKET_ID || "5bbbf546d98e0373c1f51287";
const DESKTOP_BUCKET_ID =
  process.env.DESKTOP_BUCKET_ID || "5bbbf546c302b72b28aab603";

export default function buildImageUrl(
  productCode: string,
  isMobile: boolean,
  locale = "au_au"
): string {
  if (isMobile) {
    return `https://pi-templates.s3.us-east-1.amazonaws.com/production/${MOBILE_BUCKET_ID}/${productCode}~1_${locale}.png`;
  } else {
    return `https://pi-templates.s3.us-east-1.amazonaws.com/production/${DESKTOP_BUCKET_ID}/${productCode}~1_${locale}.png`;
  }
}
