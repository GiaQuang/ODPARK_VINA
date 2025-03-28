/** @format */
"use client";
import axios from "axios";
import simplify from "simplify-js";
/** return float number in [x1 -> x2)
 */
export function random_float(x1: number, x2: number) {
    let r = Math.random(); //always returns a number lower than 1.
    let x = x1 + (x2 - x1) * r;
    return x;
}

/** return integer number in [x1 -> x2]
 */
export function random_int(x1: number, x2: number) {
    let r = Math.random(); //always returns a number lower than 1.
    let x = x1 + Math.round((x2 - x1 + 1) * r);
    return x;
}

export function random_string(n: number) {
    const s = "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz";
    let txt = "";
    for (let i = 0; i < n; i++) txt += s[random_int(0, 49)];
    return txt;
}

export function get_month_full_name(month: number) {
    const s = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return s[month - 1];
}

function number_to_hex_str(number: number) {
    let hex = number.toString(16).toUpperCase();
    return hex;
}

export function get_random_color() {
    let r = number_to_hex_str(random_int(0, 255));
    let g = number_to_hex_str(random_int(0, 255));
    let b = number_to_hex_str(random_int(0, 255));

    return "#" + r.padStart(2, "0") + g.padStart(2, "0") + b.padStart(2, "0");
}

export async function get_global_ip() {
    return await axios
        .get("https://api.ipify.org")
        .then((res) => {
            let ip = res.data;
            return ip;
        })
        .catch((res) => {
            console.log(`Error on get internet IP : ${res}`);
            return undefined;
        });
}

export async function api_get_data(url: string = "/api/get_full_data") {
    try {
        return await axios.get(url).then((res) => {
            return res.data;
        });
    } catch (e) {
        console.log("error on api_get_data", url);
        return undefined;
    }
}

/**
@param data type is object (dict)
@param timeout (ms), default 1000
@return undefined if any error else object
 */
export async function api_post_data(url: string = "/api/post_data", data: {}, timeout: number = 1000) {
    try {
        let d = await axios
            // .post(url, JSON.stringify(data), {
            .post(url, data, {
                timeout: timeout,
            })
            .then((res) => {
                return res.data;
            });
        return d;
    } catch (e) {
        console.log("error on api_post_data", url, e);
        return undefined;
    }
}

export function get_datetime_now() {
    return new Date();
}

/**
 *	@return: return seconds from 1970 (type: float)
 */
export function get_timestamp_s_now() {
    return new Date().getTime() / 1000;
}

export function date_to_timestamp_ms(date: Date) {
    return Date.parse(date.toString());
}
export function date_to_timestamp_s(date: Date) {
    return parseInt((Date.parse(date.toString()) / 1000).toString());
}
/**
 *	@param ts_seconds: float number (seconds from 1970)
 */
export function timestamp_s_to_date(ts_seconds: number) {
    return new Date(parseInt((ts_seconds * 1000).toString()));
}

export function timestamp_s_to_str_hh_mm_ss(ts_seconds: number) {
    let d = new Date(parseInt((ts_seconds * 1000).toString()));
    let hh = d.getHours();
    let mm = d.getMinutes();
    let ss = d.getSeconds();
    return hh.toString().padStart(2, "0") + ":" + mm.toString().padStart(2, "0") + ":" + ss.toString().padStart(2, "0");
}

export function clone_object(obj: any) {
    return JSON.parse(JSON.stringify(obj));
    // return structuredClone(obj)
}

export async function delay_ms(delayInMs: number) {
    return new Promise((resolve) => setTimeout(resolve, delayInMs));
}
export function simplified_v1(arr_x: number[], arr_y: number[], epsilon: number = 0.01, high_quality: boolean = true) {
    if (arr_x.length != arr_y.length || arr_x.length == 0) {
        return {
            x: [],
            y: [],
        };
    }
    let res = simplify(
        arr_x.map((val, idx) => {
            return {
                x: val,
                y: arr_y[idx],
            };
        }),
        epsilon,
        high_quality
    );
    let res_x: number[] = [];
    let res_y: number[] = [];
    res.forEach((val, idx) => {
        res_x.push(val["x"]);
        res_y.push(val["y"]);
    });
    return {
        x: res_x,
        y: res_y,
    };
}

/** Chỉ gọi 1 lần trong useEffect (Disable back and forward button)
 */
export function disable_back_button() {
    window.addEventListener("popstate", function (event) {
        history.pushState(null, document.title, location.href);
    });
}
