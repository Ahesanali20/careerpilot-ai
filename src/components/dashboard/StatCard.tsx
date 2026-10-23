import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconColor: string;
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-text-primary">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconColor}`}>
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-sm text-text-secondary">{description}</p>
    </article>
  );
}

export default StatCard;
