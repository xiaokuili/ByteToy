import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface AnimatedBoxProps {
  children: ReactNode;
}
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

const OpacityAnimatedBox: React.FC<AnimatedBoxProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (ref.current) {
      setElementTop(ref.current.offsetTop);
    }
  }, []);

  const opacity = useTransform(scrollY, value => {
    const scrollProgress = (value - elementTop) / 400; // 300 is the transition range
    const sigmoidInput = (scrollProgress - 0.5) * 8; // Adjust the steepness of the curve
    return 1 - sigmoid(sigmoidInput);
  });

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        position: 'sticky',
        top: 0,
      }}
    >
      {children}
    </motion.div>
  );
};
const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const ScaleAnimatedBox: React.FC<AnimatedBoxProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (ref.current) {
      setElementTop(ref.current.offsetTop);
    }
  }, []);

  const scale = useTransform(scrollY, value => {
    const scrollProgress = (value - elementTop) / 500; // 500 is the transition range
    const easedProgress = easeInOutQuad(Math.min(Math.max(scrollProgress, 0), 1));
    return 1 - 0.5 * easedProgress; // Scale from 1 to 0.5
  });
  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        position: 'sticky',
        top: 0,
      }}
    >
      {children}
    </motion.div>
  );
};

export { OpacityAnimatedBox, ScaleAnimatedBox };
