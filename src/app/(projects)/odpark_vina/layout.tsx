// "use client";
// import PageTransitionEffect from "@/app/PageTransitionEffect";
// import NoSsr from "@/app/components/NoSsr";
// import MyMenu from "./MainMenu";
// import { useState } from "react";
// import { motion as m } from "framer-motion";
// import { useSessionStorage } from "usehooks-ts";
// export default function Layout({ children }: { children: React.ReactNode }) {
//   const [is_show, setIsShow, remove_is_show] = useSessionStorage(
//     "key_show_menu",
//     true
//   );
//   console.log(is_show);
//   return (
//     <div
//       className={`
//                 min-h-screen
//                 w-screen
//                 overflow-auto scrollbar-default
//                 text-white  font-bold select-none
//                 bg-gradient-to-b from-[#323140] via-[#070522] to-[#383749]`}
//     >
//       <div className="flex flex-row w-full">
//         <m.div
//           initial={{
//             width: is_show ? `40px` : `150px`,
//             minWidth: is_show ? `40px` : `150px`,
//             maxWidth: is_show ? `40px` : `150px`,
//           }}
//           animate={{
//             width: is_show ? `150px` : `40px`,
//             minWidth: is_show ? `150px` : `40px`,
//             maxWidth: is_show ? `150px` : `40px`,
//           }}
//           exit={{}}
//           transition={{ type: "spring", duration: 0.3 }}
//         >
//           <MyMenu set_is_show={setIsShow} />
//         </m.div>
//         <div
//           className={`flex-1 ${
//             is_show
//               ? `min-w-[calc(100dvw-150px)] max-w-[calc(100dvw-150px)]`
//               : `min-w-[calc(100dvw-40px)] max-w-[calc(100dvw-40px)]`
//           }`}
//         >
//           {/* <div>{children}</div> */}
//           <PageTransitionEffect>{children}</PageTransitionEffect>
//           {/* Footer */}
//           {/* <footer className="py-2 border-t-2 border-[#383749] flex justify-between px-4 text-gray-400 text-sm">
//             <div>data left</div>
//             <div>data right</div>
//           </footer> */}
//         </div>
//       </div>

//       <NoSsr>
//         <div></div>
//       </NoSsr>
//     </div>
//   );
// }

"use client";

import PageTransitionEffect from "@/app/PageTransitionEffect";
import NoSsr from "@/app/components/NoSsr";
import MyMenu from "./MainMenu";
import { useState } from "react";
import { motion as m } from "framer-motion";
import { useSessionStorage } from "usehooks-ts";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [is_show, setIsShow, remove_is_show] = useSessionStorage(
    "key_show_menu",
    true
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#323140] via-[#070522] to-[#383749] text-white font-bold select-none">
      <div className="flex h-full">
        <m.div
          initial={{
            width: is_show ? `40px` : `150px`,
            minWidth: is_show ? `40px` : `150px`,
            maxWidth: is_show ? `40px` : `150px`,
          }}
          animate={{
            width: is_show ? `150px` : `40px`,
            minWidth: is_show ? `150px` : `40px`,
            maxWidth: is_show ? `150px` : `40px`,
          }}
          transition={{ type: "spring", duration: 0.3 }}
          // className="h-full"
        >
          <MyMenu set_is_show={setIsShow} />
        </m.div>

        <div
          className={`flex flex-col h-full ${
            is_show ? `w-[calc(100vw-150px)]` : `w-[calc(100vw-40px)]`
          }`}
        >
          <div className="flex-1 overflow-auto">
            <PageTransitionEffect>{children}</PageTransitionEffect>
          </div>

          <footer className="flex h-8 shrink-0 border-t-4 border-[#383749] justify-between px-4 text-gray-400 text-sm items-center">
            <div>data left</div>
            <div>data center</div>
            <div>data right</div>
          </footer>
        </div>
      </div>

      <NoSsr>
        <div></div>
      </NoSsr>
    </div>
  );
}
