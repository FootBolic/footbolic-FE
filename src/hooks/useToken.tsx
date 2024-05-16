import { useMutation } from "react-query";
import { SignAPI } from "../api/sign/SignAPI";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetAccessTokenState, setAccessTokenState } from "../reducers/AccessTokenReducer";
import { getTime, toDate } from "../util/DateUtil";
import { resetApiError } from "../reducers/ApiErrorReducer";
import store from "../reducers/Store";
import { TOKEN_RENEWAL_TIME } from "../constants/common/DataConstants";

/**
 * API 서버에 Refresh Token 존재 여부 확인을 요청한다.
 * 만약 토큰이 있으면 Access Token을 갱신하고
 * 없으면 로그아웃 처리 한다.
 */
function useToken() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { mutate: checkRefreshToken, isError: isCheckRefreshTokenError } = useMutation(
        () => SignAPI.checkRefreshToken(),
        {
            onSuccess: (result) => result ? renew() : handleFinish('로그인이 만료되었습니다.'),
            onError: () => signOut()
        }
    )

    /**
     * 일정 주기마다 Access Token 존재여부를 확인하여 
     * 만료까지 일정 시간 이하가 남았으면 renew 요청을 보낸다.
     */
    const checkAccessToken = () => {
        const accessTokenExpiresAt = store.getState().accessToken.accessTokenExpiresAt;

        if (accessTokenExpiresAt) {
            if ((accessTokenExpiresAt - getTime()) < TOKEN_RENEWAL_TIME.FETCH_REM_TIME) renew();
            setTimeout(checkAccessToken, TOKEN_RENEWAL_TIME.CHECK_PERIOD);
        }
    }

    const { mutate: signOut } = useMutation(
        () => SignAPI.signOut(),
        {
            onSuccess: () => handleFinish('다시 로그인하여 주세요.'),
            onError: () => handleFinish('에러가 발생하였습니다.')
        }
    )

    const { mutate: renew } = useMutation(
        () => SignAPI.renew(),
        {
            onSuccess: (result) => {
                result ? dispatch(setAccessTokenState({
                    accessToken: result.access_token,
                    accessTokenExpiresAt: toDate(result.expires_at).getTime(),
                    nickname: result.nickname
                })) : signOut();
            },
            onError: () => signOut()
        }
    )

    const handleFinish = (msg: string) => {
        message.error(msg);
        dispatch(resetApiError());
        dispatch(resetAccessTokenState());
        navigate('/');
    }

    return { checkRefreshToken, isCheckRefreshTokenError, checkAccessToken };
}

export default useToken;