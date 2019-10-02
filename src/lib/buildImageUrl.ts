const BUCKET_ID = process.env.BUCKET_ID || "5d1cc61721e094004b0877df";

export default function buildImageUrl(productCode: string): string {
  return `https://pi-templates.s3.us-east-1.amazonaws.com/production/${BUCKET_ID}/${productCode}~1.png`;
}
