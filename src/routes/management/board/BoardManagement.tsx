import { Form, Input, Switch, message } from "antd";
import ManagementLayout from "../../../components/layout/ManagementLayout";
import Title from "../../../components/title/Title";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { BoardAPI } from "../../../api/board/BoardAPI";
import { API_QUERY_KEYS, BOARD_PAGE_SIZE } from "../../../constants/common/DataConstants";
import { BoardSearchInterface, BoardInterface } from "../../../types/entity/board/BoardInterface";
import SearchBar from "../../../components/search/SearchBar";


function BoardManagement() {
    const [form] = Form.useForm();
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(0);
    const [search, setSearch] = useState<BoardSearchInterface>();
    const [board, setBoard] = useState<BoardInterface>();
    const [boardId, setBoardId] = useState<string>("");
    const [allBoards, setAllBoards] = useState<BoardInterface[]>([]);

    const { isFetching: isFetchingAll, isError: isErrorAll, refetch: refetchAll } = useQuery({
        queryKey: [API_QUERY_KEYS.PROGRAM.GET_PROGRAMS],
        queryFn: () => BoardAPI.getBoards(page-1, BOARD_PAGE_SIZE, search),
        onSuccess: (result) => {
            setAllBoards(result.boards);
            setSize(result.size);
        },
        onError: (e: string) => message.error(e),
    })

    const { isFetching: isFetchingBoard, isError: isErrorBoard, refetch: refetchBoard } = useQuery({
        queryKey: [API_QUERY_KEYS.PROGRAM.GET_PROGRAM],
        queryFn: () => BoardAPI.getBoard(boardId),
        enabled: false,
        onSuccess: (result) => setBoard(result.board),
        onError: (e: string) => message.error(e),
    })

    const { mutate: createBoard } = useMutation(
        (board: BoardInterface) => BoardAPI.createBoard(board),
        {
            onSuccess: (result) => handleSuccess(true, result.createdBoard),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: updateBoard } = useMutation(
        (board: BoardInterface) => BoardAPI.updateBoard(board),
        {
            onSuccess: (result) => handleSuccess(true, result.updatedBoard),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: deleteBoard } = useMutation(
        (id: string) => BoardAPI.deleteBoard(id),
        {
            onSuccess: () => handleSuccess(false, { id: "" }),
            onError: (e: string) => {message.error(e)}
        }
    )

    useEffect(() => {
        refetchAll();
        setBoardId("");
    }, [page])

    useEffect(() => {
        boardId ? refetchBoard() : setBoard(undefined);
    }, [boardId])

    useEffect(() => {
        board ? form.setFieldsValue(board) : form.resetFields();
    }, [board])

    useEffect(() => {
        refetchAll();
        setBoardId("");
    }, [search])

    const handleInsertBoard = () => {
        setBoardId("");
        (board && !board?.id) ? setBoard(undefined) 
            : setTimeout(() => setBoard({ title: "신규 게시판" } as BoardInterface), 5);
    }

    const handleFinish = () => {
        const target: BoardInterface = {  ...board!, ...form.getFieldsValue() };
        board!.id ? updateBoard(target) : createBoard(target);
    }

    const handleSuccess = (isSave: boolean, result: BoardInterface) => {
        message.success(`게시판이 ${isSave ? '저장' : '삭제'}되었습니다.`);
        refetchAll();
        setBoardId(isSave ? result.id :  '');
    }
    
    return (
        <>
            <Title title="게시판 관리" buttons={[{ text: '게시판추가', onClick: handleInsertBoard }]} />
            <ManagementLayout
                isFetching={isFetchingAll}
                isError={isErrorAll}
                searchBar={
                    <SearchBar 
                        defaultValues={search}
                        elements={[
                            { 
                                label: '제목', 
                                name: 'title', 
                                type: 'input', 
                                maxLength: 20, 
                                placeholder: '제목을 입력해주세요.' 
                            }
                        ]}
                        onReset={() => setSearch(undefined)}
                        onSearch={(result) => setSearch(result)}
                    />
                }
                cardContentType="table"
                cardTableColumns={
                    [
                        {
                            dataIndex: 'title',
                            key: 'title',
                            title: '제목',
                            width: 'auto',
                            render: (t, r: BoardInterface) => 
                                <a onClick={() => setBoardId(boardId === r.id ? "" : r.id)}>{t}</a>
                        },
                        {
                            dataIndex: 'isUsed',
                            key: 'isUsed',
                            title: '사용여부',
                            width: '20%',
                            align: 'center',
                            render: (t) => t ? '사용중' : '사용안함'
                        }
                    ]
                }
                cardData={allBoards}
                cardTablePage={page}
                cardTableSize={size}
                onCardPageChange={(val) => setPage(val)}
                isDeletable
                formInstance={form}
                formDeleteButtonDisabled={!boardId}
                formDisabled={!board || isFetchingBoard || isErrorBoard}
                formElements={
                    <>
                        <Form.Item
                            name='title'
                            label='제목'
                            rules={[
                                {
                                    required: true,
                                    message: "제목은 필수입력 항목입니다."
                                }
                            ]}
                            validateTrigger={['onBlur']}
                        >
                            <Input placeholder='제목을 입력해주세요.' maxLength={20} />
                        </Form.Item>
                        <Form.Item name='isSecretable' label='비밀글사용여부'>
                            <Switch />
                        </Form.Item>
                        <Form.Item name='isRecommendable' label='추천사용여부'>
                            <Switch />
                        </Form.Item>
                        <Form.Item name='isCommentable' label='댓글사용여부'>
                            <Switch />
                        </Form.Item>
                        <Form.Item name='isAnnounceable' label='공지사용여부'>
                            <Switch />
                        </Form.Item>
                        <Form.Item name='isUsed' label='사용여부'>
                            <Switch />
                        </Form.Item>
                    </>
                }
                onSave={handleFinish}
                onDelete={() => deleteBoard(board!.id)}
            />
        </>
    )
}

export default BoardManagement;