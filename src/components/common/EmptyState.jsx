import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon size={24} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
