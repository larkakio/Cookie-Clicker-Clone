export function formatCookies(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n < 1000) return Math.floor(n).toString();
  const units = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
  let u = 0;
  let x = n;
  while (x >= 1000 && u < units.length - 1) {
    x /= 1000;
    u += 1;
  }
  const digits = u === 0 ? 0 : x >= 100 ? 0 : x >= 10 ? 1 : 2;
  return `${x.toFixed(digits)}${units[u]}`;
}
