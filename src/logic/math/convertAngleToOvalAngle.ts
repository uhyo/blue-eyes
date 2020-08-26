export function convertAngleToOvalAngle(
  circleAngle: number,
  xRadius: number,
  yRadius: number
): number {
  const cx = Math.cos(circleAngle);
  const cy = Math.sin(circleAngle);
  const scaledY = (cy * xRadius) / yRadius;
  const ovalAngle = Math.atan2(scaledY, cx);
  return ovalAngle;
}
