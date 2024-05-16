import { Button, Form, Input, Modal, Skeleton, Typography, message } from "antd";
import Title from "../../components/title/Title";
import styles from "../../styles/routes/member/MemberInfo.module.scss"
import { useState } from "react";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { API_QUERY_KEYS } from "../../constants/common/DataConstants";
import { MemberAPI } from "../../api/member/MemberAPI";
import { getTime, toDate } from "../../util/DateUtil";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAccessTokenState } from "../../reducers/AccessTokenReducer";
import { ROUTES } from "../../constants/common/RouteConstants";

const { Text } = Typography;

function MemberInfo() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [isUpdatable, setIsUpdatable] = useState<boolean>(true);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const { isFetching } = useQuery({
        queryKey: [API_QUERY_KEYS.MEMBER.GET_MEMBER],
        queryFn: () => MemberAPI.getMember(),
        onSuccess: (result) => {
            if (result) {
                const nicknameLastUpdatedAt = toDate(result.nicknameLastUpdatedAt as number[]);
                nicknameLastUpdatedAt.setMonth(nicknameLastUpdatedAt.getMonth() + 3);
                setIsUpdatable(nicknameLastUpdatedAt.getTime() - getTime() < 0);
                form.setFieldsValue(result);
            }
        },
        onError: (e: string) => {console.log(123,e)
            message.error(e);
            dispatch(resetAccessTokenState());
            navigate(ROUTES.MAIN_VIEW.path);
        }
    })

    const { mutate: updateMember } = useMutation(
        (member: MemberInterface) => MemberAPI.updateTokenMember(member),
        {
            onSuccess: () => {
                setIsSaveModalOpen(false);
                queryClient.invalidateQueries(API_QUERY_KEYS.MEMBER.GET_MEMBER);
                message.success("회원정보가 수정되었습니다.");
            },
            onError: (e: string) => {
                message.error(e);
                setIsSaveModalOpen(false)
            }
        }
    )

    const handleSaveButtonClick = () => {
        const validationResult = validate();
        !validationResult ? setIsSaveModalOpen(true) : message.error(validationResult);
    }

    /**
     * 회원정보 입력 정보를 validate 한다.
     * @returns 유효하지 않을 경우 에러메세지로 출력할 내용, 유효할 경우 빈 문자열
     */
    const validate = () => {
        if (!form.getFieldValue('nickname')) {
            return '닉네임은 필수입력 항목입니다.';
        } else if (form.getFieldValue('nickname').length > 20) {
            return '닉네임의 길이는 20자 이하로만 허용됩니다.';
        }

        return '';
    }

    return (
        <>
            <Title title="회원정보" centered />
            <div className={styles.container}>
                {isFetching ? <Skeleton active /> : 
                    <Form 
                        form={form}
                        layout="vertical"
                        className={styles.form_container}
                        onFinish={updateMember}
                    >
                        <Form.Item
                            name="nickname"
                            label='닉네임'
                            rules={[
                                {
                                    required: true,
                                    message: "닉네임은 필수입력 항목입니다."
                                }
                            ]}
                            validateTrigger={['onBlur']}
                        >
                            <Input 
                                disabled={!isUpdatable}
                                placeholder="닉네임을 입력해주세요."
                                maxLength={20}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button block type='primary' onClick={handleSaveButtonClick} disabled={!isUpdatable}>
                                저장
                            </Button>
                            <Modal
                                title='회원정보 수정'
                                open={isSaveModalOpen}
                                onOk={() => form.submit()}
                                onCancel={() => setIsSaveModalOpen(false)}
                                okText='확인'
                                cancelText='취소'
                            >
                                <Text>회원정보를 수정하시겠습니까?</Text><br/>
                                <Text>닉네임은 3개월동안 수정이 불가합니다.</Text>
                            </Modal>
                        </Form.Item>
                        <Form.Item>
                            <Button block danger type='primary' onClick={() => setIsDeleteModalOpen(true)}>
                                회원 탈퇴
                            </Button>
                            <Modal
                                title='회원 탈퇴'
                                open={isDeleteModalOpen}
                                onOk={() => form.submit()}
                                onCancel={() => setIsDeleteModalOpen(false)}
                                okButtonProps={{ danger: true }}
                                okText='확인'
                                cancelText='취소'
                            >
                                <Text>회원 탈퇴를 진행하시겠습니까?</Text>
                            </Modal>
                        </Form.Item>
                    </Form>
                }
            </div>
        </>
    )
}

export default MemberInfo;