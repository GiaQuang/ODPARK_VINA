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

// Định nghĩa kiểu dữ liệu cho một dòng sản xuất
interface ProductionLine {
  id: string;
  tenLine: string;
  maHang: string;
  tong: number;
  daLam: number;
  daDat: number;
  mucTieuNgay: number;
  mucTieuGio: number;
  thucTeNgay: number;
  thucTeGio: number;
  duKienNgay?: number;
}

// API giả định để lấy và cập nhật dữ liệu
const api_get_production_data = async () => {
  const randomData = Array.from({ length: 22 }, (_, index) => {
    const id = (index + 1).toString();
    const tong = Math.floor(Math.random() * (1500 - 800) + 800);
    const daLam = Math.floor(Math.random() * 800);
    const thucTeNgay = Math.floor(Math.random() * (1000 - 400) + 400);

    return {
      id,
      tenLine: `${id}`,
      maHang: `MH-${String(1 + index).padStart(3, "0")}`,
      tong,
      daLam,
      daDat: Math.floor(Math.random() * 800),
      mucTieuNgay: Math.floor(Math.random() * (1000 - 400) + 400),
      mucTieuGio: Math.floor(Math.random() * (120 - 40) + 40),
      thucTeNgay,
      thucTeGio: Math.floor(Math.random() * (120 - 40) + 40),
      duKienNgay: Math.ceil((tong - daLam) / thucTeNgay),
      gioLamViec: 8,
    };
  });

  return randomData;
};

const api_update_field = async (id: string, field: string, value: any) => {
  // Ở đây bạn sẽ gọi API thực tế để cập nhật giá trị
  console.log(`Cập nhật ${field} = ${value} cho id ${id}`);
  return true;
};

// API giả định để reset dữ liệu của một dòng
const api_reset_line = async (id: string) => {
  // Ở đây bạn sẽ gọi API thực tế để reset dữ liệu
  console.log(`Reset dữ liệu cho line id ${id}`);
  return true;
};

