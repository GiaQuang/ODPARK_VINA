import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { ToastContainer } from "react-toastify";
const inter = Inter({ subsets: ["latin"] });
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
    // title: '',
    title: "PM QUẢN LÝ SẢN XUẤT - Mọi thắc mắc xin liên hệ www.vnatech.com.vn",
    // title: "PM QUẢN LÝ SẢN XUẤT - Mọi thắc mắc xin liên hệ nhà cung cấp",
    description: "www.vnatech.com.vn",
    icons: {
        icon: "/ancho.ico", // /public path, không được dùng tên "favicon.ico"
    },
    appleWebApp: {
        capable: true,
    },

};

export default function RootLayout({ children }: { children: React.ReactNode }) {


    return (
        <html lang="en">
            <body className={inter.className}>
                <div
                    className="select-none 
                        bg-gradient-to-b from-[#323140] via-black to-[#383749]
                        text-white font-sans 
                        w-screen
                        h-screen
                        overflow-auto scrollbar-default
                        "
                >
                    <AntdRegistry>{children}</AntdRegistry>
                </div>
                <ToastContainer theme="colored" pauseOnFocusLoss={false} autoClose={1000} />

            </body>
        </html>
    );
}
