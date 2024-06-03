import { useMutation, useQuery } from "react-query";
import Title from "../../../components/title/Title";
import { API_QUERY_KEYS, BOARD_PAGE_SIZE } from "../../../constants/common/DataConstants";
import { AuthorizationAPI } from "../../../api/authorization/AuthorizationAPI";
import { useEffect, useState } from "react";
import { AuthorizationInterface, AuthorizationSearchInterface } from "../../../types/entity/authorizations/AuthorizationInterface";
import { Button, Card, Form, Input, Modal, Pagination, Table, TreeSelect, Typography, message } from "antd";
import styles from "../../../styles/routes/management/authorization/AuthorizationManagement.module.scss";
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../../types/reducers/RootStateInterface";
import { addKey } from "../../../util/DataUtil";
import { MenuAPI } from "../../../api/menu/MenuAPI";
import { MenuInterface } from "../../../types/entity/menu/MenuInterface";
import useMenuManagement from "../../../hooks/useMenuManagement";
import SearchBar from "../../../components/search/SearchBar";
import { SEARCH_TYPES } from "../../../constants/components/SearchBarConstants";
import ManagementLayout from "../../../components/layout/ManagementLayout";

const { Text } = Typography;

function AuthorizationManagement() {
    const [form] = Form.useForm();
    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);
    const { getOptionMenus } = useMenuManagement();

    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(0);
    const [authorizationId, setAuthorizationId] = useState<string>("");
    const [authorization, setAuthorization] = useState<AuthorizationInterface>();
    const [menus, setMenus] = useState<MenuInterface[]>([]);
    const [allAuthorizations, setAllAuthorizations] = useState<AuthorizationInterface[]>([]);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<AuthorizationSearchInterface>();

    const { isFetching: isFetchingAll, isError: isErrorAll, refetch: refetchAll } = useQuery({
        queryKey: [API_QUERY_KEYS.AUTHORIZATION.GET_AUTHORIZATIONS],
        queryFn: () => AuthorizationAPI.getAuthorizations(page-1, BOARD_PAGE_SIZE, search),
        onSuccess: (result) => {
            setAllAuthorizations(result.authorizations);
            setSize(result.size);
        },
        onError: (e: string) => message.error(e)
    })

    const { isFetching: isFetchingAuth, isError: isErrorAuth, refetch: refetchAuth } = useQuery({
        queryKey: [API_QUERY_KEYS.AUTHORIZATION.GET_AUTHORIZATION],
        queryFn: () => AuthorizationAPI.getAuthorization(authorizationId),
        enabled: false,
        onSuccess: (result) => setAuthorization(result),
        onError: (e: string) => message.error(e)
    })

    const {} = useQuery({
        queryKey: [API_QUERY_KEYS.MENU.GET_MENUS],
        queryFn: () => MenuAPI.getMenus(),
        onSuccess: (result) => setMenus(result.menus),
        onError: (e: string) => message.error(e)
    })

    const { mutate: createAuth } = useMutation(
        (authorization: AuthorizationInterface) => AuthorizationAPI.createAuthorization(authorization),
        {
            onSuccess: (result) => handleSuccess(true, result),
            onError: (e: string) => {message.error(e)},
            onSettled: () => setIsSaveModalOpen(false)
        }
    )

    const { mutate: updateAuth } = useMutation(
        (authorization: AuthorizationInterface) => AuthorizationAPI.updateAuthorization(authorization),
        {
            onSuccess: (result) => handleSuccess(true, result),
            onError: (e: string) => {message.error(e)},
            onSettled: () => setIsSaveModalOpen(false)
        }
    )

    const { mutate: deleteAuth } = useMutation(
        (id: string) => AuthorizationAPI.deleteAuthorization(id),
        {
            onSuccess: () => handleSuccess(false, { id: "" } as AuthorizationInterface),
            onError: (e: string) => {message.error(e)},
            onSettled: () => setIsDeleteModalOpen(false)
        }
    )

    useEffect(() => {
        refetchAll();
        setAuthorizationId("");
    }, [page])

    useEffect(() => {
        authorizationId ? refetchAuth() : setAuthorization(undefined);
    }, [authorizationId])

    useEffect(() => {
        authorization ? form.setFieldsValue(authorization) : form.resetFields();
    }, [authorization])

    useEffect(() => {
        refetchAll();
        setAuthorizationId("");
    }, [search])


    const handleInsertAuth = () => {
        setAuthorizationId("");
        (authorization && !authorization.id) ? setAuthorization(undefined) 
            : setTimeout(() => setAuthorization({ title: "신규 권한" } as AuthorizationInterface), 5);
    }

    const handleFinish = () => {
        if (authorization) {
            const auth: AuthorizationInterface = { ...authorization, title: form.getFieldValue("title"), menuId: form.getFieldValue("menuId") };
            authorization.id ? updateAuth(auth) : createAuth(auth);
        }
    }

    const handleSuccess = (isSave: boolean, result: AuthorizationInterface) => {
        message.success(`권한이 성공적으로 ${isSave ? '저장' : '삭제'}되었습니다.`);
        refetchAll();
        setAuthorizationId(isSave ? result.id : '');
    }

    return (
        <>
            <Title title="권한관리" buttons={[{ text: '권한추가', onClick: handleInsertAuth }]} />
            <ManagementLayout isFetching={isFetchingAll} isError={isErrorAll}>
                <>
                    <SearchBar 
                        defaultValues={search}
                        elements={[
                            { label: '제목', name: 'title', type: SEARCH_TYPES.INPUT, maxLength: 20, placeholder: '제목을 입력해주세요.' },
                            { label: '메뉴', name: 'menuId', type: SEARCH_TYPES.SELECT, options: getOptionMenus(menus, { id: "" } as MenuInterface), placeholder: '메뉴를 선택해주세요.' }
                        ]} 
                        onSearch={(result) => setSearch(result)}
                        onReset={() => setSearch(undefined)}
                    />
                    <div className={isMobile ? styles.mobile_container : styles.container}>
                        <div className={styles.card_container}>
                            <Card className={styles.card} bodyStyle={{ height: '100%' }}>
                                <div className={styles.board_container}>
                                    <Table scroll={{ x: true }} className={styles.board} pagination={false} dataSource={addKey(allAuthorizations)}>
                                        <Table.Column
                                            className={styles.title}
                                            title="제목"
                                            dataIndex="title"
                                            key="title"
                                            width="auto"
                                            render={(t, r: AuthorizationInterface) => {
                                                return <a onClick={() => setAuthorizationId(authorizationId === r.id ? "" : r.id)}>{t}</a>
                                            }}
                                        />
                                        <Table.Column
                                            title="메뉴"
                                            dataIndex="menu"
                                            key="menu"
                                            width="auto"
                                            ellipsis
                                            render={(t) => t.title}
                                        />
                                    </Table>
                                </div>
                                <div className={styles.pagination_container}>
                                    <Pagination 
                                        showSizeChanger={false}
                                        pageSize={BOARD_PAGE_SIZE}
                                        size="small"
                                        defaultCurrent={page}
                                        total={size}
                                        onChange={(val) => setPage(val)}
                                    />
                                </div>
                            </Card>
                        </div>
                        <div className={styles.form_container}>
                            <Form 
                                form={form}
                                disabled={!authorization || isFetchingAuth || isErrorAuth}
                                layout="vertical"
                                onFinish={() => setIsSaveModalOpen(true)}
                                className={styles.form}
                            >
                                <Form.Item
                                    name='title'
                                    label='제목'
                                    rules={[{ required: true, message: "제목은 필수입력 항목입니다." }, { max: 20, message: "제목의 길이는 20자 이하로만 허용됩니다." }]}
                                    validateTrigger={['onBlur']}
                                >
                                    <Input placeholder='제목을 입력해주세요.' maxLength={20} />
                                </Form.Item>
                                <Form.Item 
                                    name='menuId' 
                                    label='메뉴'
                                    rules={[{ required: true, message: "메뉴는 필수입력 항목입니다." }]}
                                    validateTrigger={['onBlur']}
                                >
                                    <TreeSelect
                                        placeholder='메뉴를 선택해주세요.'
                                        treeData={getOptionMenus(menus, { id: "" } as MenuInterface)}
                                        treeDefaultExpandAll
                                        style={{ width: '100%' }}
                                        value={authorization?.menuId}
                                    />
                                </Form.Item>
                                <Form.Item className={styles.button_container}>
                                    <Button type='primary' onClick={() => form.submit()}>
                                        저장
                                    </Button>
                                    <Modal
                                        title='권한 저장'
                                        open={isSaveModalOpen}
                                        onOk={handleFinish}
                                        onCancel={() => setIsSaveModalOpen(false)}
                                        okText='확인'
                                        cancelText='취소'
                                    >
                                        <Text>권한을 저장하시겠습니까?</Text>
                                    </Modal>
                                    <Button danger disabled={!authorizationId} type='primary' onClick={() => setIsDeleteModalOpen(true)}>
                                        삭제
                                    </Button>
                                    <Modal
                                        title='권한 삭제'
                                        open={isDeleteModalOpen}
                                        onOk={() => authorization && deleteAuth(authorization.id)}
                                        onCancel={() => setIsDeleteModalOpen(false)}
                                        okText='삭제'
                                        cancelText='취소'
                                        okButtonProps={{ danger: true }}
                                    >
                                        <Text>권한을 삭제하시겠습니까?</Text>
                                    </Modal>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </>
            </ManagementLayout>
        </>
    )
}

export default AuthorizationManagement;