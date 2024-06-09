import { useParams } from "react-router-dom";
import Title from "../../components/title/Title";
import { Table, message } from "antd";
import { useQuery } from "react-query";
import { PostAPI } from "../../api/post/PostAPI";
import { useEffect, useState } from "react";
import { PostInterface, PostSearchInterface } from "../../types/entity/post/PostInterface";
import { API_QUERY_KEYS, BOARD_PAGE_SIZE } from "../../constants/common/DataConstants";
import { addKey } from "../../util/DataUtil";


function Board() {
    const { boardId } = useParams();

    const [posts, setPosts] = useState<PostInterface[]>([]);
    const [search, setSearch] = useState<PostSearchInterface>();
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(0);

    const { isFetching, isError, refetch } = useQuery({
        queryFn: () => PostAPI.getPosts(boardId, page, BOARD_PAGE_SIZE, search),
        queryKey: [`${API_QUERY_KEYS.POST.GET_POSTS}_${boardId}`],
        enabled: false,
        onSuccess: (result) => {
            setSize(result.size);
            setPosts(result.posts);
        },
        onError: (e: string) => message.error(e)
    })

    useEffect(() => {
        boardId && refetch();
    }, [boardId])

    return (
        <>
            <Title title="게시판" />
            <Table 
                columns={[
                    {
                        title: '제목',
                        dataIndex: 'title',
                        key: 'title',
                        render: (t) => t
                    }
                ]}
                dataSource={addKey(posts)}
            />
        </>
    )
}

export default Board;