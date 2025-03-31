"use client";
import { InputRef } from "antd/es/input";
import { useEffect, useRef, useState } from "react";
import { useInterval } from "usehooks-ts";
import {
  Input,
  Table,
  ConfigProvider,
  theme,
  Badge,
  Tooltip,
  Progress,
  Button,
  Popconfirm,
} from "antd";
import { toast } from "react-toastify";
import {
  EditOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import React from "react";
import { TYPE_CPU, TYPE_BANG} from "../database";

//   function WidgetDetail({ data }: { data: TYPE_BANG[] }) {
//   // Tạo dữ liệu với 23 hàng và 9 cột
  
//   const columns = [
//    {
//     title: <span className="font-bold text-lg">Line</span>,
//     align: "center",
//     dataIndex: "line",
//     key: "line",
//     width: 100,
//    },
//   {
//    title: <span className="font-bold text-lg">Style name</span>,
//    align: "center",
//    dataIndex: "name",
//    key: "name",
//    width: 100,
//   },
//   {
//     title: <span className="font-bold text-lg">Total</span>,
//     align: "center",
//     dataIndex: "total",
//     key: "total",
//     width: 100,
//    },
//   {
//    title: <span className="font-bold text-lg">Product Qty</span>,
//    align: "center",
//    dataIndex: "produced_qty",
//    key: "produced_qty",
//    width: 100,
//   },
//   {
//     title: <span className="font-bold text-lg">QC</span>,
//     align: "center",
//     dataIndex: "qc_passed",
//     key: "qc_passed",
//     width: 100,
//    },
//   {
//    title: <span className="font-bold text-lg">Product total day</span>,
//    align: "center",
//    dataIndex: "total_product",
//    key: "total_product",
//    width: 100,
//   },
//   {
//     title: <span className="font-bold text-lg">Target</span>,
//     align: "center",
//     dataIndex: "today_target",
//     key: "today_target",
//     width: 100,
//    },
//   {
//    title: <span className="font-bold text-lg">Actual</span>,
//    align: "center",
//    dataIndex: "today_actual",
//    key: "today_actual",
//    width: 100,
//   },
//   {
//     title: <span className="font-bold text-lg">Efficient</span>,
//     align: "center",
//     dataIndex: "efficient",
//     key: "efficient",
//     width: 100,
//    },
//   ]
  
//   return (
//     <Table
//       columns={columns}
//       // dataSource={data}
//       pagination={false}
//       bordered
//       scroll={{ x: 1500, y: 500 }} // Cuộn ngang và dọc
//     />
//   );
// };
const WidgetDetail = () => {
  // Danh sách tiêu đề cột
  const columns = [
    { title: "Line", align: "center",dataIndex: "line", key: "line", fixed: "top" , width: 50},
    { title: "Style name", align: "center",dataIndex: "name", key: "name" , fixed: "top", width: 100 },
    { title: "Total", align: "center",dataIndex: "total", key: "total", fixed: "top", width: 80},
    { title: "Product Qty", align: "center",dataIndex: "produced_qty", key: "produced_qty", fixed: "top", width: 80},
    { title: "Qc", align: "center",dataIndex: "qc_passed", key: "qc_passed", fixed: "top", width: 80},
    { title: "Total day", align: "center",dataIndex: "total_product", key: "total_product", fixed: "top", width: 80},
    { title: "Target", align: "center", dataIndex: "today_target", key: "today_target" , fixed: "top", width: 80},
    { title: "Actual", align: "center", dataIndex: "today_actual", key: "today_actual" , fixed: "top", width: 80},
    { title: "Efficient", align: "center", dataIndex: "efficient", key: "efficient" , fixed: "top", width: 180},
  ];

  const data = generateRandomData();

  return <Table columns={columns} dataSource={data} pagination={false}  borered  scroll={{ y: 1080 }} sticky/>;
};

const generateRandomData = () => {
  return Array.from(Array(22).keys(), (key) => ({
    id: key + 1,
    name: `CODE ${key + 1}`,
    line: key + 1,
    total: Math.floor(Math.random() * 5000),
    device_active: Math.floor(Math.random() * 5000),
    total_product: Math.floor(Math.random() * 5000),
    produced_qty: Math.floor(Math.random() * 5000),
    today_target: Math.floor(Math.random() * 5000),
    today_actual: Math.floor(Math.random() * 5000),
    balance: Math.floor(Math.random() * 5000),
    qc_passed: Math.floor(Math.random() * 5000),
    enable: Math.floor(Math.random() * 1),
    efficient: Math.floor(Math.random() * 99),
  }));
};

export default function Page() {
    const [listBang, setListBang] = useState<TYPE_BANG[]>(generateRandomData());
    useEffect(() => {
      const interval = setInterval(() => {
        setListBang(generateRandomData());
      }, 1000); // Cập nhật mỗi 1 giây
  
      return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, []);
  return (
    
    <div className="text-white text-3xl font-bold w-full h-full flex-1 flex-col p-2 gap-4">
      {/* Chuyển trang mượt mà với Framer Motion */}
      <div className="flex-1 flex overflow-hidden mb-2">
        <WidgetDetail data={listBang} />
      </div>
    </div>
  );
}