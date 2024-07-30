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
                                post.thumbnailFileId ? (
                                    <Avatar 
                                        style={{ marginLeft: '10px' }}
                                        shape="square"
                                        size="large"
                                        icon={
                                            <img 
                                                src={`${import.meta.env.VITE_API_URL_DEV}/files/public/images/${post.thumbnailFileId}`} 
                                            />
                                        }
                                    />
                                ) : <></>
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