"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
/*
 * KRL change: icons come from `lucide-react`, which this project already
 * depends on. The registry entry declared only `framer-motion`, so the
 * `react-icons` import it actually used was never installed and the component
 * would not build.
 */
import { Github, Twitter, Facebook, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";

export interface SocialItem {
    letter: string;
    icon: React.ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
}

interface SocialFlipButtonProps {
    items?: SocialItem[];
    className?: string;
    itemClassName?: string;
    frontClassName?: string;
    backClassName?: string;
}

const defaultItems: SocialItem[] = [
    { letter: "C", icon: <Github className="size-4" />, label: "Github", href: "#" },
    { letter: "O", icon: <Twitter className="size-4" />, label: "Twitter", href: "#" },
    { letter: "N", icon: <Linkedin className="size-4" />, label: "LinkedIn", href: "#" },
    { letter: "T", icon: <Instagram className="size-4" />, label: "Instagram", href: "#" },
    { letter: "A", icon: <Facebook className="size-4" />, label: "Facebook", href: "#" },
    { letter: "C", icon: <Mail className="size-4" />, label: "Email", href: "#" },
    { letter: "T", icon: <MessageCircle className="size-4" />, label: "Discord", href: "#" },
];

const SocialFlipNode = ({
    item,
    index,
    isHovered,
    setTooltipIndex,
    tooltipIndex,
    itemClassName,
    frontClassName,
    backClassName,
}: {
    item: SocialItem;
    index: number;
    isHovered: boolean;
    setTooltipIndex: (val: number | null) => void;
    tooltipIndex: number | null;
    itemClassName?: string;
    frontClassName?: string;
    backClassName?: string;
}) => {
    const Wrapper = item.href ? "a" : "div";
    /*
     * KRL change: only http(s) links open in a new tab. The original forced
     * `target="_blank"` on every href, which on a `mailto:` or `tel:` opens a
     * blank tab beside the mail client and leaves it there.
     */
    const isExternal = Boolean(item.href && /^https?:/i.test(item.href));
    const wrapperProps = item.href
        ? {
              href: item.href,
              ...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}),
          }
        : { onClick: item.onClick };

    return (
        <Wrapper
            {...wrapperProps}
            className={cn("relative size-9 cursor-pointer sm:size-10", itemClassName)}
            style={{ perspective: "1000px" }}
            onMouseEnter={() => setTooltipIndex(index)}
            onMouseLeave={() => setTooltipIndex(null)}
        >
            <AnimatePresence>
                {isHovered && tooltipIndex === index && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8, x: "-50%" }}
                        animate={{ opacity: 1, y: -50, scale: 1, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, scale: 0.8, x: "-50%" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-1/2 z-50 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-xl"
                    >
                        {item.label}
                        {/* Arrow */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-foreground" />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="relative h-full w-full"
                initial={false}
                animate={{ rotateY: isHovered ? 180 : 0 }}
                transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 120,
                    damping: 15,
                    delay: index * 0.08,
                }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front - Letter */}
                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center rounded-lg bg-card text-lg font-bold text-foreground shadow-sm",
                        frontClassName
                    )}
                    style={{ backfaceVisibility: "hidden" }}
                    
                >
                    {item.letter}
                </div>

                {/* Back - Icon */}
                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center rounded-lg bg-foreground text-lg text-background",
                        backClassName
                    )}
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    {item.icon}
                </div>
            </motion.div>
        </Wrapper>
    );
};

export default function SocialFlipButton({
    items = defaultItems,
    className,
    itemClassName,
    frontClassName,
    backClassName,
}: SocialFlipButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

    /*
     * KRL change: a `MutationObserver` on <html> watched for a `dark` class and
     * set state that nothing read. Removed — the component now takes its colours
     * from the design tokens, so there is no theme to track.
     */

    return (
        <div className={cn("flex items-center justify-center gap-4 p-4", className)}>
            <div
                /* KRL: tighter on phones — 7 tiles at full size were wider than the screen. */
                className="group relative flex items-center justify-center gap-1.5 rounded-2xl border border-border bg-card p-2 shadow-sm sm:gap-2 sm:p-4"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setTooltipIndex(null);
                }}
            >
                {/* Border Lines Container - Clipped */}
                <div className="absolute -inset-[1px] overflow-hidden rounded-2xl pointer-events-none">
                    {/* Animated Top Border Line */}
                    <motion.div
                        className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-foreground/40 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    {/* Animated Bottom Border Line */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-foreground/40 to-transparent"
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                </div>

                {items.map((item, index) => (
                    <SocialFlipNode
                        key={index}
                        item={item}
                        index={index}
                        isHovered={isHovered}
                        setTooltipIndex={setTooltipIndex}
                        tooltipIndex={tooltipIndex}
                        itemClassName={itemClassName}
                        frontClassName={frontClassName}
                        backClassName={backClassName}
                    />
                ))}
            </div>
        </div>
    );
}
