import InfoPageLayout from '@/components/InfoPageLayout';
import { ShieldCheck, Lock, FileSearch, Fingerprint, ShieldAlert, Cpu } from 'lucide-react';

export default function SecurityPage() {
  return (
    <InfoPageLayout 
      title="Security Architecture." 
      subtitle="Institutional-grade protocols engineered for total data sovereignty and access control."
    >
      <div className="space-y-20">
        {/* Core Security Pillars */}
        <section className="grid gap-8">
          {[
            { 
              icon: <Fingerprint className="text-blue-500" />, 
              title: "RBAC (Role-Based Access Control)", 
              desc: "Our architecture strictly segregates Student and Instructor environments. Access is dynamically enforced at the edge, ensuring no cross-role data leaks." 
            },
            { 
              icon: <Lock className="text-[#BFFF00]" />, 
              title: "Edge-Optimized JWT Proxy", 
              desc: "Every request passes through an edge-based proxy that verifies 'jose' signed tokens. Invalid or expired sessions are intercepted before they reach the core API." 
            },
            { 
              icon: <ShieldAlert className="text-purple-500" />, 
              title: "Cryptographic Hashing", 
              desc: "We utilize bcrypt-based salting for all local credentials, ensuring that sensitive data is never stored in plain text across our MongoDB clusters." 
            }
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row gap-8 items-start">
              <div className="h-14 w-14 rounded-2xl bg-white/[0.03] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">{item.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Technical Deep Dive */}
        <section className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-10">
          <div className="flex items-center gap-4">
             <Cpu className="text-blue-500" />
             <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Infrastructure Stack</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
               <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Authentication Flow</h4>
               <p className="text-sm leading-loose">
                  Integrated Firebase Google OAuth provides a seamless entry point, which is then mapped to our internal JWT session management for stateless, high-performance authorization.
               </p>
            </div>
            <div className="space-y-4">
               <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Persistence Layer</h4>
               <p className="text-sm leading-loose">
                  Prisma ORM facilitates secure, type-safe communication with our database, preventing common vulnerabilities like SQL injection while maintaining strict data schema integrity.
               </p>
            </div>
          </div>
        </section>
      </div>
    </InfoPageLayout>
  );
}
