// src/components/common/Button.tsx

import React, { useRef } from "react";
import Link from "next/link";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    href?: string; // if provided, renders as <Link>
};

const base =
    "relative overflow-hidden inline-flex items-center justify-center rounded-full font-semibold transition-transform duration-200 focus:outline-none active:scale-[0.98] glow-button";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
        "bg-green-500 text-white hover:bg-green-600 ring-offset-transparent",
    secondary:
        "bg-white text-green-700 hover:bg-gray-200 ring-offset-transparent",
    ghost:
        "bg-transparent text-white/90 hover:text-white border border-white/30 hover:border-white/60",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
};

export default function Button({
    variant = "primary",
    size = "md",
    fullWidth,
    className,
    href,
    children,
    onMouseMove,
    ...props
}: ButtonProps) {
    const ref = useRef<HTMLButtonElement | null>(null);

    const handleMove: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);
        onMouseMove?.(e);
    };

    const content = (
        <>
            <span className="relative z-10">{children}</span>
            {/* cursor glow */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    background:
                        "radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), rgba(255,255,255,.35), transparent 60%)",
                }}
            />
        </>
    );

    const classes = clsx(
        "group",
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
    );

    if (href) {
        return (
            <Link href={href} className={classes as any} onMouseMove={undefined}>
                {content}
            </Link>
        );
    }

    return (
        <button ref={ref} className={classes} onMouseMove={handleMove} {...props}>
            {content}
        </button>
    );
}
