"use client";
import { InputRef } from 'antd/es/input';
import { useEffect, useRef, useState } from "react";
import { useInterval, useWindowSize } from "usehooks-ts";
import { Input } from "antd";
import { toast } from 'react-toastify';
import { TYPE_CPU } from '../database';
import { api_get_cpu_info, api_set_gia_dien_value, api_set_gia_nuoc_value, api_set_plc_ip_value, api_set_plc_port_value } from '../api';


export default function Page() {
    const inputIpRef = useRef<InputRef>(null);
    const inputPortRef = useRef<InputRef>(null);

    const inputDienRef = useRef<InputRef>(null);
    const inputNuocRef = useRef<InputRef>(null);
    const [inputIpValue, setInputIpValue] = useState('');
    const [inputPortValue, setInputPortValue] = useState('');
    const [inputDienValue, setInputDienValue] = useState('');
    const [inputNuocValue, setInputNuocValue] = useState('');

    const [cycle_rt_status, setCycleRfStatus] = useState<number | null>(500);
    const [main_type, setMainType] = useState<TYPE_CPU>({
        connection: true,
        ip: '127.0.0.1',
        gia_dien: 1000,
        gia_nuoc: 1000,
        port: 0,
        fps: 0,
    });
    const [counter, setCounter] = useState(0);
    useInterval(() => {
        setCounter((p) => p + 1);
    }, 500);


    useEffect(() => {
        async function f() {
            let res = await api_get_cpu_info()
            if (res != undefined) {
                setMainType(res);
            }
        }
        f();
    }, [])

    useInterval(async () => {
        setCycleRfStatus(null);
        let res = await api_get_cpu_info()
        if (res != undefined) {
            setMainType(res);
            setCycleRfStatus(500);
        }
        else {
            setCycleRfStatus(3000);
        }

    }, cycle_rt_status);

    return (
        <div
            className={`text-white text-3xl font-bold w-full h-screen flex flex-col p-2 gap-2 pt-4
                ${main_type.connection == false && counter % 2 == 0 ? `bg-gradient-to-b from-[#a00] to-[#c00]` : ``}
                `}
        >
            <div className={`m-1 text-center`}>{`${main_type.connection == false ? `MẤT KẾT NỐI ĐẾN PLC` : `PHẦN MỀM GIÁM SÁT NĂNG LƯỢNG`}`}</div>
            <div className="flex-1 flex flex-row gap-1">
                <div className="flex-1 flex flex-col gap-2">
                    <div className={`flex flex-row items-center gap-4 text-xl`}>
                        <div className="w-[150px]">IP THIẾT BỊ</div>
                        <div className="w-[200px]">{`= ${main_type.ip}`}</div>
                        <div className="flex-1">
                            <Input ref={inputIpRef} className="w-full"
                                value={inputIpValue} // Liên kết giá trị input với state
                                onChange={(e) => {
                                    setInputIpValue(e.target.value);
                                }} // Cập nhật giá trị khi người dùng nhập
                                placeholder="Nhập địa chỉ thiết bị rồi bấm Enter để cập nhật" // Thêm placeholder cho input
                                onPressEnter={async () => {
                                    console.log(inputIpValue); // In giá trị input khi nhấn Enter
                                    try {
                                        let value = inputIpValue
                                        toast.dismiss()
                                        toast.info('Đang cập nhật giá trị')
                                        let res = await api_set_plc_ip_value(value);
                                        toast.dismiss()
                                        if (res === undefined) {
                                            toast.error('Lỗi server')
                                        }
                                        if (res == true) {
                                            toast.success('Cập nhật thành công')
                                        }
                                        if (res == false) {
                                            toast.success('Cập nhật thất bại')
                                        }
                                    }
                                    catch { }
                                    setInputIpValue(''); // Xóa input sau khi in giá trị
                                }}
                            />
                        </div>
                    </div>
                    <div className={`flex flex-row items-center gap-4 text-xl`}>
                        <div className="w-[150px]">PORT THIẾT BỊ</div>
                        <div className="w-[200px]">{`= ${main_type.port}`}</div>
                        <div className="flex-1">
                            <Input ref={inputPortRef} className="w-full"
                                value={inputPortValue} // Liên kết giá trị input với state
                                onChange={(e) => {
                                    setInputPortValue(e.target.value);
                                }} // Cập nhật giá trị khi người dùng nhập
                                placeholder="Nhập cổng kết nối đến thiết bị rồi bấm Enter để cập nhật" // Thêm placeholder cho input
                                onPressEnter={async () => {
                                    console.log(inputPortValue); // In giá trị input khi nhấn Enter
                                    try {
                                        let value = Number.parseFloat(inputPortValue)
                                        toast.dismiss()
                                        toast.info('Đang cập nhật giá trị')
                                        let res = await api_set_plc_port_value(value);
                                        toast.dismiss()
                                        if (res === undefined) {
                                            toast.error('Lỗi server')
                                        }
                                        if (res == true) {
                                            toast.success('Cập nhật thành công')
                                        }
                                        if (res == false) {
                                            toast.success('Cập nhật thất bại')
                                        }
                                    }
                                    catch { }
                                    setInputPortValue(''); // Xóa input sau khi in giá trị
                                }}
                            />
                        </div>
                    </div>
                    <div className={`flex flex-row items-center gap-4 text-xl`}>
                        <div className="w-[150px]">GIÁ ĐIỆN</div>
                        <div className="w-[200px]">{`= ${main_type.gia_dien}`}</div>
                        <div className="flex-1">
                            <Input ref={inputDienRef} className="w-full"
                                value={inputDienValue} // Liên kết giá trị input với state
                                onChange={(e) => {
                                    setInputDienValue(e.target.value);
                                }} // Cập nhật giá trị khi người dùng nhập
                                placeholder="Nhập giá điện / 1kW rồi bấm Enter để cập nhật" // Thêm placeholder cho input
                                onPressEnter={async () => {
                                    console.log(inputDienValue); // In giá trị input khi nhấn Enter
                                    try {
                                        let value = Number.parseFloat(inputDienValue)
                                        toast.dismiss()
                                        toast.info('Đang cập nhật giá trị')
                                        let res = await api_set_gia_dien_value(value);
                                        toast.dismiss()
                                        if (res === undefined) {
                                            toast.error('Lỗi server')
                                        }
                                        if (res == true) {
                                            toast.success('Cập nhật thành công')
                                        }
                                        if (res == false) {
                                            toast.success('Cập nhật thất bại')
                                        }
                                    }
                                    catch { }
                                    setInputDienValue(''); // Xóa input sau khi in giá trị
                                }}
                            />
                        </div>
                    </div>
                    <div className={`flex flex-row items-center gap-4 text-xl`}>
                        <div className="w-[150px]">GIÁ NƯỚC</div>
                        <div className="w-[200px]">{`= ${main_type.gia_nuoc}`}</div>
                        <div className="flex-1">
                            <Input ref={inputNuocRef} className="w-full"
                                value={inputNuocValue} // Liên kết giá trị input với state
                                onChange={(e) => {
                                    setInputNuocValue(e.target.value);
                                }} // Cập nhật giá trị khi người dùng nhập
                                placeholder="Nhập giá nước / 1m3 rồi bấm Enter để cập nhật" // Thêm placeholder cho input
                                onPressEnter={async () => {
                                    console.log(inputNuocValue); // In giá trị input khi nhấn Enter
                                    try {
                                        let value = Number.parseFloat(inputNuocValue)
                                        toast.dismiss()
                                        toast.info('Đang cập nhật giá trị')
                                        let res = await api_set_gia_nuoc_value(value);
                                        toast.dismiss()
                                        if (res === undefined) {
                                            toast.error('Lỗi server')
                                        }
                                        if (res == true) {
                                            toast.success('Cập nhật thành công')
                                        }
                                        if (res == false) {
                                            toast.success('Cập nhật thất bại')
                                        }
                                    }
                                    catch { }
                                    setInputNuocValue(''); // Xóa input sau khi in giá trị
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
