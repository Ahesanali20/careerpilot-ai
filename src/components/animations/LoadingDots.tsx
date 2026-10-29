import { motion } from "framer-motion";

export default function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="h-1.5 w-1.5 rounded-full bg-current"
          animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay: index * 0.15 }}
        />
      ))}
    </span>
  );
}
