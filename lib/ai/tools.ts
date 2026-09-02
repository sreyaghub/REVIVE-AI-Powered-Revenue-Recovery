import { getDashboardMetrics } from "@/lib/data/metrics";
import { getRecoveryOpportunities } from "@/lib/scoring/engine";

export async function executeTool(toolName: string) {
  if (toolName === "getMerchantMetrics") return await getDashboardMetrics();
  if (toolName === "findRecoveryOpportunities") return await getRecoveryOpportunities();
  return { error: `Unknown tool: ${toolName}` };
}

export const aiToolsDefinition = [
  {
    type: "function",
    function: { name: "getMerchantMetrics", description: "Get financial summary metrics.", parameters: { type: "object", properties: {} } }
  },
  {
    type: "function",
    function: { name: "findRecoveryOpportunities", description: "List failed payments to recover.", parameters: { type: "object", properties: {} } }
  }
];