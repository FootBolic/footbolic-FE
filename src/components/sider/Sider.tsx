import { useState } from "react";
import { Layout } from "antd";
import Menu from "./menu/Menu";

const { Sider: AntSider } = Layout;

const Sider = () => {
    const [collapsed, setCollapsed] = useState(false);
    
    return (
        <AntSider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <Menu />
        </AntSider>
    )
}

export default Sider;