import InfoPageLayout from '@/components/InfoPageLayout';

export default function PrivacyPage() {
  return (
    <InfoPageLayout 
      title="Privacy Policy" 
      subtitle="How we protect your data and performance metrics."
    >
      <div className="space-y-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Data Collection</h2>
          <p>
            We collect data related to your practice sessions, including question attempts, time-to-answer, and overall accuracy. This data is used solely to calibrate the adaptive difficulty algorithm.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. Data Security</h2>
          <p>
            Your information is stored using industry-standard encryption. We use JWT (JSON Web Tokens) to ensure that your session data is secure and inaccessible to unauthorized parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. Third-Party Services</h2>
          <p>
            We use Firebase for authentication and MongoDB for data persistence. These services are selected for their high security standards and reliability.
          </p>
        </section>

        <section className="space-y-4 text-xs text-zinc-600 italic">
          <p>Last Updated: April 23, 2026</p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
