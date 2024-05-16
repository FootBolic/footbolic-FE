import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import { useMutation } from "react-query";
import { MemberAPI } from "../../api/member/MemberAPI";
import { Button, Form, Input, Modal, Result, Typography, message } from "antd";
import styles from '../../styles/routes/member/MemberCreate.module.scss';
import Title from "../../components/title/Title";
import { SignAPI } from "../../api/sign/SignAPI";
import { useDispatch } from "react-redux";
import { setAccessTokenState } from "../../reducers/AccessTokenReducer";
import { toDate } from "../../util/DateUtil";

const { Text } = Typography;


function MemberCreate () {
    const { state } = useLocation();
    const [form] = Form.useForm();
    const [member, setMember] = useState<MemberInterface>();
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorTitle, setErrorTitle] = useState<string>('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        state ? setMember(state.member) : handleInvalidMember();
    }, [state])

    const { mutate: createMember }  = useMutation((data: MemberInterface) => MemberAPI.createMember(data), {
        onSuccess: (data) => signIn(data),
        onError: (e: Error) => {
            setIsError(true);
            setErrorTitle(e.message);
        }
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
                navigate('/');
            },
            onError: (e: Error) => {
                setIsError(true);
                setErrorTitle(e.message);
            }
        }
    )

    const handleInvalidMember = () => {
        message.error('에러가 발생하였습니다.');
        navigate('/');
    }

    const handleSaveButtonClick = () => {
        const validationResult = validate()
        !validationResult ? setIsSaveModalOpen(true) : message.error(validationResult);
    }

    /**
     * 회원가입 입력 정보를 validate 한다.
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
            {
                isError ? <>
                    <Result
                        status="500"
                        title={errorTitle || '에러가 발생하였습니다.'}
                        subTitle="다시 시도해주세요."
                        extra={<Button type="primary" onClick={() => navigate('/')}>홈으로</Button>}
                    />
                </> : <>
                    <Title title="회원가입" />
                    <div className={styles.container}>
                        <Form 
                            form={form}
                            layout="vertical"
                            className={styles.form_container}
                            onFinish={() => member && createMember({ ...member, nickname: form.getFieldValue('nickname') })}
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
                                <Input placeholder="닉네임을 입력해주세요." maxLength={20} />
                            </Form.Item>
                            <Form.Item>
                                <Button block type='primary' onClick={handleSaveButtonClick}>
                                    저장
                                </Button>
                                <Modal
                                    title='회원가입'
                                    open={isSaveModalOpen}
                                    onOk={() => form.submit()}
                                    onCancel={() => setIsSaveModalOpen(false)}
                                    okText='확인'
                                    cancelText='취소'
                                >
                                    <Text>메뉴를 저장하시겠습니까?</Text>
                                </Modal>
                            </Form.Item>
                        </Form>
                    </div>
                </>
            }
        </>
    )
}

export default MemberCreate;