export default function ProductionTable() {
  const [productionData, setProductionData] = useState<ProductionLine[]>([]);
  const [cycle_rt_status, setCycleRfStatus] = useState<number | null>(2000);
  const [isConnected, setIsConnected] = useState(true);
  const [counter, setCounter] = useState(0);
  const [editingField, setEditingField] = useState<{
    id: string;
    field: string;
  } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Hiệu ứng nhấp nháy
  useInterval(() => {
    setCounter((p) => p + 1);
  }, 500);

  // Khởi tạo dữ liệu ban đầu
  useEffect(() => {
    async function loadData() {
      try {
        const data = await api_get_production_data();
        setProductionData(data);
        setIsConnected(true);
        setLastUpdated(new Date());
      } catch (error) {
        setIsConnected(false);
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    }
    loadData();
  }, []);

  // Cập nhật dữ liệu theo chu kỳ
  useInterval(async () => {
    setCycleRfStatus(null);
    try {
      const data = await api_get_production_data();
      setProductionData(data);
      setIsConnected(true);
      setLastUpdated(new Date());
      setCycleRfStatus(2000);
    } catch (error) {
      setIsConnected(false);
      setCycleRfStatus(5000);
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  }, cycle_rt_status);

  // Xử lý cập nhật giá trị
  const handleUpdateValue = async (id: string, field: string, value: any) => {
    try {
      toast.dismiss();
      toast.info("Đang cập nhật giá trị", { autoClose: 1000 });
      const result = await api_update_field(id, field, value);
      toast.dismiss();
      if (result === true) {
        toast.success("Cập nhật thành công", {
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
          autoClose: 1500,
        });
        // Cập nhật state local
        setProductionData((prevData) =>
          prevData.map((line) =>
            line.id === id ? { ...line, [field]: value } : line
          )
        );
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi server");
      console.error("Lỗi khi cập nhật:", error);
    } finally {
      setEditingField(null);
    }
  };

  // Xử lý reset dòng
  const handleResetLine = async (id: string) => {
    try {
      toast.dismiss();
      toast.info("Đang reset dữ liệu", { autoClose: 1000 });
      const result = await api_reset_line(id);
      toast.dismiss();
      if (result === true) {
        toast.success("Reset thành công", {
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
          autoClose: 1500,
        });
        setProductionData((prevData) =>
          prevData.map((line) =>
            line.id === id
              ? {
                  ...line,
                  tong: 0,
                  daLam: 0,
                  daDat: 0,
                  mucTieuNgay: 0,
                  mucTieuGio: 0,
                  thucTeNgay: 0,
                  thucTeGio: 0,
                  duKienNgay: 0,
                  gioLamViec: 8,
                }
              : line
          )
        );
      } else {
        toast.error("Reset thất bại");
      }
    } catch (error) {
      toast.error("Lỗi server");
      console.error("Lỗi khi reset:", error);
    }
  };

  // Tính toán tỷ lệ hoàn thành
  const calculateCompletion = (daLam: number, tong: number) => {
    return Math.round((daLam / tong) * 100);
  };

  // Tính toán màu sắc dựa trên tỷ lệ hoàn thành
  const getProgressColor = (completion: number) => {
    if (completion < 30) return "#f5222d";
    if (completion < 70) return "#faad14";
    return "#52c41a";
  };

  // Tính toán màu sắc cho hiệu suất
  const getEfficiencyColor = (thucTe: number, mucTieu: number) => {
    const ratio = thucTe / mucTieu;
    if (ratio < 0.85) return "#f5222d";
    if (ratio < 1) return "#faad14";
    return "#52c41a";
  };

  // Tính tổng số ngày dự kiến hoàn thành
  const calculateTotalDays = (record: ProductionLine) => {
    const remaining = record.tong - record.daLam;
    const dailyRate =
      record.thucTeNgay > 0 ? record.thucTeNgay : record.mucTieuNgay;

    if (dailyRate <= 0) return Infinity;

    return Math.ceil(remaining / dailyRate);
  };

  // Hàm tạo ô có thể chỉnh sửa
  const renderEditableCell = (
    value: any,
    record: ProductionLine,
    field: string,
    width: string,
    type: "text" | "number" = "number",
    placeholder = "Nhập giá trị"
  ) => {
    const isEditing =
      editingField?.id === record.id && editingField?.field === field;
    const isNumber = type === "number";

    return (
      <div className="flex items-center justify-center gap-2 group">
        <span
          className={`font-medium text-center text-xl${
            isNumber ? "text-cyan-300" : "text-orange-300"
          }`}
        >
          {isNumber ? value.toLocaleString("vi-VN") : value}
        </span>
        {isEditing ? (
          <input
            autoFocus
            className="w-20 p-1 bg-gray-800 border border-blue-400 rounded text-white"
            defaultValue={value}
            onBlur={() => setEditingField(null)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                const inputValue = (e.target as HTMLInputElement).value;
                let parsedValue;

                if (isNumber) {
                  parsedValue = Number.parseFloat(inputValue);
                  if (isNaN(parsedValue)) {
                    toast.error("Giá trị không hợp lệ");
                    return;
                  }
                } else {
                  parsedValue = inputValue;
                }

                handleUpdateValue(record.id, field, parsedValue);
              }
            }}
          />
        ) : (
          <EditOutlined
            className="text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setEditingField({ id: record.id, field })}
          />
        )}
      </div>
    );
  };

  // Định nghĩa cột cho bảng với độ rộng cố định
  const columns = [
    {
      title: <span className="font-bold text-xl">Bảng</span>,
      align: "center",
      dataIndex: "tenLine",
      key: "tenLine",
      render: (text: string, record: ProductionLine) =>
        renderEditableCell(
          text,
          record,
          "tenLine",
          "w-4 font-bold text-xl",
          "text",
          "Nhập tên"
        ),
      width: 40,
      className: "column-width-40",
    },
    {
      title: <span className="font-bold text-xl ">Mã hàng</span>,
      dataIndex: "maHang",
      key: "maHang",
      align: "center",
      render: (text: string, record: ProductionLine) =>
        renderEditableCell(
          text,
          record,
          "maHang",
          "w-20 font-bold text-lg",
          "text",
          "Nhập mã hàng"
        ),
      width: 80,
      className: "column-width-80",
    },
    {
      title: <span className="font-bold text-xl">Tổng đơn hàng</span>,
      dataIndex: "tong",
      key: "tong",
      align: "center",
      render: (value: number, record: ProductionLine) =>
        renderEditableCell(value, record, "tong", "w-16 text-lg"),
      width: 100,
      className: "column-width-100",
    },
    {
      title: <span className="font-bold text-xl">Đã làm</span>,
      dataIndex: "daLam",
      key: "daLam",
      align: "center",
      render: (value: number, record: ProductionLine) =>
        renderEditableCell(value, record, "daLam", "w-16 text-lg"),
      width: 100,
      className: "column-width-100",
    },
    {
      title: <span className="font-bold text-xl">Đã đạt</span>,
      dataIndex: "daDat",
      key: "daDat",
      align: "center",
      render: (value: number, record: ProductionLine) => {
        const percentage =
          record.daLam > 0
            ? Math.round((record.daDat / record.daLam) * 100)
            : 0;
        const status =
          percentage >= 98 ? "success" : percentage >= 90 ? "warning" : "error";

        return (
          <div className="flex items-center justify-center gap-2">
            {renderEditableCell(value, record, "daDat", "w-8 text-lg")}
          </div>
        );
      },
      width: 100,
      className: "column-width-100",
    },
    {
      title: <span className="font-bold text-xl">Tổng số ngày</span>,
      key: "tongSoNgay",
      align: "center",
      render: (_, record: ProductionLine) => {
        const days = record.duKienNgay ?? calculateTotalDays(record);
        let color = "#52c41a";

        if (days > 7) color = "#f5222d";
        else if (days > 3) color = "#faad14";

        const remaining = record.tong - record.daLam;

        return (
          <Tooltip
            title={`Còn lại: ${remaining.toLocaleString("vi-VN")} sản phẩm`}
          >
            <div className="flex items-center justify-center gap-2">
              {renderEditableCell(days, record, "duKienNgay", "w-16 text-xl")}
              {/* <div className="text-gray-400 text-xs">ngày</div> */}
            </div>
          </Tooltip>
        );
      },
      width: 100,
      className: "column-width-100",
    },
    {
      title: <span className="font-bold text-xl">Mục tiêu ngày</span>,
      dataIndex: "mucTieuNgay",
      key: "mucTieuNgay",
      align: "center",
      render: (value: number, record: ProductionLine) =>
        renderEditableCell(value, record, "mucTieuNgay", "w-16 text-lg"),
      width: 100,
      className: "column-width-100",
    },
    {
      title: <span className="font-bold text-xl">Số giờ làm/ngày</span>,
      dataIndex: "gioLamViec",
      key: "gioLamViec",
      align: "center",
      render: (value: number, record: ProductionLine) => (
        <div className="flex items-center justify-center gap-2">
          {renderEditableCell(value, record, "gioLamViec", "w-16 text-lg")}
          {/* <div className="text-gray-400 text-lg">giờ/ngày</div> */}
        </div>
      ),
      width: 100,
      className: "column-width-100",
    },
    {
      title: <span className="font-bold text-xl">Thực tế ngày</span>,
      dataIndex: "thucTeNgay",
      key: "thucTeNgay",
      align: "center",
      render: (value: number, record: ProductionLine) => {
        const color = getEfficiencyColor(value, record.mucTieuNgay);
        const percentage =
          record.mucTieuNgay > 0
            ? Math.round((value / record.mucTieuNgay) * 100)
            : 0;

        return (
          <div className="flex items-center justify-center gap-2">
            {renderEditableCell(value, record, "thucTeNgay", "w-16 text-lg")}
            <Tooltip title={`${percentage}% so với mục tiêu`}>
              <div
                className="w-1 h-6 ml-2 rounded-sm"
                style={{ backgroundColor: color }}
              ></div>
            </Tooltip>
          </div>
        );
      },
      width: 100,
      className: "column-width-100",
    },
    {
      title: <span className="font-bold text-xl">Reset</span>,
      key: "reset",
      fixed: "right",
      align: "center",
      render: (_, record: ProductionLine) => (
        <Popconfirm
          title="Reset dữ liệu"
          description="Bạn có chắc chắn muốn reset tất cả dữ liệu của line này?"
          onConfirm={() => handleResetLine(record.id)}
          okText="Có"
          cancelText="Không"
          placement="left"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="primary"
            danger
            icon={<ReloadOutlined />}
            size="middle"
            className="flex items-center justify-center"
          >
            Reset
          </Button>
        </Popconfirm>
      ),
      width: 100,
      className: "column-width-100",
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#1890ff",
          colorBgContainer: "#111827",
          colorBgElevated: "#1f2937",
          colorText: "#ffffff",
          // Làm đậm màu của border
          colorBorder: "#4B5563", // Thay đổi từ #374151 sang #4B5563 (đậm hơn)
          borderRadius: 6,
        },
        components: {
          Table: {
            headerBg: "#1f2937",
            headerColor: "#9ca3af",
            headerSortHoverBg: "#374151",
            rowHoverBg: "rgba(55, 65, 81, 0.5)",
            colorBgContainer: "#111827",
            // Tăng độ dày của border
            lineWidth: 2, // Thay đổi từ mặc định (thường là 1px) thành 2px
            // Làm đậm màu sắc của border
            borderColor: "#4B5563", // Thay đổi sang màu border đậm hơn
            headerBorderRadius: 0,
            // Thêm style cho border cell
            cellPaddingBlock: 12, // Tăng padding để các ô rộng hơn
            cellBorderColor: "#4B5563", // Màu đường viền cell đậm hơn
            fontSize: 18,
          },
        },
      }}
    >
      <div
        className={`w-full h-screen flex flex-col p-3 gap-2 bg-gradient-to-b from-gray-900 to-gray-800
                  ${
                    !isConnected && counter % 2 === 0
                      ? `bg-gradient-to-b from-[#991b1b] to-[#7f1d1d]`
                      : ``
                  }
                  `}
      >
        <div
          className={`text-center py-3 ${
            !isConnected
              ? "text-white"
              : "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300"
          }`}
        >
          <div className="text-3xl font-bold tracking-wider mb-1">
            {!isConnected ? `MẤT KẾT NỐI ĐẾN SERVER` : `BẢNG CÀI ĐẶT SẢN XUẤT`}
          </div>
        </div>

        <style jsx global>{`
          /* CSS để đảm bảo độ rộng cột được giữ nguyên */
          .column-width-40 {
            width: 40px !important;
            min-width: 40px !important;
            max-width: 40px !important;
          }
          .column-width-70 {
            width: 70px !important;
            min-width: 70px !important;
            max-width: 70px !important;
          }
          .column-width-80 {
            width: 80px !important;
            min-width: 80px !important;
            max-width: 80px !important;
          }
          .column-width-100 {
            width: 100px !important;
            min-width: 100px !important;
            max-width: 100px !important;
          }
          .column-width-120 {
            width: 120px !important;
            min-width: 120px !important;
            max-width: 120px !important;
          }
          .column-width-140 {
            width: 140px !important;
            min-width: 140px !important;
            max-width: 140px !important;
          }
          /* Đảm bảo table không bị co lại */
          .ant-table table {
            table-layout: fixed !important;
            width: auto !important;
          }
          /* Ngăn không cho các cột thay đổi kích thước khi resize window */
          .ant-table-thead > tr > th,
          .ant-table-tbody > tr > td {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        `}</style>

        <div className="flex-1 overflow-auto rounded-lg shadow-xl">
          <Table
            dataSource={productionData}
            columns={columns}
            bordered
            size="middle"
            pagination={false}
            rowKey="id"
            className={!isConnected ? "opacity-80" : ""}
            rowClassName={(record, index) =>
              `${index % 2 === 0 ? "bg-gray-800 bg-opacity-30" : ""} 
               transition-all duration-300`
            }
            sticky
            scroll={{ x: "max-content" }}
            // Thiết lập table-layout: fixed để đảm bảo độ rộng cột không thay đổi
            tableLayout="fixed"
            style={{
              border: "2px solid #4B5563", // Border ngoài cùng đậm hơn
              borderCollapse: "collapse",
              width: "auto", // Đảm bảo bảng không bị co lại
            }}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}
