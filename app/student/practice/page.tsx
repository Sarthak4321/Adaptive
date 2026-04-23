import PracticeSession from "@/components/PracticeSession";

export default function StudentPracticePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-6 sm:py-20 px-4 sm:px-6 relative font-sans">
      <div className="w-full max-w-5xl relative z-10">
        <div className="mb-6 sm:mb-16 text-center space-y-2 sm:space-y-4">
          <h1 className="text-xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">
            Neural <span className="text-blue-600">Practice.</span>
          </h1>
          <p className="hidden sm:block text-slate-400 font-medium text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            A personalized learning environment optimized for cognitive performance and skill mastery.
          </p>
        </div>

        <PracticeSession />
      </div>
    </div>
  );
}


