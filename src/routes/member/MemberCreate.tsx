import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import { useMutation } from "react-query";
import { MemberAPI } from "../../api/member/MemberAPI";
import { Button, Form, Input, Modal, Typography, message } from "antd";
import styles from '../../styles/routes/member/MemberCreate.module.scss';
import Title from "../../components/title/Title";
import { SignAPI } from "../../api/sign/SignAPI";
import { useDispatch } from "react-redux";
import { setAccessTokenState } from "../../reducers/AccessTokenReducer";
import { toDate } from "../../util/DateUtil";
import { ROUTES } from "../../constants/common/RouteConstants";
import { useCheckDuplicate } from "../../hooks/useNickname";

const { Text } = Typography;

function MemberCreate () {
    const { state } = useLocation();
    const [form] = Form.useForm();
    const [member, setMember] = useState<MemberInterface>();
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
    const { mutateAsync: checkDuplicate } = useCheckDuplicate();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        state ? setMember(state.member) : handleInvalidMember();
    }, [state])

    const { mutate: createMember }  = useMutation((data: MemberInterface) => MemberAPI.createMember(data), {
        onSuccess: (data) => {
            signIn(data.savedMember)
        },
        onError: (e: string) => {message.error(e)}
    })

    const { mutate: signIn } = useMutation(
        (member: MemberInterface) => SignAPI.signIn(member),
        {
            onSuccess: (data) => {
                dispatch(setAccessTokenState({
                    accessToken: data.access_token,
                    accessTokenExpiresAt: toDate(data.expires_at).getTime(),
                    nickname: data.nickname
                }))
                message.success(`${data.nickname}님, 회원가입이 완료되었습니다!`);
                navigate(ROUTES.MAIN_VIEW.path);
            },
            onError: (e: string) => {message.error(e)}
        }
    )

    const handleInvalidMember = () => {
        message.error('에러가 발생하였습니다.');
        navigate(ROUTES.MAIN_VIEW.path);
    }

    const validateDuplicate = async(_: object, nickname: string) => {
        if (nickname) {
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
            <Title title="회원가입" centered />
            <div className={styles.container}>
                <Form 
                    form={form}
                    layout="vertical"
                    className={styles.form_container}
                    onFinish={() => setIsSaveModalOpen(true)}
                >
                    <Form.Item
                        name="nickname"
                        label='닉네임'
                        rules={[
                            {
                                required: true,
                                message: "닉네임은 필수입력 항목입니다."
                            },
                            {
                                max: 20,
                                message: "닉네임의 길이는 20자 이하로만 허용됩니다."
                            },
                            {
                                pattern: /^[가-힣a-zA-Z0-9_&^\-]+$/,
                                message: "닉네임에는 한글, 영어, 숫자, 특수문자(_, -, ^, &)만 허용됩니다."
                            },
                            {
                                validator: validateDuplicate
                            }
                        ]}
                        validateTrigger={['onBlur']}
                    >
                        <Input placeholder="닉네임을 입력해주세요." maxLength={20} />
                    </Form.Item>
                    <Form.Item>
                        <Button block type='primary' onClick={() => form.submit()}>
                            저장
                        </Button>
                        <Modal
                            title='회원가입'
                            open={isSaveModalOpen}
                            onOk={() =>  member && createMember({ ...member, nickname: form.getFieldValue('nickname') })}
                            onCancel={() => setIsSaveModalOpen(false)}
                            okText='확인'
                            cancelText='취소'
                        >
                            <Text>회원가입을 진행하시겠습니까?</Text><br/>
                            <Text>닉네임은 3개월동안 수정이 불가합니다.</Text>
                        </Modal>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}

export default MemberCreate;