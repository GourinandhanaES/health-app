import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={twMerge(
                'relative overflow-visible glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 text-zinc-800 dark:text-zinc-100',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
