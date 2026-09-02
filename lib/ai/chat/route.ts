import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { aiToolsDefinition, executeTool } from '@/lib/ai/tools';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const systemPrompt = `You are REVIVE AI, an expert revenue recovery assistant. Be concise, data-driven, and format currency in INR. Use tools to get real data.`;

    const formattedMessages = [{ role: "system", content: systemPrompt }, ...messages];

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192", // Fast, reliable model for tool calling
      messages: formattedMessages as any,
      tools: aiToolsDefinition as any,
      tool_choice: "auto",
    });

    const responseMessage = completion.choices[0].message;

    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      const toolResult = await executeTool(toolCall.function.name);

      const secondRoundMessages = [
        ...formattedMessages,
        responseMessage,
        { role: "tool", tool_call_id: toolCall.id, name: toolCall.function.name, content: JSON.stringify(toolResult) }
      ];

      const secondCompletion = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: secondRoundMessages as any,
      });

      return NextResponse.json({ role: "assistant", content: secondCompletion.choices[0].message.content });
    }

    return NextResponse.json({ role: "assistant", content: responseMessage.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}