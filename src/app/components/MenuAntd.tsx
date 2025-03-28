import React, { useState } from "react";
import {
    HomeOutlined,
    MailOutlined,
    OrderedListOutlined,
    SettingOutlined,
    FileSearchOutlined,
    SolutionOutlined,
    HddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useRouter } from "next/navigation";
import { CONST_KIT_NAME } from "../(projects)/vf_do_chieu_cao/database";

type LevelKeysProps = {
    key?: string;
    children?: LevelKeysProps[];
};

export default function MyMenu() {
    const [stateOpenKeys, setStateOpenKeys] = useState(["thong_tin_chung", "thong_tin_chung"]);
    type MenuItem = Required<MenuProps>["items"][number];
    const router = useRouter();
    const getLevelKeys = (items1: LevelKeysProps[]) => {
        const key: Record<string, number> = {};
        const func = (items2: LevelKeysProps[], level = 1) => {
            items2.forEach((item) => {
                if (item.key) {
                    key[item.key] = level;
                }
                if (item.children) {
                    func(item.children, level + 1);
                }
            });
        };
        func(items1);
        return key;
    };
    const items: MenuItem[] = [
        {
            key: "thong_tin_chung",
            style: {
                // color: "#fff",
                // background: "#3c6eda",
                // width: "100%",
            },
            icon: <HomeOutlined style={{ fontSize: 24 }} />,
            label: <div className="text-lg">{"Thông tin chung"}</div>,
            onClick: () => {
                console.log("Click to Thông tin chung");
                router.push("/ptl_v3/thong_tin_chung");
            },
        },
        { type: "divider", style: { height: 2, background: "#cccccc88", marginLeft: 24, marginRight: 24 } },
        {
            key: "1",
            style: {
                // color: "#fff",
                // background: "#3c6eda",
                // width: "100%",
                // marginLeft: 4,
            },
            icon: <OrderedListOutlined style={{ fontSize: 24 }} />,
            label: <div className="text-lg font-bold">{`Thông tin kit`}</div>,
            children: [
                {
                    key: "kit_info_01",
                    style: {
                        // color: "#fff",
                        // background: "#3c6eda",
                        // width: "100%",
                        // marginLeft: 0,
                    },
                    label: "KIT 1",
                    onClick: () => {
                        console.log("Click to INFO KIT 1");
                        router.push("/ptl_v3/kit_info/1");
                    },
                },
                {
                    key: "kit_info_02",
                    label: "KIT 2",
                    onClick: () => {
                        console.log("Click to INFO KIT 2");
                        router.push("/ptl_v3/kit_info/2");
                    },
                },
                {
                    key: "kit_info_03",
                    label: "KIT 3",
                    onClick: () => {
                        console.log("Click to INFO KIT 3");
                        router.push("/ptl_v3/kit_info/3");
                    },
                },
                {
                    key: "kit_info_05",
                    label: "KIT 5",
                    onClick: () => {
                        console.log("Click to INFO KIT 5");
                        router.push("/ptl_v3/kit_info/5");
                    },
                },
                {
                    key: "kit_info_06",
                    label: "KIT 6",
                    onClick: () => {
                        console.log("Click to INFO KIT 6");
                        router.push("/ptl_v3/kit_info/6");
                    },
                },
                {
                    key: "kit_info_v363_1",
                    label: "V363 KIT 1",
                    onClick: () => {
                        console.log(`Click to INFO KIT ${CONST_KIT_NAME.V363_K1}`);
                        router.push(`/ptl_v3/kit_info/${CONST_KIT_NAME.V363_K1}`);
                    },
                },
                {
                    key: "kit_info_v363_2",
                    label: "V363 KIT 2",
                    onClick: () => {
                        console.log(`Click to INFO KIT ${CONST_KIT_NAME.V363_K2}`);
                        router.push(`/ptl_v3/kit_info/${CONST_KIT_NAME.V363_K2}`);
                    },
                },
                {
                    key: "kit_info_v363_3",
                    label: "V363 KIT 3",
                    onClick: () => {
                        console.log(`Click to INFO KIT ${CONST_KIT_NAME.V363_K3}`);
                        router.push(`/ptl_v3/kit_info/${CONST_KIT_NAME.V363_K3}`);
                    },
                },
                {
                    key: "kit_info_v363_4",
                    label: "V363 KIT 4",
                    onClick: () => {
                        console.log(`Click to INFO KIT ${CONST_KIT_NAME.V363_K4}`);
                        router.push(`/ptl_v3/kit_info/${CONST_KIT_NAME.V363_K4}`);
                    },
                },
                {
                    key: "kit_info_v743_1",
                    label: "CX743 KIT 1",
                    onClick: () => {
                        console.log(`Click to INFO KIT ${CONST_KIT_NAME.CX743_K1}`);
                        router.push(`/ptl_v3/kit_info/${CONST_KIT_NAME.CX743_K1}`);
                    },
                },
                {
                    key: "kit_info_v743_2",
                    label: "CX743 KIT 2",
                    onClick: () => {
                        console.log(`Click to INFO KIT ${CONST_KIT_NAME.CX743_K2}`);
                        router.push(`/ptl_v3/kit_info/${CONST_KIT_NAME.CX743_K2}`);
                    },
                },
                {
                    key: "kit_info_v743_3",
                    label: "CX743 KIT 3",
                    onClick: () => {
                        console.log(`Click to INFO KIT ${CONST_KIT_NAME.CX743_K3}`);
                        router.push(`/ptl_v3/kit_info/${CONST_KIT_NAME.CX743_K3}`);
                    },
                },
                {
                    key: "kit_info_v743_4",
                    label: "CX743 KIT 4",
                    onClick: () => {
                        console.log(`Click to INFO KIT ${CONST_KIT_NAME.CX743_K4}`);
                        router.push(`/ptl_v3/kit_info/${CONST_KIT_NAME.CX743_K4}`);
                    },
                },
            ],
        },
        { type: "divider", style: { height: 2, background: "#cccccc88", marginLeft: 24, marginRight: 24 } },
        {
            key: "cau_hinh",
            // type: "group", //group => hiển thị group
            style: {
                // color: "#fff",
                // background: "#3c6eda",
                // width: "100%",
                // marginLeft: 4,
            },
            icon: <SettingOutlined style={{ fontSize: 24 }} />,
            label: <div className="text-lg font-bold">{`Cấu hình`}</div>,
            children: [
                {
                    key: "kit_config_1_2",
                    label: "Kit 1 + 2",
                    onClick: () => {
                        console.log(`Click to CONFIG KIT 1+2`);
                        router.push(`/ptl_v3/kit_config/kit_1_2`);
                    },
                },
                { key: "kit_config_3_5_6_xxx", label: "Kit 356 + V363 + V743" },
            ],
        },
        { type: "divider", style: { height: 2, background: "#cccccc88", marginLeft: 24, marginRight: 24 } },
        {
            key: "ke_hoach",
            style: {
                // color: "#fff",
                // background: "#3c6eda",
                // width: "100%",
            },
            icon: <SolutionOutlined style={{ fontSize: 24 }} />,
            label: <div className="text-lg font-bold">{`Kế hoạch`}</div>,
            onClick: () => {
                console.log(`Click to tab Kế hoạch`);
                router.push(`/ptl_v3/ke_hoach`);
            },
        },
        { type: "divider", style: { height: 2, background: "#cccccc88", marginLeft: 24, marginRight: 24 } },
        {
            key: "kanban",
            style: {
                // color: "#fff",
                // background: "#3c6eda",
                // width: "100%",
            },
            icon: <HddOutlined style={{ fontSize: 24 }} />,
            label: <div className="text-lg font-bold">{`Danh sách Model`}</div>,
            onClick: () => {
                console.log(`Click to tab danh sách model`);
                router.push(`/ptl_v3/ds_model`);
            },
        },
        { type: "divider", style: { height: 2, background: "#cccccc88", marginLeft: 24, marginRight: 24 } },
        {
            key: "lich_su",
            style: {
                // color: "#fff",
                // background: "#3c6eda",
                // width: "100%",
            },
            icon: <FileSearchOutlined style={{ fontSize: 24 }} />,
            label: <div className="text-lg font-bold">{`Lịch sử`}</div>,
            onClick: () => {
                console.log(`Click to tab Lịch sử`);
                router.push(`/ptl_v3/lich_su`);
            },
        },
        { type: "divider", style: { height: 2, background: "#cccccc88", marginLeft: 24, marginRight: 24 } },
        {
            key: "lien_he",
            // danger: true,
            style: {
                // color: "#fff",
                // background: "#3c6eda",
                // width: "100%",
            },
            icon: <MailOutlined style={{ fontSize: 24 }} />,
            label: <div className="text-lg font-bold">{`Liên hệ`}</div>,
            onClick: () => {
                console.log(`Click to tab Liên hệ`);
                router.push(`/ptl_v3/lien_he`);
            },
        },
        { type: "divider", style: { height: 2, background: "#cccccc88", marginLeft: 24, marginRight: 24 } },
    ];
    const levelKeys = getLevelKeys(items as LevelKeysProps[]);

    const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };

    return (
        <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={["kit_info_01"]}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            style={{
                opacity: 1,
            }}
            items={items}
            className="w-full "
        />
    );
}
