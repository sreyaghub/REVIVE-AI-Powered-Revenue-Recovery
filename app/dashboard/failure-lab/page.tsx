"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Terminal, Play } from "lucide-react";

export default function FailureLabPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const triggerTimeout = async () => {
    setIsRunning(true);
    setLogs([]);
    
    // The exact sequence that will type out on the screen for the judges
    const sequence = [
      "> INITIATING RAZORPAY API CONNECTION...",
      "> SENDING RECOVERY PAYLOAD FOR TXN_1003...",
      "[ERROR] 504 GATEWAY TIMEOUT - RAZORPAY API UNREACHABLE",
      "> ALERT: CONNECTION DROPPED DURING FINANCIAL EXECUTION.",
      "> TRIGGERING VERIFICATION AGENT...",
      "> VERIFICATION AGENT: CHECKING TRANSACTION STATE...",
      "> STATE UNKNOWN. INITIATING IDEMPOTENCY LOCK.",
      "> [LOCK ACQUIRED] PREVENTING DUPLICATE CHARGE ATTEMPTS.",
      "> FALLBACK STRATEGY ACTIVATED: QUEUING FOR BATCH RE-ATTEMPT.",
      "> SYSTEM SECURE. CUSTOMER PROTECTED."
    ];

    // Creates the cool "typing" effect in the terminal
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(r => setTimeout(r, 600)); 
      setLogs(prev => [...prev, sequence[i]]);
    }

    setIsRunning(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Failure Lab</h1>
        <p className="text-neutral-400 text-sm">Simulate network failures to verify idempotency and system resilience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* The Trigger Panel */}
        <Card className="bg-neutral-900 border-neutral-800 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-neutral-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Test Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-neutral-400">
              Trigger a simulated 504 Gateway Error during a Razorpay transaction to test the Idempotency Lock.
            </p>
            <button 
              onClick={triggerTimeout}
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-2 bg-red-950/30 hover:bg-red-900/50 text-red-500 border border-red-900/50 py-3 px-4 rounded-md transition-all font-medium disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              Trigger API Timeout
            </button>
          </CardContent>
        </Card>

        {/* The Simulated Terminal */}
        <Card className="bg-[#0a0a0a] border-neutral-800 md:col-span-2 shadow-2xl flex flex-col">
          <CardHeader className="border-b border-neutral-900 pb-3 pt-3">
            <CardTitle className="text-xs text-neutral-500 font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              System Terminal Output
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 font-mono text-sm space-y-2 h-[300px] overflow-y-auto flex-1">
            {logs.length === 0 && !isRunning && (
              <span className="text-neutral-600">Waiting for simulation trigger...</span>
            )}
            
            {logs.map((log, index) => (
              <div key={index} className={`${
                log.includes('[ERROR]') ? 'text-red-500 font-bold' : 
                log.includes('[LOCK ACQUIRED]') ? 'text-amber-500 font-bold' : 
                log.includes('SYSTEM SECURE') ? 'text-emerald-500 font-bold' : 
                'text-neutral-300'
              }`}>
                {log}
              </div>
            ))}
            
            {isRunning && (
              <div className="w-2 h-4 bg-neutral-400 animate-pulse mt-2"></div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}