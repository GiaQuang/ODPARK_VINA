"use client";
import { useEffect, useRef, useState } from "react";
import { useInterval, useWindowSize } from "usehooks-ts";
import { Input, Progress, Table } from "antd";
import { toast } from "react-toastify";
import ReactECharts from "echarts-for-react";
import {
  FaBoxes,
  FaClipboardCheck,
  FaIndustry,
  FaTachometerAlt,
  FaCalendarAlt,
  FaBalanceScale,
} from "react-icons/fa";
import { GiProgression } from "react-icons/gi";

// Mock API functions - Thay bằng API thực tế của bạn
const api_get_production_data = async () => ({
  total_device: 22,
  device_active: 22,
  total_orders: 1500,
  produced_qty: 872,
  today_target: 120,
  today_actual: 98,
  balance: 628,
  qc_passed: 320,
  production_days: 7,
  efficiency: 81.6,
  hourly_progress: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    target: 10 + Math.floor(Math.random() * 5),
    actual: 8 + Math.floor(Math.random() * 7),
  })),
  order_progress: Array.from({ length: 22 }, (_, i) => ({
    key: i,
    board: `B${i + 1}`,
    total: 500 + Math.floor(Math.random() * 1000),
    produced: 200 + Math.floor(Math.random() * 400),
    balance: 300 + Math.floor(Math.random() * 600),
    efficiency: 70 + Math.floor(Math.random() * 30),
  })),
});

