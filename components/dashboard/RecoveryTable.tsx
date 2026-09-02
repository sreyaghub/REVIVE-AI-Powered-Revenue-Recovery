import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, ShieldAlert, ArrowRight, X } from "lucide-react";
import { approveRecoveryAction } from "@/app/actions"; // 🟢 Added this

export function RecoveryTable({ opportunities, reviewId }: { opportunities: any[], reviewId?: string }) {
  const selectedOpp = opportunities.find((o) => o.transaction.id === reviewId);

  return (
    <>
      <Table>
        <TableHeader className="bg-neutral-900/50">
          <TableRow className="border-neutral-800">
            <TableHead className="text-neutral-400">Customer</TableHead>
            <TableHead className="text-neutral-400">Amount</TableHead>
            <TableHead className="text-neutral-400">Failure Reason</TableHead>
            <TableHead className="text-neutral-400">Score</TableHead>
            <TableHead className="text-neutral-400 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opp) => (
            <TableRow key={opp.transaction.id} className="border-neutral-800 hover:bg-neutral-800/50">
              <TableCell>
                <div className="font-medium text-neutral-200">{opp.customer?.name}</div>
                <div className="text-xs text-neutral-500">{opp.transaction.id}</div>
              </TableCell>
              <TableCell className="font-medium text-neutral-200">₹{opp.transaction.amount}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-amber-500 border-amber-900/50 bg-amber-950/20">
                  {opp.transaction.failureReason.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className={`font-bold ${opp.evaluation.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {opp.evaluation.score}%
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Link 
                  href={`/dashboard/recovery?review=${opp.transaction.id}`}
                  className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-md text-sm font-medium"
                >
                  Review
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedOpp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f0f] border border-neutral-800 rounded-xl w-full max-w-[500px] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-100">Recovery Assessment</h2>
              <Link href="/dashboard/recovery" className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors">
                <X className="w-5 h-5" />
              </Link>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg border border-neutral-800">
                <div>
                  <div className="text-sm text-neutral-400">Transaction Value</div>
                  <div className="text-2xl font-semibold text-white">₹{selectedOpp.transaction.amount}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-400">Recovery Score</div>
                  <div className={`text-2xl font-bold ${selectedOpp.evaluation.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedOpp.evaluation.score}%
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-neutral-400 mb-3 uppercase tracking-wider">Evidence & Factors</h4>
                <ul className="space-y-3">
                  {selectedOpp.evaluation.factors.map((factor: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-neutral-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-900/50 flex gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-400">Policy Engine Result</div>
                  <div className="text-sm text-blue-300/80 mt-1">
                    {selectedOpp.transaction.amount > 5000 
                      ? "High value transaction. Requires manual merchant approval to generate Payment Link."
                      : "Eligible for immediate Razorpay Payment Link generation."}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-900/50 rounded-b-xl">
              <Link href="/dashboard/recovery" className="px-4 py-2 rounded-md text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white">
                Cancel
              </Link>
              
              {/* 🟢 THE FIX 🟢 */}
              <form action={approveRecoveryAction}>
                <input type="hidden" name="transactionId" value={selectedOpp.transaction.id} />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center cursor-pointer">
                  Approve & Recover <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </form>

            </div>
          </div>
        </div>
      )}
    </>
  );
}