import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RippleProps {
    x: number;
    y: number;
    size: number;
}

export function Ripple({ x, y, size }: RippleProps) {
    return (
        <motion.span
            className="absolute bg-white/30 rounded-full pointer-events-none"
            initial={{
                width: 0,
                height: 0,
                x: x - size / 2,
                y: y - size / 2,
                opacity: 0.5
            }}
            animate={{
                width: size,
                height: size,
                opacity: 0
            }}
            transition={{ duration: 0.5 }}
        />
    );
}

export function useRipple() {
    const [ripples, setRipples] = useState<RippleProps[]>([]);

    const onClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setRipples([...ripples, { x, y, size }]);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (ripples.length > 0) {
                setRipples([]);
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [ripples]);

    return { ripples, onClick };
} 