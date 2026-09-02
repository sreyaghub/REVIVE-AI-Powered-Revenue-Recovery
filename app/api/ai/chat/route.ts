import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { aiToolsDefinition, executeTool } from '@/lib/ai/tools';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// We define the model here so it's easy to change. 
// If this one ever fails, you can change it to "mixtral-8x7b-32768"
const MODEL_NAME = "openai/gpt-oss-20b";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const systemPrompt = `You are REVIVE AI, an expert revenue recovery assistant. Be concise, data-driven, and format currency in INR. Use tools to get real data.`;

    const cleanMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content || ""
    }));

    const formattedMessages = [{ role: "system", content: systemPrompt }, ...cleanMessages];

    // First LLM call
    const completion = await groq.chat.completions.create({
      model: MODEL_NAME, 
      messages: formattedMessages as any,
      tools: aiToolsDefinition as any,
      tool_choice: "auto",
    });

    const responseMessage = completion.choices[0].message;

    // If the AI uses a tool
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      const toolResult = await executeTool(toolCall.function.name);

      const secondRoundMessages = [
        ...formattedMessages,
        responseMessage,
        { role: "tool", tool_call_id: toolCall.id, name: toolCall.function.name, content: JSON.stringify(toolResult) }
      ];

      // Second LLM call
      const secondCompletion = await groq.chat.completions.create({
        model: MODEL_NAME,
        messages: secondRoundMessages as any,
      });

      return NextResponse.json({ role: "assistant", content: secondCompletion.choices[0].message.content });
    }

    return NextResponse.json({ role: "assistant", content: responseMessage.content });
  } catch (error: any) {
    console.error("🚨 Groq API Error:", error); 
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}