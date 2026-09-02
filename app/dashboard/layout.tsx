import Link from "next/link";
import React from "react";
import { LayoutDashboard, MessageSquare, Target, CheckCircle2, History, ShieldAlert } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-[#0f0f0f] p-4 flex flex-col">
        <div className="mb-8 px-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center font-bold">R</div>
          <span className="text-xl font-semibold tracking-tight">REVIVE</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
          <NavItem href="/dashboard/ai" icon={<MessageSquare />} label="AI Command Center" />
          <NavItem href="/dashboard/recovery" icon={<Target />} label="Opportunities" />
          <NavItem href="/dashboard/approvals" icon={<CheckCircle2 />} label="Approvals" />
          <NavItem href="/dashboard/activity" icon={<History />} label="Audit Log" />
        </nav>

        <div className="mt-auto pt-4 border-t border-neutral-800">
          <NavItem href="/dashboard/failure-lab" icon={<ShieldAlert className="text-amber-500"/>} label="Failure Lab" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 transition-colors">
      {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
      {label}
    </Link>
  );
}