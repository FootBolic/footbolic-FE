import { List, Avatar } from "antd";
import { SimpleTableProps } from "../../types/components/table/SimpleTableProps";

function SimpleTable({ dataSource, size }: SimpleTableProps) {
    return (
        <List
            size={size || "default"}
            dataSource={dataSource}
            renderItem={(post: any) => {
                const year = post.createdAt.getFullYear();
                const month = post.createdAt.getMonth()+1;
                const day = post.createdAt.getDate();
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
                            title={post.title}
                            description={`${year}-${month}-${day}`}
                        />
                    </List.Item>
                )
            }}
        />
    )
}

export default SimpleTable;