export default function ProductionDashboard() {
  const [productionData, setProductionData] = useState({
    total_device: 0,
    device_active: 0,
    total_orders: 0,
    produced_qty: 0,
    today_target: 0,
    today_actual: 0,
    balance: 0,
    qc_passed: 0,
    production_days: 0,
    efficiency: 0,
    hourly_progress: [],
    order_progress: [],
  });

  const [refreshInterval, setRefreshInterval] = useState<number | null>(5000);

  useInterval(async () => {
    const data = await api_get_production_data();
    setProductionData(data);
  }, refreshInterval);

  // Cột cho bảng tiến độ đơn hàng
  const columns = [
    {
      title: "Bảng",
      dataIndex: "board",
      key: "board",
      sorter: (a, b) => a.board.localeCompare(b.board),
    },
    {
      title: "Tổng đơn",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Đã SX",
      dataIndex: "produced",
      key: "produced",
      sorter: (a, b) => a.produced - b.produced,
    },
    {
      title: "Còn lại",
      dataIndex: "balance",
      key: "balance",
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: "Hiệu suất",
      dataIndex: "efficiency",
      key: "efficiency",
      render: (value) => (
        <Progress
          percent={value}
          status={value > 85 ? "success" : value > 70 ? "normal" : "exception"}
          format={(percent) => `${percent}%`}
        />
      ),
      sorter: (a, b) => a.efficiency - b.efficiency,
    },
  ];

  // Biểu đồ so sánh Target vs Actual theo giờ
  const hourlyChartOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["Target", "Actual"],
      textStyle: { color: "#fff" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: productionData.hourly_progress.map((item) => item.hour),
      axisLabel: {
        color: "#fff",
      },
    },
    yAxis: {
      type: "value",
      name: "Số lượng",
      axisLabel: {
        color: "#fff",
      },
      splitLine: {
        lineStyle: {
          color: "#ffffff30",
        },
      },
    },
    series: [
      {
        name: "Target",
        type: "bar",
        data: productionData.hourly_progress.map((item) => item.target),
        itemStyle: {
          color: "#1890ff",
        },
      },
      {
        name: "Actual",
        type: "bar",
        data: productionData.hourly_progress.map((item) => item.actual),
        itemStyle: {
          color: "#52c41a",
        },
      },
    ],
  };

  return (
    <div className="text-white w-full h-screen flex flex-col p-4 gap-4 bg-gray-900">
      <h1 className="text-2xl font-bold text-center">
        DASHBOARD GIÁM SÁT SẢN XUẤT
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-blue-800 p-4 rounded-lg shadow-lg flex items-center">
          <FaBoxes className="text-4xl mr-4" />
          <div>
            <div className="text-lg opacity-80">Số line đang hoạt động</div>
            <div className="text-3xl font-bold">
              {productionData.device_active}
            </div>
            <Progress
              percent={
                (productionData.device_active / productionData.total_device) *
                100
              }
              status="active"
              strokeColor="#52c41a"
            />
          </div>
        </div>

        {/* Tổng đơn hàng */}
        <div className="bg-blue-800 p-4 rounded-lg shadow-lg flex items-center">
          <FaBoxes className="text-4xl mr-4" />
          <div>
            <div className="text-lg opacity-80">Đơn hàng đã sản xuất</div>
            <div className="text-3xl font-bold">
              {productionData.produced_qty} / {productionData.total_orders}
            </div>
            <Progress
              percent={(
                (productionData.produced_qty / productionData.total_orders) *
                100
              ).toFixed(2)}
              status="active"
              strokeColor="#52c41a"
            />
          </div>
        </div>

        {/* QC Passed */}
        <div className="bg-purple-800 p-4 rounded-lg shadow-lg flex items-center">
          <FaClipboardCheck className="text-4xl mr-4" />
          <div>
            <div className="text-lg opacity-80">Đã kiểm tra (QC Passed)</div>
            <div className="text-3xl font-bold">{productionData.qc_passed}</div>
            <Progress
              percent={parseFloat(
                (
                  (productionData.qc_passed / productionData.produced_qty) *
                    100 || 0
                ).toFixed(2)
              )}
              status="normal"
              strokeColor="#722ed1"
            />
          </div>
        </div>

        {/* Sản lượng hôm nay */}
        <div className="bg-green-800 p-4 rounded-lg shadow-lg flex items-center">
          <FaIndustry className="text-4xl mr-4" />
          <div>
            <div className="text-lg opacity-80">Hôm nay (Actual/Target)</div>
            <div className="text-3xl font-bold">
              {productionData.today_actual} / {productionData.today_target}
            </div>
            <Progress
              percent={
                (productionData.today_actual / productionData.today_target) *
                100
              }
              status={
                productionData.today_actual >= productionData.today_target
                  ? "success"
                  : "exception"
              }
            />
          </div>
        </div>

        {/* Hiệu suất */}
        <div className="bg-orange-800 p-4 rounded-lg shadow-lg flex items-center">
          <GiProgression className="text-4xl mr-4" />
          <div>
            <div className="text-lg opacity-80">Hiệu suất trung bình</div>
            <div className="text-3xl font-bold">
              {productionData.efficiency}%
            </div>
            <Progress
              percent={productionData.efficiency}
              status={
                productionData.efficiency > 85
                  ? "success"
                  : productionData.efficiency > 70
                  ? "normal"
                  : "exception"
              }
              strokeColor="#fa8c16"
            />
          </div>
        </div>
      </div>

      {/* Biểu đồ và bảng dữ liệu */}
      <div className="flex-1 grid grid-cols-3 gap-4">
        {/* Biểu đồ Target vs Actual */}
        <div className="col-span-2 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaTachometerAlt className="mr-2" /> TIẾN ĐỘ SẢN XUẤT THEO GIỜ
          </h2>
          <ReactECharts
            option={hourlyChartOption}
            style={{ height: "100%", width: "100%" }}
          />
        </div>

        {/* Thông tin tổng quan */}
        <div className="bg-gray-800 p-4 rounded-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaBalanceScale className="mr-2" /> TỔNG QUAN ĐƠN HÀNG
          </h2>
          <div className="space-y-4 flex-1">
            <div>
              <div className="flex justify-between mb-1">
                <span>Số lượng còn lại:</span>
                <span className="font-bold">{productionData.balance}</span>
              </div>
              <Progress
                percent={(
                  (productionData.produced_qty / productionData.total_orders) *
                  100
                ).toFixed(2)}
                status="active"
                strokeColor="#52c41a"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Số ngày thực hiện:</span>
                <span className="font-bold">
                  {productionData.production_days} ngày
                </span>
              </div>
              <Progress
                percent={(productionData.production_days / 30) * 100}
                format={() => `${productionData.production_days}/30 ngày`}
              />
            </div>

            <div className="flex-1">
              <h3 className="mb-2 flex items-center">
                <FaCalendarAlt className="mr-2" /> Tiến độ các line
              </h3>
              <Table
                columns={columns}
                dataSource={productionData.order_progress}
                size="small"
                pagination={false}
                scroll={{ y: 200 }}
                className="production-table"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
