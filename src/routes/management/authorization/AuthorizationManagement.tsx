import { useMutation, useQuery, useQueryClient } from "react-query";
import Title from "../../../components/title/Title";
import { API_QUERY_KEYS, BOARD_PAGE_SIZE } from "../../../constants/common/DataConstants";
import { AuthorizationAPI } from "../../../api/authorization/AuthorizationAPI";
import { useEffect, useState } from "react";
import { AuthorizationInterface, AuthorizationSearchInterface } from "../../../types/entity/authorizations/AuthorizationInterface";
import { Form, Input, TreeSelect, message } from "antd";
import { MenuAPI } from "../../../api/menu/MenuAPI";
import { MenuInterface } from "../../../types/entity/menu/MenuInterface";
import SearchBar from "../../../components/search/SearchBar";
import ManagementLayout from "../../../components/layout/ManagementLayout";
import { getOptionMenus } from "../../../util/DataUtil";

function AuthorizationManagement() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(0);
    const [authorizationId, setAuthorizationId] = useState<string>("");
    const [authorization, setAuthorization] = useState<AuthorizationInterface>();
    const [menus, setMenus] = useState<MenuInterface[]>([]);
    const [allAuthorizations, setAllAuthorizations] = useState<AuthorizationInterface[]>([]);
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
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: updateAuth } = useMutation(
        (authorization: AuthorizationInterface) => AuthorizationAPI.updateAuthorization(authorization),
        {
            onSuccess: (result) => handleSuccess(true, result),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: deleteAuth } = useMutation(
        (id: string) => AuthorizationAPI.deleteAuthorization(id),
        {
            onSuccess: () => handleSuccess(false, { id: "" } as AuthorizationInterface),
            onError: (e: string) => {message.error(e)}
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
        const auth: AuthorizationInterface = { ...authorization!, title: form.getFieldValue("title"), menuId: form.getFieldValue("menuId") };
        authorization!.id ? updateAuth(auth) : createAuth(auth);
    }

    const handleSuccess = (isSave: boolean, result: AuthorizationInterface) => {
        message.success(`권한이 ${isSave ? '저장' : '삭제'}되었습니다.`);
        refetchAll();
        setAuthorizationId(isSave ? result.id : '');
        queryClient.invalidateQueries([API_QUERY_KEYS.MENU.GET_MENUS_BY_AUTH]);
    }

    return (
        <>
            <Title title="권한 관리" buttons={[{ text: '권한추가', onClick: handleInsertAuth }]} />
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
                            },
                            {
                                label: '메뉴',
                                name: 'menuId',
                                type: 'select',
                                options: getOptionMenus(menus, { id: "" } as MenuInterface),
                                placeholder: '메뉴를 선택해주세요.' 
                            }
                        ]} 
                        onSearch={(result) => setSearch(result)}
                        onReset={() => setSearch(undefined)}
                    />
                }
                cardContentType="table"
                cardData={allAuthorizations}
                cardTableColumns={
                    [
                        {
                            title: '제목',
                            dataIndex: 'title',
                            key: 'title',
                            width: 'auto',
                            render: (t, r: AuthorizationInterface) => {
                                return <a onClick={() => setAuthorizationId(authorizationId === r.id ? "" : r.id)}>{t}</a>
                            }
                        },
                        {
                            title: "메뉴",
                            dataIndex: "menu",
                            key: "menu",
                            width: "auto",
                            ellipsis: true,
                            render: (t) => t.title
                        }
                    ]
                }
                cardTablePage={page}
                cardTableSize={size}
                onCardPageChange={(val) => setPage(val)}
                isDeletable
                formDeleteButtonDisabled={!authorizationId}
                formDisabled={!authorization || isFetchingAuth || isErrorAuth}
                formInstance={form}
                formElements={
                    <>
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
                    </>
                }
                onSave={handleFinish}
                onDelete={() => deleteAuth(authorization!.id)}
            />
        </>
    )
}

export default AuthorizationManagement;