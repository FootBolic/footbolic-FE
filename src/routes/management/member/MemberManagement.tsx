import { AutoComplete, Form, Input, message } from "antd";
import Title from "../../../components/title/Title";
import styles from "../../../styles/routes/management/member/MemberManagement.module.scss";
import { MemberAPI } from "../../../api/member/MemberAPI";
import { MemberInterface, MemberSearchInterface } from "../../../types/entity/member/MemberInterface";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { API_QUERY_KEYS, AUTH_PLATFORM, AUTH_PLATFORM_KR, BOARD_PAGE_SIZE } from "../../../constants/common/DataConstants";
import { toOption, translatePlatform } from "../../../util/DataUtil";
import { toDateString, toDatetimeString } from "../../../util/DateUtil";
import SearchBar from "../../../components/search/SearchBar";
import ConfirmButton from "../../../components/confirm_button/ConfirmButton";
import { RoleInterface } from "../../../types/entity/role/RoleInterface";
import { RoleAPI } from "../../../api/role/RoleAPI";
import { UserOutlined } from '@ant-design/icons';
import ManagementLayout from "../../../components/layout/ManagementLayout";

function MemberManagement() {
    const [form] = Form.useForm();

    const [member, setMember] = useState<MemberInterface>();
    const [allMembers, setAllMembers] = useState<MemberInterface[]>([]);
    const [memberId, setMemberId] = useState<string>("");
    const [roles, setRoles] = useState<{ label: string, value: string }[]>([]);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(0);
    const [search, setSearch] = useState<MemberSearchInterface>();
    const [popOpen, setPopOpen] = useState<string>("");

    const { isFetching: isFetchingAll, isError: isErrorAll, refetch: refetchAll } = useQuery({
        queryKey: [API_QUERY_KEYS.MEMBER.GET_MEMBERS],
        queryFn: () => MemberAPI.getMembers(page-1, BOARD_PAGE_SIZE, search),
        onSuccess: (result) => {
            setAllMembers(result.members);
            setSize(result.size);
        },
        onError: (e: string) => message.error(e)
    })

    const { isFetching: isFetchingMember, isError: isErrorMember, refetch: refetchMember } = useQuery({
        queryKey: [API_QUERY_KEYS.MEMBER.GET_MEMBER],
        queryFn: () => MemberAPI.getMember(memberId),
        enabled: false,
        onSuccess: (result) => {
            [].forEach.call(result.roles, (e: RoleInterface) => {
                e.isNew = false;
                e.isDeleted = false;
            });
            setMember(result);
        },
        onError: (e: string) => message.error(e)
    })

    const {} = useQuery({
        queryKey: [API_QUERY_KEYS.ROLE.GET_ALL_ROLES],
        queryFn: () => RoleAPI.getAllRoles(),
        onSuccess: (result) => setRoles(toOption("title", "id", result.roles)),
        onError: (e: string) => message.error(e)
    })

    const { mutate: updateMember } = useMutation(
        (member: MemberInterface) => MemberAPI.updateMember(member),
        {
            onSuccess: () => {handleSuccess(true)},
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: deleteMember } = useMutation(
        (id: string) => MemberAPI.deleteMember(id),
        {
            onSuccess: () => {handleSuccess(false)},
            onError: (e: string) => {message.error(e)}
        }
    )

    useEffect(() => {
        refetchAll();
        setMemberId("");
        setPopOpen("");
    }, [page, search]);

    useEffect(() => {
        memberId ? refetchMember() : setMember(undefined);
        setPopOpen("");
    }, [memberId])

    useEffect(() => {
        if (member) {
            form.setFieldsValue(member);
            member.platform && form.setFieldValue("platform", translatePlatform(member.platform));
            member.createdAt && form.setFieldValue("createdAt", toDatetimeString(member.createdAt));
            member.updatedAt && form.setFieldValue("updatedAt", toDatetimeString(member.updatedAt));
            member.nicknameLastUpdatedAt && form.setFieldValue("nicknameLastUpdatedAt", toDatetimeString(member.nicknameLastUpdatedAt as number[]));
        } else {
            form.resetFields();
        }
    }, [member])

    const handleSelectRole = (v: string, o: { label: string, value: string }) => {
        if (member?.roles) {
            for (let role of member.roles) {
                if (!role.isDeleted && role.id === v) {
                    message.error('이미 부여된 역할입니다.');
                    form.setFieldValue("roles", "");
                    return;
                }
            }
        }

        const roles = member?.roles ? [...member.roles, { id: o.value, title: o.label, isDeleted: false, isNew: true }]
                : [{ id: o.value, title: o.label, isDeleted: false, isNew: true }]
        setMember({ ...member, nickname: form.getFieldValue('nickname'), roles: roles } as RoleInterface);
    }

    const handleFinish = () => {
        if (!member) {
            message.error('선택된 회원이 없습니다.');
            return;
        }
        updateMember({ ...member, nickname: form.getFieldValue("nickname") })
    }

    const handleSuccess = (isUpdate: boolean) => {
        message.success(`회원이 ${isUpdate ? '수정' : '삭제'}되었습니다.`);
        refetchAll();
        isUpdate ? refetchMember() : setMemberId("");
    }

    return (
        <>
            <Title title="회원 관리" Icon={<UserOutlined />} />
            <ManagementLayout 
                isFetching={isFetchingAll}
                isError={isErrorAll}
                searchBar={
                    <SearchBar 
                        defaultValues={search}
                        elements={[
                            { label: '닉네임', name: 'nickname', type: 'input', maxLength: 20, placeholder: '닉네임을 입력해주세요.' },
                            { label: '플랫폼', name: 'platform', type: 'select', placeholder: '플랫폼을 선택해주세요.', options: [
                                { label: AUTH_PLATFORM_KR.KAKAO, value: AUTH_PLATFORM.KAKAO },
                                { label: AUTH_PLATFORM_KR.NAVER, value: AUTH_PLATFORM.NAVER }
                            ] }
                        ]}
                        onSearch={(result) => setSearch(result)}
                        onReset={() => setSearch(undefined)}
                    />
                }
                cardContentType="table"
                cardTableColumns={
                    [
                        {
                            className: styles.nickname,
                            title: "닉네임",
                            dataIndex: "nickname",
                            key: "nickname",
                            width: "auto",
                            render: (t, r: MemberInterface) => <a onClick={() => setMemberId(memberId === r.id ? "" : r.id)}>{t}</a>
                        },
                        {
                            className: styles.platform,
                            title: "플랫폼",
                            dataIndex: "platform",
                            key: "platform",
                            width: "20%",
                            align: "center",
                            ellipsis: true,
                            render: (t) => translatePlatform(t) || '-'
                        },
                        {
                            className: styles.created_at,
                            title: "가입일자",
                            dataIndex: "createdAt",
                            key: "createdAt",
                            width: "30%",
                            align: "center",
                            ellipsis: true,
                            render: (t) => toDateString(t)
                        }
                    ]
                }
                cardData={allMembers}
                cardTablePage={page}
                cardTableSize={size}
                onCardPageChange={(val) => setPage(val)}
                formDisabled={!member || isFetchingMember || isErrorMember}
                formInstance={form}
                formElements={
                    <>
                        <Form.Item
                            name='nickname'
                            label='닉네임'
                            rules={[
                                {
                                    required: true,
                                    message: "닉네임은 필수입력 항목입니다."
                                }
                            ]}
                            validateTrigger={['onBlur']}
                        >
                            <Input placeholder='닉네임을 입력해주세요.' maxLength={20} />
                        </Form.Item>
                        <Form.Item name='roles' label='역할'>
                            <AutoComplete
                                options={roles}
                                onSelect={handleSelectRole}
                                placeholder="역할을 선택해주세요."
                                filterOption={(v, o) => o!.label.toUpperCase().indexOf(v.toUpperCase()) !== -1}
                            />
                        </Form.Item>
                        <>
                            {member?.roles && <ConfirmButton 
                                data={member.roles} 
                                confirmText="역할을 삭제하시겠습니까?"
                                popOpen={popOpen}
                                setPopOpen={setPopOpen}
                                onConfirm={(e: RoleInterface) => {
                                    if (member?.roles) {
                                        const roles = e.isNew ? [...member.roles.filter(a => a.id !== e.id)]
                                            : [...member.roles.filter(a => a.id !== e.id), { ...e, isDeleted: true }]
                                        setMember({ ...member, nickname: form.getFieldValue('nickname'), roles });
                                    }
                                }}
                            />}
                        </>
                        <Form.Item name='platform' label='플랫폼'>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name='createdAt' label='가입일자'>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name='updatedAt' label='최근로그인일자'>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name='nicknameLastUpdatedAt' label='닉네임변경일자'>
                            <Input disabled />
                        </Form.Item>
                    </>
                }
                onSave={handleFinish}
            />
        </>
    )
}

export default MemberManagement;