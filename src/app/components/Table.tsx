/** @format */
"use client";
import type { TableColumnsType } from "antd";
import dayjs from "dayjs";
import { Table } from "antd";
import { useState } from "react";

type DataType = {
    stt: number;
    ts_start: string;
    ts_end: string;
    eff_oee: number;
};

export default function Page3({ show, languageIdx }: { show: boolean; languageIdx: number }) {
    const [table_data, set_table_data] = useState<DataType[]>([]);

    const columns: TableColumnsType<DataType> = [
        {
            title: <div className={`text-center font-black text-xl py-1 text-blue-950`}>STT</div>,
            dataIndex: "stt", //Kiểu của type
            sorter: (a, b) => {
                return a.stt > b.stt ? a.stt : b.stt;
            },
            ellipsis: true,
            render: (value, record, index) => {
                return <div className={`text-center font-black`}>{value}</div>;
            },
            onCell: (_, index) => ({
                colSpan: 1,
            }),
            width: 80,
        },
        {
            title: <div className={`text-center font-black text-xl py-1 text-blue-950`}>THỜI GIAN LÀM VIỆC</div>,
            children: [
                {
                    title: "a",
                    dataIndex: "ts_start",
                    ellipsis: true,
                    render: (value, record, index) => {
                        return <div className={`text-center py-[0.20rem]`}>{value}</div>;
                    },
                    width: 140,
                },
                {
                    title: "b",
                    dataIndex: "ts_end",
                    ellipsis: true,
                    render: (value, record, index) => {
                        return <div className={`text-center py-[0.20rem]`}>{value}</div>;
                    },
                    width: 140,
                },
            ],
        },
        {
            title: <div className={`text-center font-black text-xl py-1 text-blue-950`}>TÊN SẢN PHẨM</div>,
            children: [
                {
                    title: <div className="text-center">-</div>,
                    dataIndex: "ten_model",
                    ellipsis: true,
                    render: (value, record, index) => {
                        return <div className={`text-center py-[0.20rem]`}>{value}</div>;
                    },
                    onCell: (_, index) => ({
                        // colSpan: index === 1 ? 5 : 1,
                        colSpan: 1, //Đây là colSpan của cell
                    }),
                    colSpan: 1, // Đây là colSpan của header
                },
            ],
        },
    ];

    return (
        <div className="flex-1 flex flex-col mt-8 bg-slate-600 text-red-500">
            <Table
                className="flex-1"
                size="small"
                bordered={true}
                columns={columns}
                dataSource={table_data}
                onChange={() => {}}
                pagination={{
                    style: {
                        marginTop: 2,
                        fontSize: 22,
                        padding: 18,
                        background: "#607080",
                        bottom: 0,
                        position: "relative",
                    },
                    pageSize: 16,
                    position: ["bottomCenter"],
                    simple: false,
                    onShowSizeChange: (cur: number, size: number) => {
                        console.log(cur, size);
                    },
                    showSizeChanger: false,
                }}
            />
        </div>
    );
}
