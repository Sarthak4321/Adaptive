import InfoPageLayout from '@/components/InfoPageLayout';

export default function AboutPage() {
  return (
    <InfoPageLayout 
      title="Beyond Static Learning." 
      subtitle="We believe the most effective learning happens at the edge of your current ability. Not too easy, not too hard."
    >
      <section className="space-y-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            <p>
              Adaptive. was founded on the principle that educational technology should be as dynamic as the students who use it. Traditional practice systems follow linear paths that often fail to account for individual mastery rates, leading to boredom for some and frustration for others.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">The Vision</h2>
            <p>
              We are building a future where every student has a personalized learning path that evolves in real-time. By leveraging advanced performance metrics, we help instructors spend less time grading and more time intervening where it matters most.
            </p>
          </div>
        </div>

        <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
          <h2 className="text-3xl font-bold text-white">Production-Grade Infrastructure</h2>
          <p className="text-lg">
            Our platform is built for reliability. From secure JWT-based authentication to a robust MongoDB backbone, every interaction is engineered for speed and security. We don't just provide a tool; we provide a foundation for academic excellence.
          </p>
        </div>
      </section>
    </InfoPageLayout>
  );
}
