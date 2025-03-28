/** @format */

"use client";
export const GLOBAL_DEBUG = true;
export const SERVER_PATH: string = "http://192.168.110.221:12345/api/ptl/v1";

export const KEY_SEASON_STORAGE = Object.freeze({
    WORK_TIME: "work-time",
    RIGHT_MENU_STATUS: "right-menu-status",
});

export type TYPE_CPU = {
    connection: boolean;
    ip: string;
    port: number;
    gia_dien: number;
    gia_nuoc: number;
    fps: number;
    info?: string;
    counter_OK?: number;
    counter_NG?: number;
}

export type TYPE_DIEN = {
    id: number;
    name?: string;
    dien_ap_12?: number;// đơn vị V
    dien_ap_23?: number;// đơn vị V
    dien_ap_31?: number;// đơn vị V
    dong_dien_i1?: number;// đơn vị A
    dong_dien_i2?: number;// đơn vị A
    dong_dien_i3?: number;// đơn vị A
    p_tieu_thu?: number;//total W, đơn vị kW
    p_phan_khang?: number;//đơn vị VAr
    p_bieu_kien?: number;//đơn vị VA
    dien_nang_tieu_thu?: number; //đơn vị kWh
    freq?: number; //tần số, hz
    time_start?: string; //Ngày bắt đầu tính toán
    time_delta?: number; //Khoảng thời gian đã chạy (giây)
    realtime_dien_nang_tieu_thu?: number; //đơn vị kWh
    last_ts?: number;
    last_dt?: string;
}
export type TYPE_NUOC = {
    id: number;
    name?: string;
    m3?: number;// đơn vị m3
    time_start?: string; //Ngày bắt đầu tính toán
    time_delta?: number; //Khoảng thời gian đã chạy (giây)
    realtime_m3?: number;// đơn vị m3
    last_ts?: number;
    last_dt?: string;
}