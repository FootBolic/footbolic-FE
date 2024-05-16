import { Button, message } from "antd";
import styles from '../../styles/components/sign/SignOutCard.module.scss'
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { SignAPI } from "../../api/sign/SignAPI";
import { useNavigate } from "react-router-dom";
import { resetAccessTokenState } from "../../reducers/AccessTokenReducer";

function SignOutCard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { mutate: signOut } = useMutation(
        () => SignAPI.signOut(),
        {
            onSuccess: (result) => {
                if (result) {
                    message.success('로그아웃에 성공하였습니다.');
                    dispatch(resetAccessTokenState());
                    navigate('/');
                } else {
                    message.error('에러가 발생하였습니다.');
                }
            }
        }
    )

    return (
        <div className={styles.container}>
            <Button>
                마이페이지
            </Button>
            <Button onClick={() => signOut()}>
                로그아웃
            </Button>
        </div>
    )
}

export default SignOutCard;