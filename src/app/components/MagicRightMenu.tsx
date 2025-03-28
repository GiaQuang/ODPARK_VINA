"use client";
import { motion as m } from "framer-motion";
import { HiMiniPlusSmall } from "react-icons/hi2";
import { useInterval, useSessionStorage } from "usehooks-ts";
import { KEY_SEASON_STORAGE } from "../(projects)/vf_do_chieu_cao/database";
import MyMenu from "./MenuAntd";
import NoSsr from "@/app/components/NoSsr";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MagicRightMenu() {
    const [show, set_show] = useSessionStorage(KEY_SEASON_STORAGE.RIGHT_MENU_STATUS, false);
    const path = usePathname();
    const [is_hmi, setIsHmi] = useState(false);

    useEffect(() => {
        if (path.includes("/ptl_v3/hmi/")) setIsHmi(true);
        else setIsHmi(false);
    }, [path]);

    return (
        <NoSsr>
            <div
                className={`fixed z-50 right-0 top-0 select-none
                bg-black text-white font-bold overflow-y-scroll scrollbar-default
            `}
            >
                <m.div
                    className={`fixed z-50 top-5 right-5  
                    ${show == true ? `` : ``} 
                    shadow-[0px_0px_5px_3px_#fff] rounded-full
                    hover:top-4
                    duration-150
                    ${is_hmi == true ? `hidden` : ``}
                    `}
                    animate={{ opacity: `${show ? `0%` : `100%`}` }}
                    transition={{
                        duration: 0.3,
                    }}
                    exit={{ opacity: 0 }}
                >
                    <HiMiniPlusSmall
                        size={40}
                        className={`ring-white ring-2 rounded-full
                        bg-green-600
                        hover:bg-green-500
                        active:bg-green-600
                        hover:cursor-pointer
                        duration-150
                        opacity-60
                        hover:opacity-100
                    `}
                        onClick={() => {
                            set_show(true);
                        }}
                    />
                </m.div>
                <m.div
                    className={`w-[280px] flex flex-col  overflow-auto scrollbar-hide
                    fixed z-50 right-0 top-0
                    bg-[#02162a] text-white font-bold
                    h-screen
                    gap-1
                    *:p-2
                    opacity-[0.98]
                    ${show ? `shadow-[0px_0px_3px_3px_#ccc]` : ``}
                        `}
                    animate={{ x: `${show ? `0%` : `100%`}` }}
                    transition={{
                        duration: 0.3,
                    }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className={`w-full  text-center text-2xl font-UtmHelvetIns font-normal
                        bg-red-600
                        hover:bg-red-500
                        active:bg-red-600
                        hover:cursor-pointer
                        duration-150
                        hover:opacity-100
                        `}
                        onClick={() => {
                            set_show(false);
                        }}
                    >
                        ĐÓNG
                    </div>
                    <MyMenu />
                    <div className="flex-1"></div>
                </m.div>
            </div>
        </NoSsr>
    );
}
