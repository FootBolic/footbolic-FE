import Banner from "../../components/banner/Banner";
import styles from "../../styles/routes/main/MainView.module.scss"
import { Card, Divider, List, Tabs } from 'antd';
import SimpleTable from "../../components/table/SimpleTable";
import { MAIN_TABLE_ROWS, RESPONSIVE_GRID } from "../../constants/common/ViewConstants";
import { useQuery } from "react-query";
import { API_QUERY_KEYS } from "../../constants/common/DataConstants";
import { PostAPI } from "../../api/post/PostAPI";
import { useEffect, useState } from "react";
import { PostInterface } from "../../types/entity/post/PostInterface";
import { BoardInterface } from "../../types/entity/board/BoardInterface";
import { BoardAPI } from "../../api/board/BoardAPI";
import useIcon from "../../hooks/useIcon";

const boards = [
    '인기 게시글',
    '최신 게시글'
]

function MainView () {
    const { getIcon } = useIcon();
    const [boardId, setBoardId] = useState<string>("");
    const [mainBoards, setMainBoards] = useState<BoardInterface[]>([]);
    const [hotPosts, setHotPosts] = useState<PostInterface[]>([]);
    const [newPosts, setNewPosts] = useState<PostInterface[]>([]);
    const [newPostsByBoard, setNewPostsByBoard] = useState<PostInterface[]>([]);

    const { refetch: refetchMainBoards } = useQuery({
        queryKey: [API_QUERY_KEYS.BOARD.GET_MAIN_BOARDS],
        queryFn: () => BoardAPI.getMainBoards(),
        enabled: false,
        onSuccess: ({ boards }) => {
            setMainBoards(boards);
            setBoardId(boards[0].id);
        }
    })

    const { refetch: refetchHotPosts } = useQuery({
        queryKey: [API_QUERY_KEYS.POST.GET_HOT_POSTS],
        queryFn: () => PostAPI.getHotPosts(MAIN_TABLE_ROWS),
        enabled: false,
        onSuccess: ({ posts }) => setHotPosts(posts)
    })

    const { refetch: refetchNewPosts } = useQuery({
        queryKey: [API_QUERY_KEYS.POST.GET_NEW_POSTS],
        queryFn: () => PostAPI.getNewPosts(MAIN_TABLE_ROWS),
        enabled: false,
        onSuccess: ({ posts }) => setNewPosts(posts)
    })

    const { refetch: refetchNewPostsByBoard } = useQuery({
        queryKey: [API_QUERY_KEYS.POST.GET_NEW_POSTS_BY_BOARD],
        queryFn: () => PostAPI.getNewPostsByBoard(boardId, MAIN_TABLE_ROWS),
        enabled: false,
        onSuccess: ({ posts }) => setNewPostsByBoard(posts)
    })

    useEffect(() => {
        refetchMainBoards();
        refetchHotPosts();
        refetchNewPosts();
    }, [])

    useEffect(() => {
        boardId && refetchNewPostsByBoard();
    }, [boardId])

    return (
        <>
            <div className={styles.main_el}>
                <Banner />
            </div>
            <Divider />
            <div className={styles.main_el}>
                <Tabs
                    centered
                    defaultActiveKey={boardId}
                    onTabClick={(key) => setBoardId(key)}
                    items={mainBoards.map((board) => {
                        const icon = board.menu?.icon;
                        return {
                            key: board.id,
                            label:board.title,
                            icon: getIcon(icon?.code || "", icon?.type || "", true),
                            children: (
                                <Card>
                                    <SimpleTable isMain dataSource={newPostsByBoard} />
                                </Card>
                            )
                        }
                    })}
                />
            </div>
            <Divider />
            <div className={styles.main_el}>
                <List
                    grid={RESPONSIVE_GRID}
                    dataSource={[hotPosts, newPosts]}
                    renderItem={(item, index) => (
                        <List.Item>
                            <Card title={boards[index]} bodyStyle={{ padding: '0' }}>
                                <SimpleTable isMain dataSource={item} size="small" />
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        </>
    )
}

export default MainView;