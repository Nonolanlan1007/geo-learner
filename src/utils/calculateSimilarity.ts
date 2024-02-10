export default function calculateStringSimilarity(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const maxLength = Math.max(m, n);

  if (maxLength === 0) {
    return 100;
  }

  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [];
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + (str1.charAt(i - 1) === str2.charAt(j - 1) ? 0 : 1),
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1
        );
      }
    }
  }

  const distance = dp[m][n];
  return ((maxLength - distance) / maxLength) * 100;
}