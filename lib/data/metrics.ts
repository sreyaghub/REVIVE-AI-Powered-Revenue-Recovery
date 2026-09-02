import fs from 'fs/promises';
import path from 'path';

export async function getDashboardMetrics() {
  const filePath = path.join(process.cwd(), 'data', 'transactions.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const transactions = JSON.parse(fileContents);

  let totalRevenue = 0;
  let revenueAtRisk = 0;
  let recoveredRevenue = 0;
  let failedCount = 0;
  let recoveredCount = 0;

  transactions.forEach((txn: any) => {
    if (txn.status === 'success' || txn.status === 'recovered') {
      totalRevenue += txn.amount;
    }
    if (txn.status === 'failed') {
      revenueAtRisk += txn.amount;
      failedCount++;
    }
    if (txn.status === 'recovered') {
      recoveredRevenue += txn.amount;
      recoveredCount++;
    }
  });

  const totalFailuresAndRecoveries = failedCount + recoveredCount;
  const recoveryRate = totalFailuresAndRecoveries > 0 
    ? ((recoveredCount / totalFailuresAndRecoveries) * 100).toFixed(1) 
    : "0.0";

  return {
    totalRevenue,
    revenueAtRisk,
    recoveredRevenue,
    recoveryRate
  };
}