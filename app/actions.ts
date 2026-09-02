'use server';

import { executeRecovery } from '@/lib/razorpay/service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

// --- EXISTING APPROVAL ACTION ---
export async function approveRecoveryAction(formData: FormData) {
  const transactionId = formData.get('transactionId') as string;
  if (!transactionId) return;
  await executeRecovery(transactionId);
  revalidatePath('/dashboard/recovery');
  redirect('/dashboard/recovery'); 
}

// --- NEW FAILURE LAB ACTION ---
export async function simulateFailureAndRecovery() {
  const logPath = path.join(process.cwd(), 'data', 'auditLogs.json');
  let logs = [];
  
  try {
    const data = await fs.readFile(logPath, 'utf8');
    logs = JSON.parse(data);
  } catch (e) {
    logs = [];
  }

  // Generate a realistic sequence of events for a timeout
  const sequence = [
    {
      id: `LOG_${Date.now()}_1`,
      timestamp: new Date().toISOString(),
      agent: "Safety Layer",
      action: "Duplicate recovery prevented",
      transactionId: "TXN_SIMULATED",
      status: "success",
      details: "Idempotency key match: action already in progress."
    },
    {
      id: `LOG_${Date.now()}_2`,
      timestamp: new Date(Date.now() - 1000).toISOString(),
      agent: "Verification Agent",
      action: "Transaction state verified",
      transactionId: "TXN_SIMULATED",
      status: "success",
      details: "State: No previous charges detected."
    },
    {
      id: `LOG_${Date.now()}_3`,
      timestamp: new Date(Date.now() - 2000).toISOString(),
      agent: "Razorpay Service",
      action: "API Gateway Timeout",
      transactionId: "TXN_SIMULATED",
      status: "failed",
      details: "Connection timed out after 3000ms. Fallback triggered."
    }
  ];

  // Add them to the top of the log file
  logs = [...sequence, ...logs];
  await fs.writeFile(logPath, JSON.stringify(logs, null, 2));

  revalidatePath('/dashboard/activity');
}