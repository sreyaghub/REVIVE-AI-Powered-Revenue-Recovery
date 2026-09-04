# 🟢 REVIVE: AI-Powered Revenue Recovery

REVIVE is an intelligent, automated revenue recovery platform built for the **Razorpay AI Builder Hackathon**. 

It identifies high-probability failed checkouts, scores their recoverability deterministically, and safely executes fallback strategies (like Razorpay Payment Links) to capture lost revenue.

## 🚀 The Core Philosophy: Safe AI

Unlike standard AI wrappers, REVIVE enforces a strict architectural boundary in fintech:
* **The AI (LLM)** acts strictly as a telemetry analysis agent. It queries data and recommends actions.
* **The Backend Rules Engine** handles all financial scoring, policy checks, and Razorpay API executions deterministically.
* **The AI NEVER executes financial transactions directly.**

## 🛠️ Key Features

* **AI Command Center:** Chat with your live financial data to discover revenue leaks using function-calling (Powered by Groq).
* **Deterministic Scoring Engine:** Ranks failed transactions based on customer LTV and recoverability.
* **Razorpay Integration:** Generates real Razorpay Payment Links (Test Mode) for quick recovery via Next.js Server Actions.
* **Failure Lab:** An interactive terminal simulating a 504 Gateway Timeout to demonstrate Idempotency and safe fallbacks.
* **Immutable Audit Log:** A permanent, uneditable record of every agent decision and Razorpay API call.
* **Zero-Setup Database:** Uses local JSON file hydration to ensure the demo runs instantly on any machine without complex database configuration.

## 💻 Tech Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS, Lucide Icons, shadcn/ui
* **AI Engine:** Groq API SDK (Tool/Function Calling)
* **Payments:** Razorpay Node.js SDK
* **Database:** Local JSON File System (`data/transactions.json`, `data/auditLogs.json`)

## ⚙️ Getting Started (For Collaborators & Judges)

REVIVE is designed to run locally within seconds. There is no external database to configure.

**1. Clone the Repository**
```bash
git clone [https://github.com/sreyaghub/REVIVE-AI-Powered-Revenue-Recovery.git](https://github.com/sreyaghub/REVIVE-AI-Powered-Revenue-Recovery.git)
cd REVIVE-AI-Powered-Revenue-Recovery
