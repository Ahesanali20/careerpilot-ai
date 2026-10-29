import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.article
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
    >
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
    </motion.article>
  );
}

export default StatCard;
