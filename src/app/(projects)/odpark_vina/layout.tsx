"use client";
import PageTransitionEffect from "@/app/PageTransitionEffect";
import NoSsr from "@/app/components/NoSsr";
import MyMenu from "./MainMenu";
import { useState } from "react";
import { motion as m } from 'framer-motion'
import { useSessionStorage } from 'usehooks-ts'
export default function Layout({ children }: { children: React.ReactNode }) {
    const [is_show, setIsShow, remove_is_show] = useSessionStorage('key_show_menu', true)
    console.log(is_show);
    return (
        <div
            className={`
                min-h-screen 
                w-screen
                overflow-auto scrollbar-default
                text-white  font-bold select-none 
                bg-gradient-to-b from-[#323140] via-[#070522] to-[#383749]`}
        >
            <div className="flex flex-row w-full">
                <m.div
                    initial={{
                        width: is_show ? `40px` : `150px`,
                        minWidth: is_show ? `40px` : `150px`,
                        maxWidth: is_show ? `40px` : `150px`,
                    }}
                    animate={{
                        width: is_show ? `150px` : `40px`,
                        minWidth: is_show ? `150px` : `40px`,
                        maxWidth: is_show ? `150px` : `40px`,
                    }}
                    exit={{}}
                    transition={{ type: "spring", duration: 0.3 }}
                >
                    <MyMenu set_is_show={setIsShow} />
                </m.div>
                <div className={`flex-1 ${is_show ?
                    `min-w-[calc(100dvw-150px)] max-w-[calc(100dvw-150px)]` :
                    `min-w-[calc(100dvw-40px)] max-w-[calc(100dvw-40px)]`}`}>
                    {/* <div>{children}</div> */}
                    <PageTransitionEffect>{children}</PageTransitionEffect>
                </div>
            </div>
            {/* 
            <NoSsr>
                <div></div>
            </NoSsr> */}
        </div>
    );
}
