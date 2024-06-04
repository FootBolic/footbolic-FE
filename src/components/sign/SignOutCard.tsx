import { Button, message } from "antd";
import styles from '../../styles/components/sign/SignOutCard.module.scss'
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { SignAPI } from "../../api/sign/SignAPI";
import { useNavigate } from "react-router-dom";
import { resetAccessTokenState } from "../../reducers/AccessTokenReducer";
import { ROUTES } from "../../constants/common/RouteConstants";
import { API_QUERY_KEYS } from "../../constants/common/DataConstants";

function SignOutCard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: signOut } = useMutation(
        () => SignAPI.signOut(),
        {
            onSuccess: () => handleFinish(true, '로그아웃에 성공하였습니다.'),
            onError: (e: string) => handleFinish(false, e)
        }
    )

    const handleFinish = (isSuccess: boolean, msg: string) => {
        isSuccess ? message.success(msg) : message.error(msg);
        dispatch(resetAccessTokenState());
        queryClient.invalidateQueries([API_QUERY_KEYS.MENU.GET_MENUS_BY_AUTH]);
        navigate(ROUTES.MAIN_VIEW.path);
    }

    return (
        <div className={styles.container}>
            <Button onClick={() => navigate(ROUTES.MEMBER_INFO.path)}>
                마이페이지
            </Button>
            <Button onClick={() => signOut()}>
                로그아웃
            </Button>
        </div>
    )
}

export default SignOutCard;