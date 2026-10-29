import { motion, type HTMLMotionProps } from "framer-motion";

type AnimatedCardProps = HTMLMotionProps<"section"> & {
  delay?: 1 | 2 | 3 | 4;
};

export default function AnimatedCard({
  children,
  className = "",
  delay = 1,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 22, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -5, scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      transition={{
        duration: 0.5,
        delay: 0.1 + (delay - 1) * 0.08,
        ease: "easeOut",
      }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
