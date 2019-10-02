export default function timeout(ms): Promise<null> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
