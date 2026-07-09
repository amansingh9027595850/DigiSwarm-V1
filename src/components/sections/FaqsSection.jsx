import { useQuery } from '@tanstack/react-query';
import SectionHeading from '@/components/common/SectionHeading';
import Accordion from '@/components/common/Accordion';
import { faqApi } from '@/api/faq.api';

export default function FaqsSection({ category, eyebrow = 'Questions', title = 'Frequently asked', subtitle }) {
  const { data } = useQuery({
    queryKey: ['public', 'faqs', { category }],
    queryFn: () => faqApi.listPublic({ category }),
  });
  const items = (data?.data || []).map((f) => ({
    id: f._id,
    question: f.question,
    answer: f.answer,
  }));
  if (items.length === 0) return null;

  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
