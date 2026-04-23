import InfoPageLayout from '@/components/InfoPageLayout';
import { Target, Zap, BrainCircuit, Sparkles, Activity, Layers } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <InfoPageLayout 
      title="Adaptive Intelligence." 
      subtitle="How we quantify mastery and recalibrate the learning path using generative AI and real-time heuristics."
    >
      <div className="space-y-24">
        {/* Core Pillars */}
        <section className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Sparkles className="text-blue-500" />, 
              title: "Gemini AI Synthesis", 
              desc: "Our 'QuestionManager' utilizes Google Gemini 1.5 Pro to synthesize context-aware problems that strictly adhere to instructor-defined complexity constraints." 
            },
            { 
              icon: <Activity className="text-[#BFFF00]" />, 
              title: "Dynamic Recalibration", 
              desc: "Every attempt is weighted by time-to-answer and accuracy. If mastery exceeds the threshold, the system shifts the learning node to the next complexity tier." 
            },
            { 
              icon: <Layers className="text-purple-500" />, 
              title: "Prisma Data Schema", 
              desc: "We maintain a granular history of user attempts, allowing for high-resolution performance analytics and predictive difficulty mapping." 
            }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white">{item.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Technical Process Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">The Neural Feedback Loop.</h2>
            <div className="space-y-6 text-zinc-400">
              <p>
                Unlike static question banks, Adaptive. employs a continuous feedback loop. When a student submits a response, our server-side logic (implemented in `/api/attempts`) calculates a 'Performance Delta'.
              </p>
              <p>
                This delta influences the selection of the next 'Node' in the database. Instructors can monitor this in real-time through the Analytics Dashboard, identifying which complexity levels (1-10) are currently acting as hurdles for the cohort.
              </p>
            </div>
          </div>
          
          {/* Visual Representative Logic Card */}
          <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-zinc-900 border border-white/5 space-y-6">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Algorithm Logic v2.4</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#BFFF00]">Active</span>
             </div>
             <div className="space-y-4 font-mono text-[11px] text-zinc-500">
                <p className="text-blue-400">// Calibration Phase</p>
                <p>const delta = (accuracy * 0.7) + (timeEfficiency * 0.3);</p>
                <p>if (delta {'>'} threshold) shiftDifficulty('+1.0');</p>
                <p className="text-zinc-600">else maintainCurrentNode();</p>
             </div>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
}
