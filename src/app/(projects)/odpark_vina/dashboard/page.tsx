"use client";
import { InputRef } from 'antd/es/input';
import { useEffect, useRef, useState } from "react";
import { useInterval, useWindowSize } from "usehooks-ts";
import { Input } from "antd";
import { toast } from 'react-toastify';
import { TYPE_CPU } from '../database';
import { api_get_chart_dien, api_get_chart_nuoc, api_get_cpu_info, api_get_data_dashboard, api_get_list_name_dien, api_get_list_name_nuoc, api_get_total_cs_tieu_thu, api_set_plc_ip_value, api_set_plc_port_value } from '../api';
import { Select, DatePicker, } from "antd";
import type { DatePickerProps } from 'antd';
import ReactECharts from "echarts-for-react";
import { GiPowerLightning } from "react-icons/gi";
import { IoWaterOutline } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { MdElectricBolt } from "react-icons/md";
import { random_int } from '@/app/utils/utils';

function BieuDoNangLuongThangTruocThangNay({ data }: { data: { category: string[]; value1: number[]; value2: number[] } }) {
    const [legend, setLegend] = useState([true, true, true]);
    const [onEvents, setOnEvent] = useState({
        legendselectchanged: (e: any) => {
            console.log(e);
            let data = [
                e["selected"]["Giá trị đo"],
                e["selected"]["Giá trị min"],
                e["selected"]["Giá trị max"],
            ];
            setLegend(data);
        },
    });
    const option = {
        animation: true,
        legend: {
            show: true,
            textStyle: { color: '#fff' },
        },
        grid: {
            top: 30,
            bottom: 50,
            left: 60,
            right: 10,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: [
            {
                type: 'category',
                data: data['category'],
                axisTick: {
                    alignWithLabel: true
                },
                name: 'Thời gian',
                nameTextStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 12,
                    rotate: 45,
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Điện năng (kWh)',
                nameTextStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: 'consola'
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 12,
                },
                splitLine: {
                    lineStyle: {
                        color: '#ffffff40',
                    }
                },
            }
        ],
        series: [
            {
                name: 'Tháng trước (kWh)',
                type: 'bar',
                barWidth: '30%',
                itemStyle: {
                    color: '#555555AA',
                    borderColor: '#666',
                    borderWidth: 1.5,
                    borderRadius: [3, 3, 0, 0],
                },
                data: data['value1']
            },
            {
                name: 'Tháng này (kWh)',
                type: 'bar',
                barWidth: '30%',
                itemStyle: {
                    color: '#ff0000AA',
                    borderColor: '#ff0000',
                    borderWidth: 2,
                    borderRadius: [3, 3, 0, 0],
                },
                data: data['value2']
            }
        ]
    };
    return <div className='w-full h-full flex flex-col text-lg border-[1px] border-[#ff0000] rounded-md p-2
                    bg-gradient-to-b from-[#a6a5b822] via-[#a6a5b844] to-[#a6a5b833]
                    shadow-[0px_0px_2px_2px_#ff000088] '>
        <div className='flex flex-row w-full items-center gap-2'>
            <div className='pl-2 w-full text-center'>ĐIỆN NĂNG TIÊU THỤ THÁNG TRƯỚC / THÁNG NÀY</div>
        </div>
        <div className={`flex-1 w-full mt-3`}>
            <ReactECharts
                style={{ width: `${100}px` }}//Phải có để tự co dãn
                option={option}
                notMerge={true}
                lazyUpdate={true}
                className="flex-1 min-w-full min-h-full m-0 p-0"
                onEvents={onEvents}
            />
        </div>
    </div>
}
function BieuDoNangLuongHomNay({ data }: { data: { category: string[]; value: number[]; name: string } }) {
    const [legend, setLegend] = useState([true, true, true]);
    const [onEvents, setOnEvent] = useState({
        legendselectchanged: (e: any) => {
            console.log(e);
            let data = [
                e["selected"]["Giá trị đo"],
                e["selected"]["Giá trị min"],
                e["selected"]["Giá trị max"],
            ];
            setLegend(data);
        },
    });
    const option = {
        animation: true,
        legend: {
            show: false,
            textStyle: { color: '#fff' },
        },
        grid: {
            top: 30,
            bottom: 50,
            left: 60,
            right: 10,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: [
            {
                type: 'category',
                data: data['category'],
                axisTick: {
                    alignWithLabel: true
                },
                name: data['name'],
                nameTextStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 12,
                    rotate: 45,
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Điện năng (kWh)',
                nameTextStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: 'consola'
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 12,
                },
                splitLine: {
                    lineStyle: {
                        color: '#ffffff40',
                    }
                },
            }
        ],
        series: [
            {
                name: 'Tiêu thụ (kWh)',
                type: 'bar',
                barWidth: '60%',
                itemStyle: {
                    color: '#ff0000AA',
                    borderColor: '#ff0000',
                    borderWidth: 2,
                    borderRadius: [3, 3, 0, 0],
                },
                data: data['value']
            }
        ]
    };
    return <div className='w-full h-full flex flex-col text-lg border-[1px] border-[#ff0000] rounded-md p-2
                    bg-gradient-to-b from-[#a6a5b822] via-[#a6a5b844] to-[#a6a5b833]
                    shadow-[0px_0px_2px_2px_#ff000088] '>
        <div className='flex flex-row w-full items-center gap-2'>
            <div className='pl-2 w-full text-center'>ĐIỆN NĂNG TIÊU THỤ HÔM NAY</div>
        </div>
        <div className={`flex-1 w-full mt-3`}>
            <ReactECharts
                style={{ width: `${100}px` }}//Phải có để tự co dãn
                option={option}
                notMerge={true}
                lazyUpdate={true}
                className="flex-1 min-w-full min-h-full m-0 p-0"
                onEvents={onEvents}
            />
        </div>
    </div>
}
function BieuDoNuocThangTruocThangNay({ data }: { data: { category: string[]; value1: number[]; value2: number[] } }) {
    // const [data, setData] = useState(
    //     {
    //         'category': Array.from(Array(31).keys(), (value, idx) => {
    //             return `N${idx + 1}`;
    //         }),
    //         'value1': Array.from(Array(31).keys(), (value, idx) => {
    //             return random_int(100, 1000);
    //         }),
    //         'value2': Array.from(Array(31).keys(), (value, idx) => {
    //             return random_int(100, 1000);
    //         }),
    //     });
    const [legend, setLegend] = useState([true, true, true]);
    const [onEvents, setOnEvent] = useState({
        legendselectchanged: (e: any) => {
            console.log(e);
            let data = [
                e["selected"]["Giá trị đo"],
                e["selected"]["Giá trị min"],
                e["selected"]["Giá trị max"],
            ];
            setLegend(data);
        },
    });
    const option = {
        animation: true,
        legend: {
            show: true,
            textStyle: { color: '#fff' },
        },
        grid: {
            top: 30,
            bottom: 50,
            left: 60,
            right: 10,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: [
            {
                type: 'category',
                data: data['category'],
                axisTick: {
                    alignWithLabel: true
                },
                name: 'Thời gian',
                nameTextStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 12,
                    rotate: 45,
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Lượng nước (m3)',
                nameTextStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: 'consola'
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 12,
                },
                splitLine: {
                    lineStyle: {
                        color: '#ffffff40',
                    }
                },
            }
        ],
        series: [
            {
                name: 'Tháng trước (m3)',
                type: 'bar',
                barWidth: '30%',
                itemStyle: {
                    color: '#555555AA',
                    borderColor: '#666',
                    borderWidth: 1.5,
                    borderRadius: [3, 3, 0, 0],
                },
                data: data['value1']
            },
            {
                name: 'Tháng này (m3)',
                type: 'bar',
                barWidth: '30%',
                itemStyle: {
                    color: '#00ff00AA',
                    borderColor: '#00ff00',
                    borderWidth: 2,
                    borderRadius: [3, 3, 0, 0],
                },
                data: data['value2']
            }
        ]
    };
    return <div className='w-full h-full flex flex-col text-lg border-[1px] border-[#00ff00] rounded-md p-2
                    bg-gradient-to-b from-[#a6a5b855] via-[#18172e99] to-[#0b0925cc]
                    shadow-[0px_0px_2px_2px_#00ff0088] '>
        <div className='flex flex-row w-full items-center gap-2'>
            <div className='pl-2 w-full text-center'>LƯỢNG NƯỚC TIÊU THỤ THÁNG TRƯỚC / THÁNG NÀY</div>
        </div>
        <div className={`flex-1 h-full w-full mt-3`}>
            <ReactECharts
                style={{ width: `${100}px` }}//Phải có để tự co dãn
                option={option}
                notMerge={true}
                lazyUpdate={true}
                className="flex-1 min-w-full min-h-full m-0 p-0"
                onEvents={onEvents}
            />
        </div>
    </div>
}


function BieuDoNuocHomNay({ data }: { data: { category: string[]; value: number[]; name: string } }) {
    const [legend, setLegend] = useState([true, true, true]);
    const [onEvents, setOnEvent] = useState({
        legendselectchanged: (e: any) => {
            console.log(e);
            let data = [
                e["selected"]["Giá trị đo"],
                e["selected"]["Giá trị min"],
                e["selected"]["Giá trị max"],
            ];
            setLegend(data);
        },
    });
    const option = {
        animation: true,
        legend: {
            show: false,
            textStyle: { color: '#fff' },
        },
        grid: {
            top: 30,
            bottom: 50,
            left: 60,
            right: 10,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: [
            {
                type: 'category',
                data: data['category'],
                axisTick: {
                    alignWithLabel: true
                },
                name: data['name'],
                nameTextStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 12,
                    rotate: 45,
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Lượng nước (m3)',
                nameTextStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: 'consola'
                },
                axisLabel: {
                    color: '#fff',
                    fontSize: 12,
                },
                splitLine: {
                    lineStyle: {
                        color: '#ffffff40',
                    }
                },
            }
        ],
        series: [
            {
                name: 'Lượng nước (m3)',
                type: 'bar',
                barWidth: '60%',
                itemStyle: {
                    color: '#00ff00AA',
                    borderColor: '#00ff00',
                    borderWidth: 2,
                    borderRadius: [3, 3, 0, 0],
                },
                data: data['value']
            }
        ]
    };
    return <div className='w-full h-full flex flex-col text-lg border-[1px] border-[#00ff00] rounded-md p-2
                    bg-gradient-to-b from-[#a6a5b855] via-[#18172e99] to-[#0b0925cc]
                    shadow-[0px_0px_2px_2px_#00ff0088] '>
        <div className='flex flex-row w-full items-center gap-2'>
            <div className='pl-2 text-center w-full'>LƯỢNG NƯỚC TIÊU THỤ HÔM NAY</div>
        </div>
        <div className={`flex-1 h-full w-full mt-3`}>
            <ReactECharts
                style={{ width: `${100}px` }}//Phải có để tự co dãn
                option={option}
                notMerge={true}
                lazyUpdate={true}
                className="flex-1 min-w-full min-h-full m-0 p-0"
                onEvents={onEvents}
            />
        </div>
    </div>
}



export default function Page() {
    const [cong_suat_today, setCongSuatToday] = useState<number | any>(0);
    const [data_dashboard, setDataDashboard] = useState<any>({
        'total_dien_today': 0,
        'total_nuoc_today': 0,
        'chart_dien': {
            'category': [],
            'value': [],
            'name': '',
        },
        'chart_nuoc': {
            'category': [],
            'value': [],
            'name': '',
        },
        'chart_ss_dien': { category: [], value1: [], value2: [] },
        'chart_ss_nuoc': { category: [], value1: [], value2: [] },
        'dien_nang_thang_nay': 0,
        'tien_dien_thang_nay': 0,
        'luong_nuoc_thang_nay': 0,
        'tien_nuoc_thang_nay': 0,
    });
    const [cycle, setCycle] = useState<null | number>(100);
    const [cycle_dashboard, setCycleDashboard] = useState<null | number>(100);
    useInterval(async () => {
        setCycle(null);
        let res = await api_get_total_cs_tieu_thu();
        if (res == undefined) {
            setCycle(3000);
            return;
        }
        console.log(res);
        setCongSuatToday(res)
        setCycle(1000);
    }, cycle);
    useInterval(async () => {
        setCycleDashboard(null);
        let res = await api_get_data_dashboard();
        if (res == undefined) {
            setCycleDashboard(5000);
            return;
        }
        console.log(res);
        setDataDashboard(res)
        setCycleDashboard(5000);
    }, cycle_dashboard);


    return (
        <div
            className={`text-white text-3xl font-bold w-full h-screen flex flex-col p-2 gap-2 pt-4
                `}
        >
            <div className={`m-1 text-center`}>PHẦN MỀM GIÁM SÁT NĂNG LƯỢNG</div>
            <div className={`grid grid-cols-5 text-lg gap-2 min-h-40`}>
                <div className='flex flex-row rounded-md border-[#cccccccc] p-2 shadow-[inset_0px_0px_1px_1px_#fff] border-[1px]
                    bg-[#8922a3]'>
                    <GiPowerLightning style={{ fontSize: 70 }} className='items-center justify-center h-full' />
                    <div className={`flex-1 flex flex-col items-center`}>
                        <div className='flex items-center justify-center text-center'>CÔNG SUẤT TIÊU THỤ</div>
                        <div className='flex-1 flex flex-col h-full items-center justify-center'>
                            <div className='flex-1 text-5xl flex items-center justify-center'>{`${cong_suat_today}`}<span className='text-sm  mt-4 ml-2 opacity-60'>kW</span></div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row rounded-md border-[#cccccccc] p-2 shadow-[inset_0px_0px_1px_1px_#fff] border-[1px]
                    bg-[#da2218]'>
                    <MdElectricBolt style={{ fontSize: 70 }} className='items-center justify-center h-full' />
                    <div className={`flex-1 flex flex-col items-center`}>
                        <div className='flex items-center justify-center text-center'>ĐIỆN NĂNG TIÊU THỤ HÔM NAY</div>
                        <div className='flex-1 flex flex-col h-full items-center justify-center'>
                            <div className='flex-1 text-5xl flex items-center justify-center'>{`${data_dashboard['total_dien_today']}`}<span className='text-sm  mt-4 ml-2 opacity-60'>kWh</span></div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row rounded-md border-[#cccccccc] p-2 shadow-[inset_0px_0px_1px_1px_#fff] border-[1px]
                    bg-[#539241]'>
                    <IoWaterOutline style={{ fontSize: 70 }} className='items-center justify-center h-full' />
                    <div className={`flex-1 flex flex-col items-center`}>
                        <div className='flex items-center justify-center text-center'>LƯỢNG NƯỚC TIÊU THỤ HÔM NAY</div>
                        <div className='flex-1 flex flex-col h-full items-center justify-center'>
                            <div className='flex-1 text-5xl flex items-center justify-center'>{`${data_dashboard['total_nuoc_today']}`}<span className='text-sm  mt-4 ml-2 opacity-60'>m3</span></div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row rounded-md border-[#cccccccc] p-2 shadow-[inset_0px_0px_1px_1px_#fff] border-[1px]
                    bg-gradient-to-br to-[#273286] from-[#da2218]'>
                    <MdAttachMoney style={{ fontSize: 70 }} className='items-center justify-center h-full' />
                    <div className={`flex-1 flex flex-col items-center`}>
                        <div className='flex items-center justify-center text-center'>ĐIỆN NĂNG THÁNG NÀY</div>
                        <div className='flex-1 flex flex-col h-full items-center justify-center'>
                            <div className='flex-1 text-5xl flex items-center justify-center'>{`${data_dashboard['dien_nang_thang_nay']}`}<span className='text-sm  mt-4 ml-2 opacity-60'>kWh</span></div>
                        </div>
                        <div className='text-xl flex items-center justify-center opacity-55'>{`${data_dashboard['tien_dien_thang_nay']} VNĐ`}</div>
                    </div>
                </div>
                <div className='flex flex-row rounded-md border-[#cccccccc] p-2 shadow-[inset_0px_0px_1px_1px_#fff] border-[1px]
                    bg-gradient-to-br to-[#273286] from-[#539241]'>
                    <MdAttachMoney style={{ fontSize: 70 }} className='items-center justify-center h-full' />
                    <div className={`flex-1 flex flex-col items-center`}>
                        <div className='flex items-center justify-center text-center'>LƯỢNG NƯỚC THÁNG NÀY</div>
                        <div className='flex-1 flex flex-col h-full items-center justify-center'>
                            <div className='flex-1 text-5xl flex items-center justify-center'>{`${data_dashboard['luong_nuoc_thang_nay']}`}<span className='text-sm  mt-4 ml-2 opacity-60'>m3</span></div>
                        </div>
                        <div className='text-xl flex items-center justify-center opacity-55'>{`${data_dashboard['tien_nuoc_thang_nay']} VNĐ`}</div>
                    </div>
                </div>
            </div>
            <div className='flex-1 grid grid-cols-6 grid-rows-2 gap-3'>
                <div className='col-span-4'><BieuDoNangLuongThangTruocThangNay data={data_dashboard['chart_ss_dien']} /></div>
                <div className='col-span-2'><BieuDoNangLuongHomNay data={data_dashboard['chart_dien']} /></div>
                <div className='col-span-4'><BieuDoNuocThangTruocThangNay data={data_dashboard['chart_ss_nuoc']} /></div>
                <div className='col-span-2'><BieuDoNuocHomNay data={data_dashboard['chart_nuoc']} /></div>
            </div>
        </div>
    );
}
