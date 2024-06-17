import { Link, useNavigate, useParams } from "react-router-dom";
import Title from "../../components/title/Title";
import { message, Skeleton } from "antd";
import { useQuery } from "react-query";
import { PostAPI } from "../../api/post/PostAPI";
import { useEffect, useState } from "react";
import { PostInterface, PostSearchInterface } from "../../types/entity/post/PostInterface";
import { API_QUERY_KEYS, BOARD_PAGE_SIZE } from "../../constants/common/DataConstants";
import { addKey } from "../../util/DataUtil";
import { toDatetimeString } from "../../util/DateUtil";
import Table from "../../components/table/Table";
import Error from "../../components/error/Error";
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";
import SimpleTable from "../../components/table/SimpleTable";
import SearchBar from "../../components/search/SearchBar";
import useURLParam from "../../hooks/useURLParam";

function Board() {
    const navigate = useNavigate();
    const { boardId } = useParams();
    const { menuId, page: paramPage, searchTitle, searchCreatedAt, searchCreatedBy  } = useURLParam();
    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);

    const [posts, setPosts] = useState<PostInterface[]>([]);
    const [search, setSearch] = useState<PostSearchInterface>({
        title: searchTitle,
        createdAt: searchCreatedAt,
        createdBy: searchCreatedBy
    });
    const [page, setPage] = useState<number>(paramPage ? Number(paramPage) : 1);
    const [size, setSize] = useState<number>(0);

    const { isFetching, isError, refetch } = useQuery({
        queryFn: () => PostAPI.getPosts(boardId, page - 1, BOARD_PAGE_SIZE, search),
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

    useEffect(() => {
        refetch();
    }, [page, search])

    const getParameters = () => {
        return `?menuId=${menuId}&page=${page}`
            + (search?.title ? `&searchTitle=${search?.title}` : '')
            + (search?.createdAt ? `&searchCreatedAt=${search?.createdAt}` : '')
            + (search?.createdBy ? `&searchCreatedBy=${search?.createdBy}` : '');
    }

    return (
        <>
            <Title 
                title="게시판" 
                buttons={[
                    {
                        text: '작성',
                        onClick: () => {
                            navigate(`/${boardId}/post/write${getParameters()}`)
                        }
                    }
                ]}
            />
            {isFetching ? <Skeleton active /> : <>
                {
                    isError ? <Error /> : <>
                        <SearchBar 
                            defaultValues={search}
                            elements={[
                                { 
                                    label: '제목',
                                    name: 'title',
                                    type: 'input',
                                    maxLength: 20,
                                    placeholder: '제목을 입력해주세요.'
                                },
                                { 
                                    label: '작성자',
                                    name: 'createdBy',
                                    type: 'input',
                                    maxLength: 20,
                                    placeholder: '작성자를 입력해주세요.' 
                                },
                                { 
                                    label: '작성일자',
                                    name: 'createdAt',
                                    type: 'date',
                                    placeholder: '작성일자를 선택해주세요.'
                                }
                            ]}
                            onSearch={(result) => setSearch(result)}
                            onReset={() => setSearch({})}
                        />
                        {
                            isMobile ? (
                                <SimpleTable
                                    dataSource={addKey(posts)}
                                />
                            ) : (
                                <Table 
                                    columns={[
                                        {
                                            title: '제목',
                                            dataIndex: 'title',
                                            key: 'title',
                                            width: 'auto',
                                            ellipsis: true,
                                            render: (t, r: PostInterface) => 
                                                <Link 
                                                    to={`/post/${r.id}${getParameters()}`}
                                                >
                                                    {t}
                                                </Link>
                                        },
                                        {
                                            title: '작성자',
                                            dataIndex: 'createdBy',
                                            key: 'createdBy',
                                            align: 'center',
                                            width: '20%',
                                            ellipsis: true,
                                            render: (_, r: PostInterface) => r.createdBy!.nickname
                                        },
                                        {
                                            title: '작성일자',
                                            dataIndex: 'createdAt',
                                            key: 'createdAt',
                                            align: 'center',
                                            width: '20%',
                                            ellipsis: true,
                                            render: (_, r: PostInterface) => toDatetimeString(r.createdAt!)
                                        }
                                    ]}
                                    dataSource={addKey(posts)}
                                    page={page}
                                    size={size}
                                    onPageChange={(val) => setPage(val)}
                                />
                            )
                        }
                    </>
                }
            </>}
        </>
    )
}

export default Board;