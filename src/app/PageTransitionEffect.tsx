"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef } from "react";

function FrozenRouter(props: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext ?? {});
    const frozen = useRef(context).current;
    return <LayoutRouterContext.Provider value={frozen}>{props.children}</LayoutRouterContext.Provider>;
}

const variants = {
    hidden: { opacity: 0, x: "100%", y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: "-100%" },
};

export default function PageTransitionEffect({ children }: { children: React.ReactNode }) {
    const key = usePathname();
    return (
        // mode: sync: có hiệu ứng out, ko có hiệu ứng in
        // mode: wait: hiệu ứng out hết thời gian, sau đó mới bắt đầu hiệu ứng in
        // mode: popLayout: hiệu ứng out và in song song với nhau
        <AnimatePresence mode="popLayout">
            <motion.div
                key={key + "key_for_page_transitions_effect"}
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{ type: "keyframes", duration: 0.3 }}
                className="overflow-auto scrollbar-hide"
            >
                <FrozenRouter>{children}</FrozenRouter>
            </motion.div>
        </AnimatePresence>
    );
}
