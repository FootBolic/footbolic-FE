import { useNavigate, useParams } from "react-router-dom"
import useCsrfCheck from "../../hooks/useCsrfCheck";
import useURLParam from "../../hooks/useURLParam";
import { useEffect, useState } from "react";
import { Button, Result, Skeleton } from "antd";
import { ROUTES } from "../../constants/common/RouteConstants";
import { AUTH_PLATFORM } from "../../constants/common/DataConstants";
import { KakaoAuthApi } from "../../api/oauth/KakaoAuthApi";
import { useMutation } from "react-query";
import { KakaoTokenInterface } from "../../types/common/KakaoApiInterface";
import { NaverTokenInterface } from "../../types/common/NaverApiInterface";
import { MemberAPI } from "../../api/member/MemberAPI";
import { NaverAuthApi } from "../../api/oauth/NaverAuthApi";
import styles from "../../styles/routes/member/MemberWithdraw.module.scss"
import { useDispatch } from "react-redux";
import { resetAccessTokenState } from "../../reducers/AccessTokenReducer";

function MemberWithdraw() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { platform } = useParams();
    const { code, state, error } = useURLParam();
    const { compare, reset } = useCsrfCheck();

    const [isError, setIsError] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [tokenInfo, setTokenInfo] = useState<KakaoTokenInterface | NaverTokenInterface>();

    const { mutate: getKakaoToken } = useMutation(
        (code: string) => KakaoAuthApi.requestToken(code, true),
        {
            onSuccess: (data) => setTokenInfo(data),
            onError: () => setIsError(true),
        }
    )

    const { mutate: getNaverToken } = useMutation(
        (code: string) => NaverAuthApi.requestToken('authorization_code', code), 
        {
            onSuccess: (data) => setTokenInfo(data),
            onError: () => getTokenFromServer(code)
        }
    )

    const { mutate: getTokenFromServer } = useMutation(
        (code: string) => MemberAPI.getTokenFromServer(code),
        {
            onSuccess: (data) => setTokenInfo(data),
            onError: () => setIsError(true)
        }
    )

    const { mutate: withdrawTokenMember } = useMutation(
        (accessToken: string) => MemberAPI.withdrawTokenMember(accessToken),
        {
            onSuccess: () => {
                setIsCompleted(true);
                dispatch(resetAccessTokenState());
            },
            onError: () => setIsError(true)
        }
    )

    useEffect(() => {
        if (!error && code && !isError) {
            if (platform === AUTH_PLATFORM.KAKAO) {
                getKakaoToken(code);
            } else if (platform === AUTH_PLATFORM.NAVER && compare(state)) {
                reset();
                getNaverToken(code);
            } else {
                setIsError(true);
            }
        } else {
            setIsError(true);
        }
    }, [code, state, error])

    useEffect(() => {
        if (tokenInfo) withdrawTokenMember(tokenInfo.access_token);
    }, [tokenInfo])

    return (
        <>
            {
                isError ? <>
                    <Result
                        status="500"
                        title='에러가 발생하였습니다.'
                        subTitle="다시 시도해주세요."
                        extra={<Button type="primary" onClick={() => navigate(ROUTES.MAIN_VIEW.path)}>홈으로</Button>}
                    />
                </> : <>{isCompleted ? (
                    <div className={styles.completion_container}>
                        <Result
                            status="success"
                            title="회원 탈퇴가 완료되었습니다."
                            subTitle="그 동안 FOOTBOLIC을 이용해주셔서 감사합니다."
                            extra={<Button type="primary" onClick={() => navigate(ROUTES.MAIN_VIEW.path)}>홈으로</Button>}
                        />
                    </div>
                ) : (
                    <Skeleton active />
                )}</>
            }
        </>
    )
}

export default MemberWithdraw