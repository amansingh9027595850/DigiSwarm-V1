import LegalPage from '@/components/common/LegalPage';

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    body: [
      'DigiSwarm ("we", "our", or "us") respects your privacy. This Privacy Policy explains what personal data we collect, how we use it, and the choices you have when you interact with our website, products, and services.',
      'By accessing or using DigiSwarm, you agree to the practices described in this policy.',
    ],
  },
  {
    id: 'information-we-collect',
    title: '2. Information we collect',
    body: [
      'We collect personal information you provide directly to us when you submit forms, request quotes, apply for jobs, or contact us. This may include:',
      {
        items: [
          'Contact details (name, email, phone, company)',
          'Project details and any attachments you upload',
          'Resume, cover letter, and links you share when applying for a job',
          'Authentication details for admin users (email, password hash)',
        ],
      },
      'We also collect limited technical data automatically — such as IP address, browser type, device, referring URL, and pages visited — to operate and secure the service.',
    ],
  },
  {
    id: 'how-we-use',
    title: '3. How we use your information',
    body: [
      'We use the information we collect to:',
      {
        items: [
          'Respond to inquiries and deliver the services you request',
          'Communicate about projects, proposals, hiring, and account activity',
          'Improve our website, content, and offerings',
          'Detect, prevent, and address fraud or abuse',
          'Comply with legal obligations',
        ],
      },
    ],
  },
  {
    id: 'cookies',
    title: '4. Cookies & tracking',
    body: [
      'We use a minimal set of cookies that are strictly necessary to operate the site — for example, the secure HTTP-only cookie that keeps your admin session alive. We do not use third-party advertising cookies on this site.',
      'You can disable cookies in your browser settings, but some functionality may not work as expected.',
    ],
  },
  {
    id: 'sharing',
    title: '5. How we share information',
    body: [
      'We do not sell your personal information. We may share information only with:',
      {
        items: [
          'Trusted service providers who process data on our behalf (e.g., hosting, email delivery, media storage), bound by appropriate agreements',
          'Authorities when required by law or to protect rights, safety, and property',
          'Acquirers in the event of a corporate merger or acquisition (with notice to you where appropriate)',
        ],
      },
    ],
  },
  {
    id: 'data-retention',
    title: '6. Data retention',
    body: [
      'We retain personal information only for as long as needed to fulfill the purposes described in this policy, or as required by law. Job application data is retained for up to 24 months unless you ask us to delete it sooner.',
    ],
  },
  {
    id: 'your-rights',
    title: '7. Your rights',
    body: [
      'Depending on your jurisdiction, you may have the right to:',
      {
        items: [
          'Access, correct, or delete the personal information we hold about you',
          'Object to or restrict certain types of processing',
          'Withdraw consent where processing relies on consent',
          'Lodge a complaint with a data protection authority',
        ],
      },
      'To exercise these rights, contact us at hr@digiswarm.in.',
    ],
  },
  {
    id: 'security',
    title: '8. Security',
    body: [
      'We use industry-standard safeguards — encryption in transit, hashed passwords, scoped HTTP-only cookies, and least-privilege access — to protect your data. No method of transmission or storage is 100% secure, but we work hard to minimize risk.',
    ],
  },
  {
    id: 'children',
    title: '9. Children',
    body: [
      'Our services are not directed to children under 16 and we do not knowingly collect personal information from them.',
    ],
  },
  {
    id: 'changes',
    title: '10. Changes to this policy',
    body: [
      'We may update this Privacy Policy from time to time. We will post the revised version on this page and update the "Last updated" date above. Material changes will be highlighted on the site.',
    ],
  },
  {
    id: 'contact',
    title: '11. Contact us',
    body: [
      'Questions about this Privacy Policy? Email us at hr@digiswarm.in or reach out via our contact page.',
    ],
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="May 12, 2026"
      intro="This policy describes how DigiSwarm collects, uses, and protects information when you visit our site or work with us."
      sections={sections}
    />
  );
}
