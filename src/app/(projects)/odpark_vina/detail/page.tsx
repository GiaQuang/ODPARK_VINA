"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInterval, useSessionStorage, useWindowSize } from "usehooks-ts";
import { clone_object, random_float, random_int } from "@/app/utils/utils";
import { toast } from "react-toastify";
import { api_get_cpu_info, api_get_tong_quan_dien, api_get_tong_quan_nuoc } from "../api";
import { TYPE_CPU, TYPE_BANG} from "../database";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

function WidgetBang({ data }: { data: TYPE_BANG[] }) {
  // Khai báo biến màu sắc để sử dụng thống nhất
  const borderColor = "border-gray-500";
  const bgColor = "bg-[#1b2533]";
  const textPrimary = "text-[#e7e9e7]";
  const textSecondary = "text-[#b9c7b9]";
  const textHighlight = "text-[#E03232]";  // màu cũ f75c5c
  const fontLED = "font-LED7";

  return (
    <div className={`flex-1 flex-col h-screen w-full overflow-y-auto rounded-lg shadow-lg`}>
      <div className="flex-1 grid grid-cols-4 grid-rows-6 gap-2">
        {data.map((item, idx) => (
          <div key={idx}
            className={`flex flex-col w-full h-full items-center justify-center text-xl rounded-lg text-center border-2 ${borderColor} shadow-lg p-[2px]`}
          >
            <div className={`flex flex-col w-full h-full items-center p-2 ${bgColor}`}>
              {/* Header */}
              <div className="flex justify-between w-full px-4">
                <span className={`flex items-center ${textPrimary} font-bold`}>
                  Line <span className={`${textHighlight} text-3xl ${fontLED} ml-2`}> {String(item.line).padStart(2, "0")}</span>
                </span>
                <span className={`flex items-center ${textPrimary} font-bold`}>
                  Efficiency <span className={`${textHighlight} text-3xl ${fontLED} ml-2 mr-2`}>80</span>
                  <span className={`${textSecondary} text-3xl font-bold`}>%</span>
                </span>
              </div>

              {/* Style Name */}
              <div className="flex justify-between w-full items-center">
                <span className={`flex-1 ${textPrimary} text-left font-bold mb-4 ml-4`}>
                  Style name <span className={`${textHighlight} text-3xl ml-6`}>{item.name}</span>
                </span>
              </div>

              {/* Table Layout */}
              <div className={`w-full border-2 ${borderColor}`}>
                <div className="grid grid-cols-7 items-center text-center">
                  {/* Row 1 */}
                  <span className={`flex-1 ${textPrimary} text-left text-sm ml-2 mt-2 mb-2`}>Total</span>
                  <span className={`${textHighlight} text-3xl ${fontLED} ml-4`}>{String(item.total).padStart(4, "0")}</span>
                  <span className={`flex-1 ${textPrimary} text-sm`}>Pcs</span>
                  <div className={`border-r ${borderColor} h-full mr-6`}></div>
                  <span className={`flex-1 ${textPrimary} text-left text-sm mt-2 mb-2`}>Product Qty</span>
                  <span className={`${textHighlight} text-3xl ${fontLED} ml-4 mt-2 mb-2`}>{String(item.produced_qty).padStart(4, "0")}</span>
                  <span className={`flex-1 ${textPrimary} text-sm`}>Pcs</span>
                  <div className={`col-span-7 w-full border-t ${borderColor}`}></div>

                  {/* Row 2 */}
                  <span className={`flex-1 ${textPrimary} text-left text-sm ml-2 mt-2 mb-2`}>Target</span>
                  <span className={`${textHighlight} text-3xl ${fontLED} ml-4 mt-2 mb-2`}>{String(item.today_target).padStart(4, "0")}</span>
                  <span className={`flex-1 ${textPrimary} text-sm`}>Pcs</span>
                  <div className={`border-r ${borderColor} h-full mr-6`}></div>
                  <span className={`flex-1 ${textPrimary} text-left text-sm mt-2 mb-2`}>Actual</span>
                  <span className={`${textHighlight} text-3xl ${fontLED} ml-4 mt-2 mb-2`}>{String(item.today_actual).padStart(4, "0")}</span>
                  <span className={`flex-1 ${textPrimary} text-sm`}>Pcs</span>
                  <div className={`col-span-7 w-full border-t ${borderColor}`}></div>

                  {/* Row 3 */}
                  <span className={`flex-1 ${textPrimary} text-left text-sm ml-2 mt-2 mb-2`}>Balance</span>
                  <span className={`${textHighlight} text-3xl ${fontLED} ml-4 mt-2 mb-2`}>{String(item.balance).padStart(4, "0")}</span>
                  <span className={`flex-1 ${textPrimary} text-sm`}>Pcs</span>
                  <div className={`border-r ${borderColor} h-full mr-6`}></div>
                  <span className={`flex-1 ${textPrimary} text-left text-sm mt-2 mb-2`}>QC</span>
                  <span className={`${textHighlight} text-3xl ${fontLED} ml-4 mt-2 mb-2`}>{String(item.qc_passed).padStart(4, "0")}</span>
                  <span className={`flex-1 ${textPrimary} text-sm`}>Pcs</span>
                </div>
              </div>

              {/* Footer */}
              <div className={`${textPrimary} text-2xl font-bold mt-2`}>
                Product total <span className={`${textHighlight} ${fontLED} text-3xl`}>{String(item.total_product).padStart(4, "0")}</span> Day
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
//   // useInterval(async () => {
//   //     setCycleRfStatus(null);
//   //     // Sử dụng await với Promise.allSettled để đợi tất cả các promise hoàn thành
//   //     const results = await Promise.allSettled([api_get_tong_quan_dien(), api_get_tong_quan_nuoc(), api_get_cpu_info()]);
//   //     // Kiểm tra kết quả của từng promise
//   //     const [result1, result2, result3] = results;
//   //     if (result1.status === 'fulfilled' && result2.status === 'fulfilled' && result3.status === 'fulfilled') {
//   //         // Nếu tất cả API đều thành công
//   //         let data = { dien: result1.value, nuoc: result2.value, cpu_info: result3.value };
//   //         if (data.dien != undefined && data.nuoc != undefined && data.cpu_info != undefined) {
//   //             setCpuInfo(data.cpu_info)
//   //             while (data.dien.length < 9) {
//   //                 data.dien.push({
//   //                     id: -1
//   //                 })
//   //             }
//   //             while (data.nuoc.length < 9) {
//   //                 data.nuoc.push({
//   //                     id: -1
//   //                 })
//   //             }
//   //             setListDien(data.dien)
//   //             setCycleRfStatus(100);
//   //         }
//   //         else
//   //             setCycleRfStatus(3000);
//   //     } else {
//   //         // Xử lý lỗi nếu có từ một trong các API
//   //         let error = { status1: result1.status, status2: result2.status };
//   //         setCycleRfStatus(3000);
//   //     }
//   // }, cycle_rt_status);
//   return (
//       <div
//           className={`text-white text-3xl font-bold w-full h-screen flex flex-col p-2 gap-1 pt-4 overflow-hidden`}
//       >
//           <div className={`flex-1 gap-1 h-screen w-full
//                   ${cpu_info.connection == false ? `opacity-20` : ``}
//               `}>
//             <h1 className="text-2xl font-bold text-center">
//               THÔNG TIN BẢNG SẢN LƯỢNG
//             </h1>
//               <WidgetBang data={list_bang} />
//           </div>
//       </div>
//   );
// }
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
  }));
};
export default function Page() {
  // const [listBang, setListBang] = useState<TYPE_BANG[]>(
  //   Array.from(Array(22).keys(), (key) => ({
  //     id: key + 1,
  //     name: `Bảng ${key + 1}`,
  //     line: key + 1,
  //     total: Math.floor(Math.random() * 5000),
  //     device_active: Math.floor(Math.random() * 5000),
  //     total_product: Math.floor(Math.random() * 5000),      
  //     produced_qty: Math.floor(Math.random() * 5000),
  //     today_target: Math.floor(Math.random() * 5000),
  //     today_actual: Math.floor(Math.random() * 5000),
  //     balance: Math.floor(Math.random() * 5000),
  //     qc_passed: Math.floor(Math.random() * 5000),
  //   }))
  // );
  const [listBang, setListBang] = useState<TYPE_BANG[]>(generateRandomData());
  useEffect(() => {
    const interval = setInterval(() => {
      setListBang(generateRandomData());
    }, 1000); // Cập nhật mỗi 1 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState(1); // 1: next, -1: prev
  
  const startIndex = page === 1 ? 0 : 12;
  const endIndex = page === 1 ? 12 : 22; // 22 vì slice() không bao gồm phần tử cuối
  
  const handleNext = () => {
    setDirection(1);
    setPage(2);
  };
  
  const handlePrev = () => {
    setDirection(-1);
    setPage(1);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    
    <div className="text-white text-3xl font-bold w-full h-full flex-1 flex-col p-2 gap-4">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center mb-4">THÔNG TIN BẢNG SẢN LƯỢNG</h1>

      {/* Chuyển trang mượt mà với Framer Motion */}
      <div className="flex-1 flex overflow-hidden mb-2">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="w-full"
        >
         <WidgetBang data={listBang.slice(startIndex, endIndex)} />
        </motion.div>
      </div>
     {/* Chuyển trang */}
      <footer className="absolute bottom-1 right-1
                     hover:-translate-y-1 hover:cursor-pointer active:translate-y-0 duration-150 ml-4">
        <LeftCircleOutlined
          onClick={page === 1 ? undefined : handlePrev}
          style={{
            fontSize: `30px`,
            cursor: page === 1 ? "default" : "pointer",
            color: page === 1 ? "gray" : "white",
          }}
        />
        <RightCircleOutlined
          onClick={page === 2 ? undefined : handleNext}
          style={{
            fontSize: `30px`,
            cursor: page === 2 ? "default" : "pointer",
            color: page === 2 ? "gray" : "white",
          }}
        />
      </footer>
    </div>
  );
}