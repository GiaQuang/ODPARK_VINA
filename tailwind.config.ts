/** @format */

import type { Config } from "tailwindcss";

//0.1, 0.2, 0.3, ... -> 30.0
const scale_list = Array.from(Array(300).keys(), (v, k) => parseFloat((0.1 + k / 10).toFixed(1)));
//0,1,2,... 100%
const opacity_list = Array.from(Array(101).keys(), (val, idx) => {
    return `opacity-[${idx}%]`;
});
const bg_red_list = ["#ff0000"];
const bg_yellow_list = ["#ffff00"];
const safelist = [
    ...scale_list.map((v) => `scale-x-[${v}]`),
    ...scale_list.map((v) => `scale-y-[${v}]`),
    ...opacity_list,
    ...bg_red_list,
    ...bg_yellow_list,
];
const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist: safelist,
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            gridTemplateColumns: {
                // Simple 16 column grid for tailwind (grid-cols-xx)
                "13": "repeat(16, minmax(0, 1fr))",
                "14": "repeat(16, minmax(0, 1fr))",
                "15": "repeat(16, minmax(0, 1fr))",
                "16": "repeat(16, minmax(0, 1fr))",
                "17": "repeat(16, minmax(0, 1fr))",
                "18": "repeat(16, minmax(0, 1fr))",
                "19": "repeat(16, minmax(0, 1fr))",
                "20": "repeat(16, minmax(0, 1fr))",
                "21": "repeat(16, minmax(0, 1fr))",
                "22": "repeat(16, minmax(0, 1fr))",
                "23": "repeat(16, minmax(0, 1fr))",
                "24": "repeat(16, minmax(0, 1fr))",
                // Complex site-specific column configuration
                footer: "200px minmax(900px, 1fr) 100px",
            },
        },
    },
    plugins: [require("tailwind-scrollbar-hide")],
};
export default config;
