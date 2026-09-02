'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

export default function AICoPilotPage() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello! Ask me about your revenue leaks or high-probability checkouts.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      
      // If the backend sends an error, display it clearly
      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: `⚠️ Backend Error: ${data.error}` }]);
        return;
      }
      
      setMessages([...newMessages, { role: 'assistant', content: data.content }]);
    } catch (err: any) {
      setMessages([...newMessages, { role: 'assistant', content: `⚠️ Network Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <h1 className="text-2xl font-semibold flex items-center gap-2"><Sparkles className="text-emerald-400" /> AI Command Center</h1>
      
      <div className="flex gap-2">
        <button onClick={() => handleSend("Find my biggest revenue leak.")} className="text-xs px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-emerald-500 hover:text-emerald-400">Find my biggest leak</button>
        <button onClick={() => handleSend("Show me today's recovery opportunities.")} className="text-xs px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-emerald-500 hover:text-emerald-400">Show opportunities</button>
      </div>

      <Card className="flex-1 bg-neutral-900 border-neutral-800 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-neutral-800 py-3 bg-neutral-950/40">
          <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Llama 3 (Groq Lightning)
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 max-w-xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-neutral-800' : 'bg-emerald-950 text-emerald-400'}`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-xl text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-neutral-800/60 text-neutral-200'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-neutral-500 text-sm flex gap-2"><Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> Thinking...</div>}
        </CardContent>

        <div className="p-4 border-t border-neutral-800 bg-neutral-950/40 flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask AI..." className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 text-sm text-neutral-100 focus:outline-none focus:border-emerald-500" />
          <Button onClick={() => handleSend()} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500"><Send className="w-4 h-4" /></Button>
        </div>
      </Card>
    </div>
  );
}