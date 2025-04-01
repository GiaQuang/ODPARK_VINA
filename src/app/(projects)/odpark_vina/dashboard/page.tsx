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

// Mock API functions
const api_get_production_data = async () => ({
  total_device: 22,
  device_active: 20,
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
    board: `Line ${i + 1}`,
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
  const [chartMode, setChartMode] = useState<"line" | "hour">("line");

  useInterval(async () => {
    const data = await api_get_production_data();
    setProductionData(data);
  }, refreshInterval);

  // Tạo dữ liệu giả lập cho chế độ giờ (số lượng giảm đi 50%)
  const hourlyLineData = productionData.order_progress.map((item) => ({
    ...item,
    produced: Math.floor(item.produced * 0.5),
    total: Math.floor(item.total * 0.5),
  }));

  // Lựa chọn dữ liệu theo chế độ
  const currentData =
    chartMode === "hour" ? hourlyLineData : productionData.order_progress;

  // Cột cho bảng tiến độ đơn hàng
  const columns = [
    {
      title: "Line",
      dataIndex: "board",
      key: "board",
      sorter: (a: any, b: any) => a.board.localeCompare(b.board),
    },
    {
      title: "Tổng đơn",
      dataIndex: "total",
      key: "total",
      sorter: (a: any, b: any) => a.total - b.total,
    },
    {
      title: "Đã SX",
      dataIndex: "produced",
      key: "produced",
      sorter: (a: any, b: any) => a.produced - b.produced,
    },
    {
      title: "Còn lại",
      dataIndex: "balance",
      key: "balance",
      sorter: (a: any, b: any) => a.balance - b.balance,
    },
    {
      title: "Hiệu suất",
      dataIndex: "efficiency",
      key: "efficiency",
      render: (value: number) => (
        <Progress
          percent={value}
          status={value > 85 ? "success" : value > 70 ? "normal" : "exception"}
          format={(percent) => `${percent}%`}
        />
      ),
      sorter: (a: any, b: any) => a.efficiency - b.efficiency,
    },
  ];

  // Biểu đồ so sánh Target vs Actual
  const lineChartOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: any) => {
        const target = params[0].value;
        const actual = params[1].value;
        const line = params[0].axisValue;
        const efficiency = ((actual / target) * 100).toFixed(1);
        return `
          <strong>${line}</strong><br/>
          Target: ${target}<br/>
          Actual: ${actual}<br/>
          Hiệu suất: ${efficiency}%
        `;
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
      data: currentData.map((item) => `${item.board}`),
      axisLabel: {
        color: "#fff",
        rotate: 45,
        interval: 0,
      },
      nameTextStyle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
        padding: [10, 0, 0, 0],
      },
    },
    yAxis: {
      type: "value",
      name: "Số lượng",
      nameTextStyle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
      },
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
        barWidth: "30%",
        data: currentData.map((item) => item.total),
        itemStyle: {
          color: "#1890ff",
          borderRadius: [2, 2, 0, 0],
        },
        label: {
          show: false,
        },
      },
      {
        name: "Actual",
        type: "bar",
        barWidth: "30%",
        data: currentData.map((item) => item.produced),
        itemStyle: {
          color: "#52c41a",
          borderRadius: [2, 2, 0, 0],
        },
        label: {
          show: false,
        },
      },
    ],
    dataZoom: [
      {
        type: "slider",
        show: false,
        xAxisIndex: [0],
        filterMode: "filter",
        height: 10,
        bottom: 30,
        start: 0,
        end: 100,
        textStyle: {
          color: "#fff",
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
        <div className="bg-amber-500 p-4 rounded-lg shadow-lg flex items-center">
          <FaBoxes className="text-4xl mr-4" />
          <div>
            <div className="text-lg opacity-80">Số line đang hoạt động</div>
            <div className="text-3xl font-bold">
              {productionData.device_active} / {productionData.total_device}
            </div>
            <Progress
              percent={
                +(
                  (productionData.device_active / productionData.total_device) *
                  100
                ).toFixed(2)
              }
              status="active"
              strokeColor="#52c41a"
            />
          </div>
        </div>

        <div className="bg-blue-800 p-4 rounded-lg shadow-lg flex items-center">
          <FaBoxes className="text-4xl mr-4" />
          <div>
            <div className="text-lg opacity-80">Đơn hàng đã sản xuất</div>
            <div className="text-3xl font-bold">
              {productionData.produced_qty} / {productionData.total_orders}
            </div>
            <Progress
              percent={
                +(
                  (productionData.produced_qty / productionData.total_orders) *
                  100
                ).toFixed(2)
              }
              status="active"
              strokeColor="#52c41a"
            />
          </div>
        </div>

        <div className="bg-purple-800 p-4 rounded-lg shadow-lg flex items-center">
          <FaClipboardCheck className="text-4xl mr-4" />
          <div>
            <div className="text-lg opacity-80">Đã kiểm tra (QC Passed)</div>
            <div className="text-3xl font-bold">{productionData.qc_passed}</div>
            <Progress
              percent={
                +(
                  (productionData.qc_passed / productionData.produced_qty) *
                    100 || 0
                ).toFixed(2)
              }
              status="normal"
              strokeColor="#722ed1"
            />
          </div>
        </div>

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
        <div
          className="col-span-2 bg-gray-800 p-4 rounded-lg flex flex-col"
          style={{ height: "calc(100vh - 200px)" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaTachometerAlt className="mr-2" />
              {chartMode === "line"
                ? "BẢNG THEO DÕI TIẾN ĐỘ CÁC LINE"
                : "TIẾN ĐỘ THEO GIỜ (50% SẢN LƯỢNG)"}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartMode("line")}
                className={`px-3 py-1 rounded ${
                  chartMode === "line" ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                Theo Ngày
              </button>
              <button
                onClick={() => setChartMode("hour")}
                className={`px-3 py-1 rounded ${
                  chartMode === "hour" ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                Theo Giờ
              </button>
            </div>
          </div>

          <div className="flex-1">
            <ReactECharts
              option={lineChartOption}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </div>

        {/* Thông tin tổng quan */}
        <div className="bg-gray-800 p-4 rounded-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaBalanceScale className="mr-2" /> TIẾN ĐỘ CÁC BẢNG
          </h2>
          <div className="space-y-4 flex-1">
            {/* <div>
              <div className="flex justify-between mb-1">
                <span>Số lượng còn lại:</span>
                <span className="font-bold">{productionData.balance}</span>
              </div>
              <Progress
                percent={
                  +(
                    (productionData.produced_qty /
                      productionData.total_orders) *
                    100
                  ).toFixed(2)
                }
                status="active"
                strokeColor="#52c41a"
              />
            </div> */}

            {/* <div>
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
            </div> */}

            <div
              className="flex-1 flex flex-col"
              style={{ minHeight: "400px" }}
            >
              {/* <h3 className="mb-2 flex items-center">
                <FaCalendarAlt className="mr-2" /> Tiến độ các line
              </h3> */}
              <div className="flex-1 overflow-auto">
                <Table
                  columns={columns}
                  dataSource={currentData}
                  size="small"
                  pagination={false}
                  scroll={{ y: "calc(100vh - 350px)" }}
                  className="production-table"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
