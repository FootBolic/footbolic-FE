import { useMutation, useQuery, useQueryClient } from "react-query";
import Title from "../../../components/title/Title";
import { API_QUERY_KEYS, BOARD_PAGE_SIZE } from "../../../constants/common/DataConstants";
import { RoleAPI } from "../../../api/role/RoleAPI";
import { useEffect, useState } from "react";
import { RoleInterface, RoleSearchInterface } from "../../../types/entity/role/RoleInterface";
import { AutoComplete, Form, Input, Switch, message } from "antd";
import SearchBar from "../../../components/search/SearchBar";
import { toOption } from "../../../util/DataUtil";
import { AuthorizationInterface } from "../../../types/entity/authorizations/AuthorizationInterface";
import { AuthorizationAPI } from "../../../api/authorization/AuthorizationAPI";
import ConfirmButton from "../../../components/confirm_button/ConfirmButton";
import ManagementLayout from "../../../components/layout/ManagementLayout";

function RoleManagement() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [enabled, setEnabled] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(0);
    const [search, setSearch] = useState<RoleSearchInterface>();
    const [roleId, setRoleId] = useState<string>("");
    const [role, setRole] = useState<RoleInterface>();
    const [allRoles, setAllRoles] = useState<RoleInterface[]>([]);
    const [popOpen, setPopOpen] = useState<string>("")
    const [auths, setAuths] = useState<{ label: string, value: string }[]>([])

    const { isFetching: isFetchingAll, isError: isErrorAll, refetch: refetchAll } = useQuery({
        queryKey: [API_QUERY_KEYS.ROLE.GET_ROLES],
        queryFn: () => RoleAPI.getRoles(page-1, BOARD_PAGE_SIZE, search),
        enabled: enabled,
        onSuccess: (result) => {
            setEnabled(false);
            setAllRoles(result.roles);
            setSize(result.size);
        },
        onError: (e: string) => message.error(e),
    })

    const { isFetching: isFetchingRole, isError: isErrorRole, refetch: refetchRole } = useQuery({
        queryKey: [API_QUERY_KEYS.ROLE.GET_ROLE],
        queryFn: () => RoleAPI.getRole(roleId),
        enabled: false,
        onSuccess: (result) => {
            [].forEach.call(result.role.authorizations, (e: AuthorizationInterface) => {
                e.isNew = false;
                e.isDeleted = false;
            })
            setRole(result.role);
        },
        onError: (e: string) => message.error(e),
    })

    const {} = useQuery({
        queryKey: [API_QUERY_KEYS.AUTHORIZATION.GET_ALL_AUTHORIZATIONS],
        queryFn: () => AuthorizationAPI.getAllAuthorizations(),
        onSuccess: (result) => setAuths(toOption("title", "id", result.authorizations)),
        onError: (e: string) => message.error(e)
    })

    const { mutate: createRole } = useMutation(
        (role: RoleInterface) => RoleAPI.createRole(role),
        {
            onSuccess: (result) => handleSuccess(true, result.createdRole),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: updateRole } = useMutation(
        (role: RoleInterface) => RoleAPI.updateRole(role),
        {
            onSuccess: (result) => {
                handleSuccess(true, result.updatedRole);
                refetchRole();
            },
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: deleteRole } = useMutation(
        (id: string) => RoleAPI.deleteRole(id),
        {
            onSuccess: () => handleSuccess(false, { id: "" }),
            onError: (e: string) => {message.error(e)}
        }
    )

    useEffect(() => {
        refetchAll();
        setRoleId("");
        setPopOpen("");
    }, [page, search])

    useEffect(() => {
        roleId ? refetchRole() : setRole(undefined);
        setPopOpen("");
    }, [roleId])

    useEffect(() => {
        role ? form.setFieldsValue(role) : form.resetFields();
        setPopOpen("");
    }, [role])

    const handleInsertRole = () => {
        setRoleId("");
        (role && !role?.id) ? setRole(undefined) : setTimeout(() => setRole({ title: "신규 역할" } as RoleInterface), 5);
    }

    const handleSelectAuth = (v: string, o: { label: string, value: string }) => {
        if (role?.authorizations) {
            for (let auth of role.authorizations) {
                if (!auth.isDeleted && auth.id === v) {
                    message.error('이미 부여된 권한입니다.');
                    form.setFieldValue("authorizations", "");
                    return;
                }
            }
        }

        const auths = role?.authorizations ? [...role.authorizations, { id: o.value, title: o.label, isDeleted: false, isNew: true }]
                : [{ id: o.value, title: o.label, isDeleted: false, isNew: true }]
        setRole({ ...role, ...form.getFieldsValue(), authorizations: auths } as RoleInterface);
    }

    const handleFinish = () => {
        const target: RoleInterface = { ...role!, ...form.getFieldsValue() };
        role!.id ? updateRole(target) : createRole(target);
    }

    const handleSuccess = (isSave: boolean, result: RoleInterface) => {
        message.success(`역할이 ${isSave ? '저장' : '삭제'}되었습니다.`);
        refetchAll();
        setRoleId(isSave ? result.id :  '');
        queryClient.invalidateQueries([API_QUERY_KEYS.MENU.GET_MENUS_BY_AUTH]);
    }

    return (
        <>
            <Title title="역할 관리" buttons={[{ text: '역할추가', onClick: handleInsertRole }]} />
            <ManagementLayout
                isFetching={isFetchingAll} 
                isError={isErrorAll}
                searchBar={
                    <SearchBar
                        defaultValues={search}
                        elements={[
                            { label: '제목', name: 'title', type: 'input', maxLength: 20, placeholder: '제목을 입력해주세요.' },
                            { label: '권한', name: 'authorizationId', type: 'select', placeholder:'권한을 선택해주세요.', options: auths }
                        ]}
                        onSearch={(result) => setSearch(result)}
                        onReset={() => setSearch(undefined)}
                    />
                }
                cardContentType="table"
                cardTableColumns={
                    [
                        {
                            title: "제목",
                            dataIndex: "title",
                            key: "title",
                            width: "auto",
                            render: (t, r: RoleInterface) => <a onClick={() => setRoleId(roleId === r.id ? "" : r.id)}>{t}</a>
                        },
                        {    
                            title: "코드",
                            dataIndex: "code",
                            key: "code",
                            ellipsis: true,
                            width: "auto",
                            render: (t) => t
                        },
                        {
                            title: "기본여부",
                            dataIndex: "isDefault",
                            key: "isDefault",
                            width: "100px",
                            align: "center",
                            ellipsis: true,
                            render: (t) => t ? "예" : "아니오"
                        }
                    ]
                }
                cardData={allRoles}
                cardTablePage={page}
                cardTableSize={size}
                onCardPageChange={(val) => setPage(val)}
                isDeletable
                formDeleteButtonDisabled={!roleId}
                formDisabled={!role || isFetchingRole || isErrorRole}
                formInstance={form}
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
                        <Form.Item
                            name='code'
                            label='코드'
                            rules={[
                                {
                                    required: true,
                                    message: "코드는 필수입력 항목입니다."
                                }
                            ]}
                            validateTrigger={['onBlur']}
                        >
                            <Input placeholder='코드를 입력해주세요.' maxLength={20} />
                        </Form.Item>
                        <Form.Item name='authorizations' label='권한'>
                            <AutoComplete
                                options={auths}
                                onSelect={handleSelectAuth}
                                placeholder="권한을 선택해주세요."
                                filterOption={(v, o) => o!.label.toUpperCase().indexOf(v.toUpperCase()) !== -1}
                            />
                        </Form.Item>
                        <>
                            {role?.authorizations && <ConfirmButton 
                                data={role?.authorizations} 
                                confirmText="권한을 삭제하시겠습니까?"
                                popOpen={popOpen}
                                setPopOpen={setPopOpen}
                                onConfirm={(e: AuthorizationInterface) => {
                                    role.authorizations && setRole({
                                        ...role,
                                        ...form.getFieldsValue(),
                                        authorizations: [
                                            ...role.authorizations?.filter(a => a.id !== e.id),
                                            { ...e, isDeleted: true }
                                        ]
                                    });
                                }}
                            />}
                        </>
                        <Form.Item name='isDefault' label='기본여부'>
                            <Switch />
                        </Form.Item>
                    </>
                }
                onSave={handleFinish}
                onDelete={() => deleteRole(role!.id)}
            />
        </>
    )
}

export default RoleManagement;