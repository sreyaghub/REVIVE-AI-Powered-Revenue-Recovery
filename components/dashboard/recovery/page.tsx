import { getRecoveryOpportunities } from "@/lib/scoring/engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { RecoveryTable } from "@/components/dashboard/RecoveryTable";

export default async function RecoveryPage() {
  const opportunities = await getRecoveryOpportunities();

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Recovery Opportunities</h1>
        <p className="text-neutral-400 text-sm">AI has identified and scored failed payments based on historical recoverability.</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg text-neutral-200">Actionable Checkouts</CardTitle>
        </CardHeader>
        <CardContent>
          {/* We use our new Client Component here */}
          <RecoveryTable opportunities={opportunities} />
        </CardContent>
      </Card>
      
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-950/20 border border-blue-900/50 text-blue-400 text-sm">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <p>
          <strong>Safety Rule:</strong> Scores and explanations are calculated deterministically via the backend rules engine. 
          LLMs are only used for telemetry analysis, never for direct financial execution.
        </p>
      </div>
    </div>
  );
}