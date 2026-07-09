import LegalPage from '@/components/common/LegalPage';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of terms',
    body: [
      'By accessing or using the DigiSwarm website and services ("Services"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Services.',
    ],
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    body: [
      'You must be at least 18 years old (or the age of majority in your jurisdiction) and able to enter into a legally binding agreement to use the Services.',
    ],
  },
  {
    id: 'use-of-services',
    title: '3. Use of the Services',
    body: [
      'You agree to use the Services only for lawful purposes and in a way that does not infringe the rights of, or restrict the use of, the Services by any third party.',
      'You agree not to:',
      {
        items: [
          'Reverse engineer, decompile, or attempt to derive the source code of the Services',
          'Attempt to gain unauthorized access to any account, system, or data',
          'Use automated means (scrapers, bots) to access the Services without our written consent',
          'Upload malicious code or content that is unlawful, harmful, or infringing',
        ],
      },
    ],
  },
  {
    id: 'engagements',
    title: '4. Project engagements',
    body: [
      'Specific deliverables, timelines, pricing, and warranties for client engagements are governed by a separate written agreement (Statement of Work or Master Services Agreement) signed by both parties. In the event of any conflict between these Terms and such agreement, the signed agreement controls.',
    ],
  },
  {
    id: 'intellectual-property',
    title: '5. Intellectual property',
    body: [
      'All content on the DigiSwarm website — including text, graphics, logos, and software — is the property of DigiSwarm or its licensors and is protected by intellectual property laws.',
      'You may not reproduce, distribute, or create derivative works from this content without our prior written consent.',
    ],
  },
  {
    id: 'user-content',
    title: '6. Content you submit',
    body: [
      'When you submit content to us — such as project requirements, job applications, or feedback — you grant DigiSwarm a worldwide, non-exclusive, royalty-free license to use that content for the purpose of providing the Services and improving them.',
      'You represent that you have all necessary rights to share any content you submit.',
    ],
  },
  {
    id: 'third-party',
    title: '7. Third-party links and services',
    body: [
      'Our Services may link to third-party websites or use third-party tools. We are not responsible for the content, policies, or practices of any third party.',
    ],
  },
  {
    id: 'disclaimers',
    title: '8. Disclaimers',
    body: [
      'The Services are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.',
      'We do not warrant that the Services will be uninterrupted, secure, or free from errors.',
    ],
  },
  {
    id: 'liability',
    title: '9. Limitation of liability',
    body: [
      'To the fullest extent permitted by law, DigiSwarm shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, arising out of or related to your use of the Services.',
    ],
  },
  {
    id: 'indemnification',
    title: '10. Indemnification',
    body: [
      'You agree to indemnify and hold DigiSwarm and its affiliates harmless from any claims, damages, liabilities, costs, and expenses arising out of your use of the Services or breach of these Terms.',
    ],
  },
  {
    id: 'termination',
    title: '11. Termination',
    body: [
      'We may suspend or terminate access to the Services at any time, with or without notice, if we believe you have violated these Terms.',
    ],
  },
  {
    id: 'governing-law',
    title: '12. Governing law',
    body: [
      'These Terms are governed by the laws of the jurisdiction in which DigiSwarm is registered, without regard to its conflict of law principles. Any disputes shall be resolved exclusively in the courts of that jurisdiction.',
    ],
  },
  {
    id: 'changes',
    title: '13. Changes to these Terms',
    body: [
      'We may modify these Terms from time to time. The most current version will always be posted on this page with the updated "Last updated" date. Continued use of the Services after changes constitutes acceptance of the revised Terms.',
    ],
  },
  {
    id: 'contact',
    title: '14. Contact',
    body: [
      'Questions about these Terms? Reach out to us at hr@digiswarm.in.',
    ],
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      lastUpdated="May 12, 2026"
      intro="These Terms govern your access to and use of the DigiSwarm website and services."
      sections={sections}
    />
  );
}
