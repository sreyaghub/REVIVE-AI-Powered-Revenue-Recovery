export const dynamic = "force-dynamic";

import fs from 'fs/promises';
import path from 'path';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Bot, ShieldAlert } from "lucide-react";

async function getAuditLogs() {
  try {
    const logPath = path.join(process.cwd(), 'data', 'auditLogs.json');
    const data = await fs.readFile(logPath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export default async function ActivityPage() {
  const logs = await getAuditLogs();

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-semibold mb-1">System Audit Log</h1>
        <p className="text-neutral-400 text-sm">Immutable record of all AI decisions, policy enforcements, and financial actions.</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg text-neutral-200">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-neutral-500 text-sm">No activity recorded yet. Run a recovery or failure simulation to generate logs.</p>
          ) : (
            logs.map((log: any) => (
              <div key={log.id} className="flex gap-4 p-4 rounded-lg bg-neutral-950/50 border border-neutral-800">
                <div className="mt-1">
                  {log.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : log.agent === 'System' ? (
                    <Bot className="w-5 h-5 text-blue-500" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-200">{log.action}</p>
                    <span className="text-xs text-neutral-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">Agent: {log.agent} | Target: {log.transactionId || 'System'}</p>
                  
                  {log.details && (
                    <div className="mt-2 p-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-mono break-all">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}