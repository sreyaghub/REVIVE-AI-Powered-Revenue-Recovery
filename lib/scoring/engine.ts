import fs from 'fs/promises';
import path from 'path';

export async function calculateRecoveryScore(transaction: any, customer: any) {
  let score = 50; 
  const factors = [];
  
  if (transaction.failureReason === 'upi_timeout') {
    score += 35;
    factors.push('UPI timeouts are highly recoverable (temporary network issue).');
  } else if (transaction.failureReason === 'bank_declined') {
    score -= 10;
    factors.push('Bank declines require customer to switch payment methods.');
  }

  if (customer && customer.successfulPayments > 5) {
    score += 15;
    factors.push('Customer has a strong history of successful payments.');
  }

  const finalScore = Math.max(1, Math.min(99, score));
  return { score: finalScore, factors };
}

export async function getRecoveryOpportunities() {
  const txPath = path.join(process.cwd(), 'data', 'transactions.json');
  const custPath = path.join(process.cwd(), 'data', 'customers.json');
  
  const [txData, custData] = await Promise.all([
    fs.readFile(txPath, 'utf8'),
    fs.readFile(custPath, 'utf8')
  ]);

  const transactions = JSON.parse(txData);
  const customers = JSON.parse(custData);
  const failedTxns = transactions.filter((t: any) => t.status === 'failed');
  
  const opportunities = await Promise.all(failedTxns.map(async (txn: any) => {
    const customer = customers.find((c: any) => c.id === txn.customerId);
    const evaluation = await calculateRecoveryScore(txn, customer);
    return { transaction: txn, customer, evaluation };
  }));

  return opportunities.sort((a, b) => b.evaluation.score - a.evaluation.score);
}