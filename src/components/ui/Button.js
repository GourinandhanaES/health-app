import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Button({ className, variant = "primary", children, ...props }) {
    const baseStyles =
        "inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary:
            "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5",
        secondary:
            "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10",
        ghost: "text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5",
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}
