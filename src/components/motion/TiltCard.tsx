"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { ReactNode, MouseEvent } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees */
  max?: number;
};

/** Subtle 3D tilt that follows the pointer. Disabled for reduced motion and touch. */
export function TiltCard({ children, className = "", max = 6 }: Props) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 160, damping: 18 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1400 }} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
