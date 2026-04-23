import InfoPageLayout from '@/components/InfoPageLayout';

export default function TermsPage() {
  return (
    <InfoPageLayout 
      title="Terms of Service" 
      subtitle="The rules of engagement for our adaptive learning platform."
    >
      <div className="space-y-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Adaptive. platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. User Accounts</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their account credentials. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. Intellectual Property</h2>
          <p>
            All content, including but not limited to question banks, algorithms, and UI designs, is the property of Adaptive. and protected by copyright laws. Users are granted a limited, non-transferable license to use the platform for educational purposes.
          </p>
        </section>

        <section className="space-y-4 text-xs text-zinc-600 italic">
          <p>Last Updated: April 23, 2026</p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
