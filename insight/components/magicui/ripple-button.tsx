"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
}

export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ rippleColor = "rgba(255, 255, 255, 0.35)", duration = 500, className, children, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<{ x: number; y: number; size: number }[]>([]);

    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      setRipples([...ripples, { x, y, size }]);

      // 调用原始的 onClick
      props.onClick?.(e);

      // 清理涟漪效果
      setTimeout(() => {
        setRipples((prevRipples) => prevRipples.slice(1));
      }, duration);
    };

    return (
      <button
        ref={ref}
        {...props}
        className={cn("relative overflow-hidden", className)}
        onClick={onClick}
      >
        {ripples.map((ripple, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              background: rippleColor,
              borderRadius: "50%",
              transform: "scale(0)",
              animation: `ripple ${duration}ms linear`,
              pointerEvents: "none",
            }}
          />
        ))}
        {children}
      </button>
    );
  }
);

RippleButton.displayName = "RippleButton";
