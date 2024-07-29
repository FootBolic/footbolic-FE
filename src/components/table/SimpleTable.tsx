import { List, Avatar } from "antd";
import { SimpleTableProps } from "../../types/components/table/SimpleTableProps";
import { toDatetimeString } from "../../util/DateUtil";
import { Link } from "react-router-dom";
import useURLParam from "../../hooks/useURLParam";

function SimpleTable({ dataSource, size, isMain }: SimpleTableProps) {
    const { menuId } = useURLParam();
    return (
        <List
            size={size || "default"}
            dataSource={dataSource}
            renderItem={(post: any) => {
                return (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar 
                                    shape="square"
                                    size="large"
                                    icon={
                                        <img src="https://velog.velcdn.com/images/yhko1992/post/01218901-b7bf-4949-92c0-dffa415e20de/image.jpeg" />
                                    }
                                />
                            }
                            title={<Link to={`/post/${post.id}?menuId=${isMain ? post.menu.id : menuId}`}>{post.title}</Link>}
                            description={`${post.createdBy.nickname} | ${toDatetimeString(post.createdAt)}`}
                        />
                    </List.Item>
                )
            }}
        />
    )
}

export default SimpleTable;