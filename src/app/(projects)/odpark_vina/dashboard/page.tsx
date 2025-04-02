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
    board: `Bảng ${i + 1}`,
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
      title: "Bảng",
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
      title: "Đã sản xuất",
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
          strokeColor={
            value > 85 ? "#52c41a" : value > 70 ? "#1890ff" : "#f5222d"
          }
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
          Mục tiêu: ${target}<br/>
          Thực hiện: ${actual}<br/>
          Hiệu suất: ${efficiency}%
        `;
      },
    },
    legend: {
      data: ["Mục tiêu", "Thực hiện"],
      textStyle: { color: "#fff" },
      right: 10,
      top: 0,
    },
    grid: {
      left: "1%",
      right: "1%",
      bottom: "3%",
      containLabel: true,
      show: true,
      borderColor: "rgba(255, 255, 255, 0.1)",
      backgroundColor: "transparent", // Thay đổi nền grid thành trong suốt
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
      splitLine: {
        show: false,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.08)",
          type: "dashed",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "Số lượng",
      nameTextStyle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
      },
      axisLabel: {
        color: "#fff",
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.08)",
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "Mục tiêu",
        type: "bar",
        barWidth: "30%",
        data: currentData.map((item) => item.total),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(24, 144, 255, 0.8)" }, // Thêm độ trong suốt
              { offset: 1, color: "rgba(9, 109, 217, 0.8)" }, // Thêm độ trong suốt
            ],
          },
          borderRadius: [4, 4, 0, 0],
          shadowColor: "rgba(0, 0, 0, 0.3)",
          shadowBlur: 10,
        },
        label: {
          show: false,
        },
      },
      {
        name: "Thực hiện",
        type: "bar",
        barWidth: "30%",
        data: currentData.map((item) => item.produced),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(82, 196, 26, 0.8)" }, // Thêm độ trong suốt
              { offset: 1, color: "rgba(56, 158, 13, 0.8)" }, // Thêm độ trong suốt
            ],
          },
          borderRadius: [4, 4, 0, 0],
          shadowColor: "rgba(0, 0, 0, 0.3)",
          shadowBlur: 10,
        },
        label: {
          show: false,
        },
      },
    ],
  };

  return (
    <div
      className="text-white w-full h-screen flex flex-col p-4 gap-4"
      style={{
        background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 3D Background Grid with Perspective Effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          perspective: "9000px",
          transformStyle: "preserve-3d",
          zIndex: 0,
          overflow: "hidden",
          height: "100vh",
          width: "100vw",
          pointerEvents: "none",
        }}
      >
        {/* 3D Grid Floor */}
        <div
          style={{
            position: "absolute",
            width: "400%",
            height: "400%",
            top: "-150%",
            left: "-150%",
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            transform: "rotateX(60deg) translateZ(-100px)",
            transformOrigin: "center",
            animation: "gridMove 30s linear infinite",
          }}
        />

        {/* Ambient Light Effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(66, 153, 225, 0.15) 0%, rgba(17, 24, 39, 0) 70%)",
          }}
        />

        {/* Glowing Particles (Simulated with Gradient Spots) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(17, 24, 39, 0) 20%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.15) 0%, rgba(17, 24, 39, 0) 25%), radial-gradient(circle at 40% 90%, rgba(59, 130, 246, 0.15) 0%, rgba(17, 24, 39, 0) 30%), radial-gradient(circle at 90% 30%, rgba(16, 185, 129, 0.15) 0%, rgba(17, 24, 39, 0) 20%)",
          }}
        />
      </div>

      {/* Content with Glass Morphism */}
      <div className="relative z-10 text-center mb-2">
        <h1
          className="text-3xl font-bold"
          style={{
            background: "linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          DASHBOARD GIÁM SÁT SẢN XUẤT
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 relative z-10">
        {/* Card 1 */}
        <div
          className="rounded-lg shadow-lg flex items-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(217, 119, 6, 0.9) 100%)",
            boxShadow:
              "0 4px 20px rgba(245, 158, 11, 0.4), 0 0 15px rgba(245, 158, 11, 0.2)",
            transform: "translateZ(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="h-full flex items-center justify-center p-4 bg-black bg-opacity-20">
            <FaBoxes className="text-4xl" />
          </div>
          <div className="p-4 flex-1">
            <div className="text-sm opacity-80 font-medium">
              Số line đang hoạt động
            </div>
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

        {/* Card 2 */}
        <div
          className="rounded-lg shadow-lg flex items-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(30, 64, 175, 0.8) 0%, rgba(37, 99, 235, 0.9) 100%)",
            boxShadow:
              "0 4px 20px rgba(37, 99, 235, 0.4), 0 0 15px rgba(37, 99, 235, 0.2)",
            transform: "translateZ(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="h-full flex items-center justify-center p-4 bg-black bg-opacity-20">
            <FaBoxes className="text-4xl" />
          </div>
          <div className="p-4 flex-1">
            <div className="text-sm opacity-80 font-medium">
              Đơn hàng đã sản xuất
            </div>
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

        {/* Card 3 */}
        <div
          className="rounded-lg shadow-lg flex items-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(124, 58, 237, 0.8) 0%, rgba(109, 40, 217, 0.9) 100%)",
            boxShadow:
              "0 4px 20px rgba(124, 58, 237, 0.4), 0 0 15px rgba(124, 58, 237, 0.2)",
            transform: "translateZ(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="h-full flex items-center justify-center p-4 bg-black bg-opacity-20">
            <FaClipboardCheck className="text-4xl" />
          </div>
          <div className="p-4 flex-1">
            <div className="text-sm opacity-80 font-medium">
              Đã kiểm tra (QC Passed)
            </div>
            <div className="text-3xl font-bold">{productionData.qc_passed}</div>
            <Progress
              percent={
                +(
                  (productionData.qc_passed / productionData.produced_qty) *
                    100 || 0
                ).toFixed(2)
              }
              status="normal"
              strokeColor="#a855f7"
            />
          </div>
        </div>

        {/* Card 4 */}
        <div
          className="rounded-lg shadow-lg flex items-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(22, 163, 74, 0.8) 0%, rgba(21, 128, 61, 0.9) 100%)",
            boxShadow:
              "0 4px 20px rgba(22, 163, 74, 0.4), 0 0 15px rgba(22, 163, 74, 0.2)",
            transform: "translateZ(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="h-full flex items-center justify-center p-4 bg-black bg-opacity-20">
            <FaIndustry className="text-4xl" />
          </div>
          <div className="p-4 flex-1">
            <div className="text-sm opacity-80 font-medium">
              Hôm nay (Actual/Target)
            </div>
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
              strokeColor={
                productionData.today_actual >= productionData.today_target
                  ? "#52c41a"
                  : "#ff4d4f"
              }
            />
          </div>
        </div>

        {/* Card 5 */}
        <div
          className="rounded-lg shadow-lg flex items-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(234, 88, 12, 0.8) 0%, rgba(194, 65, 12, 0.9) 100%)",
            boxShadow:
              "0 4px 20px rgba(234, 88, 12, 0.4), 0 0 15px rgba(234, 88, 12, 0.2)",
            transform: "translateZ(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="h-full flex items-center justify-center p-4 bg-black bg-opacity-20">
            <GiProgression className="text-4xl" />
          </div>
          <div className="p-4 flex-1">
            <div className="text-sm opacity-80 font-medium">
              Hiệu suất trung bình
            </div>
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
              strokeColor={
                productionData.efficiency > 85
                  ? "#52c41a"
                  : productionData.efficiency > 70
                  ? "#faad14"
                  : "#ff4d4f"
              }
            />
          </div>
        </div>
      </div>

      {/* Biểu đồ và bảng dữ liệu */}
      <div className="flex-1 grid grid-cols-3 gap-4 relative z-10">
        {/* Biểu đồ Target vs Actual - Bỏ nền và để trong suốt */}
        <div
          className="col-span-2 p-4 rounded-lg flex flex-col "
          style={{
            height: "calc(100vh - 200px)",
            background: "transparent", // Nền hoàn toàn trong suốt
            border: "1px solid rgba(255, 255, 255, 0.1)", // Chỉ giữ viền mỏng
            boxShadow: "none",
            transform: "translateZ(5px)",
          }}
        >
          <div className="flex justify-between items-center mb-4 rounded-lg">
            <h2 className="text-xl font-semibold flex items-center">
              <FaTachometerAlt className="mr-2 text-blue-400" />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold",
                }}
              >
                {chartMode === "line"
                  ? "BIỂU ĐỒ THEO DÕI TIẾN ĐỘ CÁC BẢNG THEO NGÀY"
                  : "BIỂU ĐỒ THEO DÕI TIẾN ĐỘ CÁC BẢNG THEO GIỜ"}
              </span>
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartMode("line")}
                className={`px-3 py-1 rounded-full transition-all duration-300 ${
                  chartMode === "line"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300"
                }`}
                style={{
                  boxShadow:
                    chartMode === "line"
                      ? "0 0 15px rgba(59, 130, 246, 0.5)"
                      : "none",
                }}
              >
                Theo Ngày
              </button>
              <button
                onClick={() => setChartMode("hour")}
                className={`px-3 py-1 rounded-full transition-all duration-300 ${
                  chartMode === "hour"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300"
                }`}
                style={{
                  boxShadow:
                    chartMode === "hour"
                      ? "0 0 15px rgba(59, 130, 246, 0.5)"
                      : "none",
                }}
              >
                Theo Giờ
              </button>
            </div>
          </div>

          <div className="flex-1">
            <ReactECharts
              option={{
                ...lineChartOption,
                backgroundColor: "transparent", // Đảm bảo biểu đồ có nền trong suốt
              }}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </div>

        {/* Thông tin tổng quan - Làm trong suốt để nhìn thấy grid 3D */}
        <div
          className="p-4 rounded-lg flex flex-col"
          style={{
            background: "transparent", // Nền hoàn toàn trong suốt
            border: "1px solid rgba(255, 255, 255, 0.1)", // Chỉ giữ viền mỏng
            boxShadow: "none",
            transform: "translateZ(5px)",
          }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaBalanceScale className="mr-2 text-purple-400" />
            <span
              style={{
                background: "linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              TIẾN ĐỘ CÁC BẢNG
            </span>
          </h2>
          <div className="space-y-4 flex-1">
            <div
              className="flex-1 flex flex-col"
              style={{ minHeight: "400px" }}
            >
              <div
                className="flex-1 overflow-auto"
                style={{
                  boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  background: "transparent", // Làm nền trong suốt
                }}
              >
                <Table
                  columns={columns}
                  dataSource={currentData}
                  size="small"
                  pagination={false}
                  scroll={{ y: "calc(100vh - 350px)" }}
                  className="production-table"
                  rowClassName={
                    (record, index) =>
                      index % 2 === 0
                        ? "bg-opacity-30 even-row" // Giảm độ mờ
                        : "bg-opacity-20 odd-row" // Giảm độ mờ
                  }
                  style={{
                    background: "transparent",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thêm global styles cho các component Ant Design */}
      <style jsx global>{`
        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 40px;
          }
        }

        .ant-table {
          background: transparent !important;
          color: white !important;
        }

        .ant-table-thead > tr > th {
          background: rgba(30, 41, 59, 0.5) !important; /* Giảm độ đậm */
          color: white !important;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1) !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          color: rgba(255, 255, 255, 0.85) !important;
          transition: all 0.3s ease;
          background: transparent !important; /* Đảm bảo nền trong suốt */
        }

        .ant-table-tbody > tr.even-row > td {
          background: rgba(
            30,
            41,
            59,
            0.3
          ) !important; /* Hàng chẵn với nền mờ */
        }

        .ant-table-tbody > tr.odd-row > td {
          background: rgba(17, 24, 39, 0.2) !important; /* Hàng lẻ với nền mờ */
        }

        .ant-table-tbody > tr:hover > td {
          background: rgba(59, 130, 246, 0.15) !important;
          transform: translateZ(5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .ant-progress-text {
          color: white !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .ant-progress-bg {
          height: 8px !important;
          border-radius: 4px !important;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }

        .ant-progress-inner {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        .ant-table-column-sorter {
          color: rgba(255, 255, 255, 0.45) !important;
        }

        .ant-table-column-sorter-up.active,
        .ant-table-column-sorter-down.active {
          color: #1890ff !important;
          text-shadow: 0 0 8px rgba(24, 144, 255, 0.5);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
}
