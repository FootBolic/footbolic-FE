import { Button, Card, Form, Input, Modal, Pagination, Skeleton, Table, Typography, message } from "antd";
import Title from "../../../components/title/Title";
import styles from "../../../styles/routes/management/member/MemberManagement.module.scss";
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../../types/reducers/RootStateInterface";
import { MemberAPI } from "../../../api/member/MemberAPI";
import { MemberInterface } from "../../../types/entity/member/MemberInterface";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Error from "../../../components/error/Error";
import { API_QUERY_KEYS, BOARD_PAGE_SIZE } from "../../../constants/common/DataConstants";
import { addKey, translatePlatform } from "../../../util/DataUtil";
import { toDateString, toDatetimeString } from "../../../util/DateUtil";

const { Text } = Typography;

function MemberManagement() {
    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);
    const [form] = Form.useForm();

    const [member, setMember] = useState<MemberInterface>();
    const [allMembers, setAllMembers] = useState<MemberInterface[]>([]);
    const [memberId, setMemberId] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(0);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const { isFetching: isFetchingAll, isError: isErrorAll, refetch: refetchAll } = useQuery({
        queryKey: [API_QUERY_KEYS.MEMBER.GET_MEMBERS],
        queryFn: () => MemberAPI.getMembers(page-1, BOARD_PAGE_SIZE),
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
        onSuccess: (result) => {setMember(result)},
        onError: (e: string) => message.error(e)
    })

    const { mutate: updateMember } = useMutation(
        (member: MemberInterface) => MemberAPI.updateMember(member),
        {
            onSuccess: () => {handleSuccess(true)},
            onError: (e: string) => {message.error(e)},
            onSettled: () => setIsSaveModalOpen(false)
        }
    )

    const { mutate: deleteMember } = useMutation(
        (id: string) => MemberAPI.deleteMember(id),
        {
            onSuccess: () => {handleSuccess(false)},
            onError: (e: string) => {message.error(e)},
            onSettled: () => setIsDeleteModalOpen(false)
        }
    )

    useEffect(() => {
        refetchAll();
        setMemberId("");
    }, [page]);

    useEffect(() => {
        memberId ? refetchMember() : setMember(undefined);
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

    const handleFinish = () => {
        if (!member) {
            message.error('선택된 회원이 없습니다.');
            return;
        }
        updateMember({ ...member, nickname: form.getFieldValue("nickname") })
    }

    const handleSuccess = (isCreate: boolean) => {
        message.success(`회원이 성공적으로 ${isCreate ? '수정' : '삭제'}되었습니다.`);
        refetchAll();
        isCreate ? refetchMember() : setMemberId("");
    }

    return (
        <>
            <Title title="회원 관리" />
            {isFetchingAll ? <Skeleton active /> : <>
                {isErrorAll ? <Error /> : (
                    <div className={isMobile ? styles.mobile_container : styles.container}>
                        <div className={styles.card_container}>
                            <Card className={styles.card} bodyStyle={{ height: '100%' }}>
                                <div className={styles.board_container}>
                                    <Table className={styles.board} pagination={false} dataSource={addKey(allMembers)}>
                                        <Table.Column
                                            className={styles.nickname}
                                            title="닉네임"
                                            dataIndex="nickname"
                                            key="nickname"
                                            width="auto"
                                            render={(t, r: MemberInterface) => <a onClick={() => setMemberId(memberId === r.id ? "" : r.id)}>{t}</a>}
                                        />
                                        <Table.Column
                                            className={styles.platform}
                                            title="플랫폼"
                                            dataIndex="platform"
                                            key="platform"
                                            width="80px"
                                            render={(t) => translatePlatform(t) || '-'}
                                        />
                                        <Table.Column
                                            className={styles.created_at}
                                            title="가입일자"
                                            dataIndex="createdAt"
                                            key="createdAt"
                                            width="120px"
                                            render={(t) => toDateString(t)}
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
                            <Form form={form} disabled={!member || isFetchingMember || isErrorMember} layout="vertical" onFinish={handleFinish}>
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
                                    <Form.Item className={styles.button_container}>
                                        <Button type='primary' onClick={() => setIsSaveModalOpen(true)}>
                                            수정
                                        </Button>
                                        <Modal
                                            title='회원 수정'
                                            open={isSaveModalOpen}
                                            onOk={() => form.submit()}
                                            onCancel={() => setIsSaveModalOpen(false)}
                                            okText='확인'
                                            cancelText='취소'
                                        >
                                            <Text>회원을 수정하시겠습니까?</Text>
                                        </Modal>
                                        <Button danger type='primary' onClick={() => setIsDeleteModalOpen(true)}>
                                            삭제
                                        </Button>
                                        <Modal
                                            title='회원 삭제'
                                            open={isDeleteModalOpen}
                                            onOk={() => member && deleteMember(member.id)}
                                            onCancel={() => setIsDeleteModalOpen(false)}
                                            okText='삭제'
                                            cancelText='취소'
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Text>회원을 삭제하시겠습니까?</Text>
                                        </Modal>
                                    </Form.Item>
                            </Form>
                        </div>
                    </div>
                )}
            </>}
        </>
    )
}

export default MemberManagement;