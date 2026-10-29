import { motion, MotionConfig, type HTMLMotionProps } from "framer-motion";

type AnimatedPageProps = HTMLMotionProps<"div">;

export default function AnimatedPage({ children, className = "", ...props }: AnimatedPageProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
