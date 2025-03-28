/** @format */

"use client";

import { api_post_data } from "@/app/utils/utils";

const API_PATH: string = `${process.env.NEXT_PUBLIC_FANCON_PATH}`;


/**
 * @return undefined or TYPE_CPU
 */
export async function api_get_cpu_info(timeout: number = 1000) {
    let res = await api_post_data(`${API_PATH}/api_get_cpu_info`, {}, timeout);
    return res;
}

// #region THONG TIN CHUNG
/**
 * @return undefined or TYPE_DIEN[]
 */
export async function api_get_tong_quan_dien(timeout: number = 3000) {
    let res = await api_post_data(`${API_PATH}/api_get_tong_quan_dien`, {}, timeout);
    return res;
}
/**
 * @return undefined or TYPE_NUOC[]
 */
export async function api_get_tong_quan_nuoc(timeout: number = 3000) {
    let res = await api_post_data(`${API_PATH}/api_get_tong_quan_nuoc`, {}, timeout);
    return res;
}
// #endregion

/**
 * @return undefined or True or False
 */
export async function api_set_plc_ip_value(plc_ip: string, timeout: number = 1000) {
    let res = await api_post_data(`${API_PATH}/api_set_plc_ip_value`, { value: plc_ip }, timeout);
    return res;
}

/**
 * @return undefined or True or False
 */
export async function api_set_gia_dien_value(data: number, timeout: number = 1000) {
    let res = await api_post_data(`${API_PATH}/api_set_gia_dien_value`, { value: data }, timeout);
    return res;
}

/**
 * @return undefined or True or False
 */
export async function api_set_gia_nuoc_value(data: number, timeout: number = 1000) {
    let res = await api_post_data(`${API_PATH}/api_set_gia_nuoc_value`, { value: data }, timeout);
    return res;
}


/**
 * @return undefined or True or False
 */
export async function api_set_plc_port_value(plc_port: number, timeout: number = 1000) {
    let res = await api_post_data(`${API_PATH}/api_set_plc_port_value`, { value: plc_port }, timeout);
    return res;
}


// #region API THONG KE
/**
 * @return undefined or True or False
 */
export async function api_get_list_name_dien(timeout: number = 1000) {
    let res = await api_post_data(`${API_PATH}/api_get_list_name_dien`, {}, timeout);
    return res;
}
export async function api_get_list_name_nuoc(timeout: number = 1000) {
    let res = await api_post_data(`${API_PATH}/api_get_list_name_nuoc`, {}, timeout);
    return res;
}

export async function api_get_chart_dien(name_idx: number, name_idx2: number, type_idx: number, date_string: number, timeout: number = 15000) {
    let res = await api_post_data(`${API_PATH}/api_get_chart_dien`, {
        name_idx: name_idx,
        name_idx2: name_idx2,
        type_idx: type_idx,
        date_string: date_string,
    }, timeout);
    return res;
}
export async function api_get_chart_nuoc(name_idx: number, name_idx2: number, type_idx: number, date_string: number, timeout: number = 15000) {
    let res = await api_post_data(`${API_PATH}/api_get_chart_nuoc`, {
        name_idx: name_idx,
        name_idx2: name_idx2,
        type_idx: type_idx,
        date_string: date_string,
    }, timeout);
    return res;
}
// #endregion

export async function api_get_total_cs_tieu_thu(timeout: number = 3000) {
    let res = await api_post_data(`${API_PATH}/api_get_total_cs_tieu_thu`, {}, timeout);
    return res;
}

export async function api_get_data_dashboard(timeout: number = 10000) {
    let res = await api_post_data(`${API_PATH}/api_get_data_dashboard`, {}, timeout);
    return res;
}

export async function api_xuat_du_lieu(data: any, timeout: number = 10000) {
    let res = await api_post_data(`${API_PATH}/api_xuat_du_lieu`, data, timeout);
    return res;
}

