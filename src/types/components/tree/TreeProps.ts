import { TreeDataNode } from "antd"
import { Key } from "antd/es/table/interface";
import { DataNode, EventDataNode } from "antd/es/tree";

export type TreeProps = {
    data: TreeDataNode[];
    showLine?: boolean;
    defaultExpandAll?: boolean;
    selectedKeys?: React.Key[];
    onSelect?: (selectedKeys: Key[], info: {
        event: "select";
        selected: boolean;
        node: EventDataNode<DataNode>;
        selectedNodes: DataNode[];
        nativeEvent: MouseEvent; 
    }) => void;
}