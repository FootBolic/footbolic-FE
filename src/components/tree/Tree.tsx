import { Tree as AntTree } from "antd";
import { TreeProps } from "../../types/components/tree/TreeProps";
import { DownOutlined } from "@ant-design/icons";

function Tree({ data, showLine, onSelect }: TreeProps) {
    return (
        <AntTree 
            treeData={data}
            switcherIcon={<DownOutlined />}
            showLine={showLine || true}
            onSelect={onSelect}
        />
    )
}

export default Tree;