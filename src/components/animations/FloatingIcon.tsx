import { motion, type HTMLMotionProps } from "framer-motion";

type FloatingIconProps = HTMLMotionProps<"div">;

export default function FloatingIcon({ children, className = "" }: FloatingIconProps) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -6, 0] }}
      whileHover={{ scale: 1.08, rotate: 2 }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
