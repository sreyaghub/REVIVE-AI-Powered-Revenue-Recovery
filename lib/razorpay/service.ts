import Razorpay from 'razorpay';
import fs from 'fs/promises';
import path from 'path';

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  try {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (e) {
    return null;
  }
};

export async function executeRecovery(transactionId: string) {
  const txPath = path.join(process.cwd(), 'data', 'transactions.json');
  const custPath = path.join(process.cwd(), 'data', 'customers.json');
  const logPath = path.join(process.cwd(), 'data', 'auditLogs.json');
  
  const [txData, custData, logsData] = await Promise.all([
    fs.readFile(txPath, 'utf8'),
    fs.readFile(custPath, 'utf8'),
    fs.readFile(logPath, 'utf8').catch(() => "[]")
  ]);

  const transactions = JSON.parse(txData);
  const customers = JSON.parse(custData);
  const logs = JSON.parse(logsData);
  
  // Find the exact transaction index so we can update it later
  const transactionIndex = transactions.findIndex((t: any) => t.id === transactionId);
  if (transactionIndex === -1) throw new Error("Transaction not found");
  
  const transaction = transactions[transactionIndex];
  const customer = customers.find((c: any) => c.id === transaction.customerId);
  const rzp = getRazorpayInstance();

  let paymentLinkUrl = "";
  let isSimulated = false;

  if (rzp && process.env.RAZORPAY_KEY_ID?.startsWith('rzp_')) {
    try {
      const paymentLink = await rzp.paymentLink.create({
        amount: transaction.amount * 100, 
        currency: "INR",
        accept_partial: false,
        description: `REVIVE Recovery for Order ${transaction.id}`,
        customer: {
          name: customer?.name || "Customer",
          email: customer?.email || "customer@example.com",
          contact: customer?.phone || "+919999999999"
        },
        notify: { sms: true, email: true },
        reminder_enable: true,
        notes: { policy_name: "REVIVE_AI_RECOVERY" }
      });
      paymentLinkUrl = paymentLink.short_url;
    } catch (error) {
      console.error("Razorpay API Error:", error);
      isSimulated = true;
      paymentLinkUrl = `https://rzp.io/i/simulated_${transactionId}`;
    }
  } else {
    isSimulated = true;
    paymentLinkUrl = `https://rzp.io/i/simulated_${transactionId}`;
  }

  // 1. Write securely to the Audit Log
  logs.unshift({
    id: `LOG_${Date.now()}`,
    timestamp: new Date().toISOString(),
    agent: "Recovery Agent",
    action: isSimulated ? "Simulated Payment Link" : "Created Payment Link (Test Mode)",
    transactionId: transactionId,
    status: "success",
    details: `Generated link: ${paymentLinkUrl}`
  });
  await fs.writeFile(logPath, JSON.stringify(logs, null, 2));

  // 2. 🟢 THE FIX: Update the transaction status so it disappears from the table!
  transactions[transactionIndex].status = 'recovery_initiated';
  await fs.writeFile(txPath, JSON.stringify(transactions, null, 2));

  return { success: true, url: paymentLinkUrl, isSimulated };
}