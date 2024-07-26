import { Button, Form, Input, Modal, Skeleton, Typography, message } from "antd";
import Title from "../../components/title/Title";
import styles from "../../styles/routes/member/MemberInfo.module.scss"
import { useState } from "react";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { API_QUERY_KEYS, AUTH_PLATFORM } from "../../constants/common/DataConstants";
import { MemberAPI } from "../../api/member/MemberAPI";
import { dateToDatetimeString, getTime, toDate } from "../../util/DateUtil";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAccessTokenState, updateNickname } from "../../reducers/AccessTokenReducer";
import { ROUTES } from "../../constants/common/RouteConstants";
import useCsrfCheck from "../../hooks/useCsrfCheck";
import { useCheckDuplicate } from "../../hooks/useNickname";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";

const { Text } = Typography;

function MemberInfo() {
    const [form] = Form.useForm();
    const { issue } = useCsrfCheck();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { nickname: memberNickname } = useSelector((state: RootStateInterface) => state.accessToken);
    const { mutateAsync: checkDuplicate } = useCheckDuplicate();
    
    const [isUpdatable, setIsUpdatable] = useState<boolean>(true);
    const [isUpdatableFrom, setIsUpdatableFrom] = useState<string>("");
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const { isFetching } = useQuery({
        queryKey: [API_QUERY_KEYS.MEMBER.GET_TOKEN_MEMBER],
        queryFn: () => MemberAPI.getTokenMember(),
        onSuccess: (result) => {
            if (result) {
                const nicknameLastUpdatedAt = toDate(result.nicknameLastUpdatedAt as number[]);
                nicknameLastUpdatedAt.setMonth(nicknameLastUpdatedAt.getMonth() + 3);
                setIsUpdatable(nicknameLastUpdatedAt.getTime() - getTime() < 0);
                setIsUpdatableFrom(dateToDatetimeString(nicknameLastUpdatedAt));
                form.setFieldsValue(result);
            }
        },
        onError: (e: string) => {
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
                queryClient.invalidateQueries(API_QUERY_KEYS.MEMBER.GET_TOKEN_MEMBER);
                dispatch(updateNickname({ nickname: form.getFieldValue('nickname') }))
                message.success("회원정보가 수정되었습니다.");
            },
            onError: (e: string) => {
                message.error(e);
                setIsSaveModalOpen(false)
            }
        }
    )

    const { mutate: checkPlatform } = useMutation(
        () => MemberAPI.checkPlatform(),
        {
            onSuccess: (platform) => {
                if (platform === AUTH_PLATFORM.KAKAO) {
                    location.href = 'https://kauth.kakao.com/oauth/authorize?response_type=code'
                                            + `&client_id=${import.meta.env.VITE_KAKAO_API_KEY}`
                                            + `&redirect_uri=${import.meta.env.VITE_KAKAO_WITHDRAW_RET_URI}`;
                } else if (platform === AUTH_PLATFORM.NAVER) {
                    const authCsrfState = issue(30);
                    location.href = 'https://nid.naver.com/oauth2.0/authorize?response_type=code'
                                            + `&client_id=${import.meta.env.VITE_NAVER_CLIENT_ID}&state=${authCsrfState}`
                                            + `&redirect_uri=${import.meta.env.VITE_NAVER_WITHDRAW_RET_URI}`;
                } else {
                    message.error('알 수 없는 에러가 발생하였습니다.');
                    setIsDeleteModalOpen(false);
                }
            },
            onError: (e:string) => {
                message.error(e);
                setIsDeleteModalOpen(false);
            }
        }
    )

    const validateDuplicate = async(_: object, nickname: string) => {
        if (nickname && nickname !== memberNickname) {
            try {
                const isDuplicate = await checkDuplicate(nickname);
                if (isDuplicate) {
                    return Promise.reject(new Error('이미 사용중인 닉네임입니다.'));
                }
                return Promise.resolve();
            } catch (error) {
                return Promise.reject(new Error('오류가 발생하였습니다.'));
            }
        }
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
                        onFinishFailed={(e) => {
                            e.errorFields.forEach((err) => {
                                err.errors.forEach((msg) => message.error(msg));
                            })
                            setIsSaveModalOpen(false);
                        }}
                    >
                        <Form.Item
                            name="nickname"
                            label={isUpdatable ? '닉네임' : `닉네임 (${isUpdatableFrom} 이후 수정 가능)`}
                            rules={[
                                {
                                    required: true,
                                    message: "닉네임은 필수입력 항목입니다."
                                },
                                {
                                    max: 20,
                                    message: '닉네임의 길이는 20자 이하로만 허용됩니다.'
                                },
                                {
                                    pattern: /^[가-힣a-zA-Z0-9_&^\-]+$/,
                                    message: "닉네임에는 한글, 영어, 숫자, 특수문자(_, -, ^, &)만 허용됩니다."
                                },
                                {
                                    validator: validateDuplicate,
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
                            <Button block type='primary' onClick={() => setIsSaveModalOpen(true)} disabled={!isUpdatable}>
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
                                onOk={() => checkPlatform()}
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