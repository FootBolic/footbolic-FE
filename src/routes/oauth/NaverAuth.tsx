import { Button, Result } from "antd";
import useURLParam from "../../hooks/useURLParam";
import { useNavigate } from "react-router-dom";
import { API_QUERY_KEYS, AUTH_PLATFORM } from "../../constants/common/DataConstants";
import { useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import { MemberAPI } from "../../api/member/MemberAPI";
import useCsrfCheck from "../../hooks/useCsrfCheck";
import { NaverAuthApi } from "../../api/oauth/NaverAuthApi";
import { NaverTokenInterface } from "../../types/common/NaverApiInterface";
import { SignAPI } from "../../api/sign/SignAPI";
import { useDispatch } from "react-redux";
import { setAccessTokenState } from "../../reducers/AccessTokenReducer";
import { toDate } from "../../util/DateUtil";
import { ROUTES } from "../../constants/common/RouteConstants";


function NaverAuth () {
    const { code, state, error } = useURLParam();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { compare, reset } = useCsrfCheck();

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorTitle, setErrorTitle] = useState<string>("");
    const [member, setMember] = useState<MemberInterface>({ id: '', platform: AUTH_PLATFORM.NAVER });
    const [tokenInfo, setTokenInfo] = useState<NaverTokenInterface>();

    const {} = useQuery({
        queryKey: [API_QUERY_KEYS.MEMBER.GET_MEMBER_BY_ID_AT_PLATFORM],
        queryFn: () => MemberAPI.getMemberByIdAtPlatform(member?.idAtProvider ?? '', AUTH_PLATFORM.NAVER),
        onSuccess: (result) => result.memberExists ? signIn(member) : tokenInfo && navigate(ROUTES.MEMBER_CREATE.path, { state: { member } }),
        onError: (e: Error) => {
            setIsError(true);
            setErrorTitle(e.message);
        },
        enabled: isFetching
    })

    const handleGetTokenSuccess = (data: NaverTokenInterface) => {
        setTokenInfo(data);
        setTimeout(() => getUserInfo({ token_type: data.token_type, access_token: data.access_token}), 500);
    }

    const { mutate: getToken } = useMutation(
        (code: string) => NaverAuthApi.requestToken('authorization_code', code), 
        {
            onSuccess: handleGetTokenSuccess,
            onError: () => getTokenFromServer(code)
        }
    )

    const { mutate: getTokenFromServer } = useMutation(
        (code: string) => MemberAPI.getTokenFromServer(code),
        {
            onSuccess: handleGetTokenSuccess,
            onError: () => setIsError(true)
        }
    )

    const handleGetUserInfoSuccess = (data: MemberInterface) => {
        setMember({ ...member, idAtProvider: data.id } as MemberInterface);
        setIsFetching(true);
    }

    const { mutate: getUserInfo } = useMutation(
        ({ token_type, access_token }: { token_type: string, access_token: string }) => NaverAuthApi.getUserInfo(token_type, access_token),
        {
            onSuccess: handleGetUserInfoSuccess,
            onError: () => getUserInfoFromServer({ token_type: tokenInfo?.token_type ?? '', access_token: tokenInfo?.access_token ?? '' })
        }
    )

    const { mutate: getUserInfoFromServer } = useMutation(
        ({ token_type, access_token }: { token_type: string, access_token: string }) => MemberAPI.getUserInfoFromServer(token_type, access_token),
        {
            onSuccess: handleGetUserInfoSuccess,
            onError: () => setIsError(true)
        }
    )

    const { mutate: signIn } = useMutation(
        (member: MemberInterface) => SignAPI.signIn(member),
        {
            onSuccess: (data) => {
                dispatch(setAccessTokenState({
                    accessToken: data.access_token,
                    accessTokenExpiresAt: toDate(data.expires_at).getTime(),
                    nickname: data.nickname
                }))
                navigate(ROUTES.MAIN_VIEW.path);
            },
            onError: (e: Error) => {
                setIsError(true);
                setErrorTitle(e.message);
            }
        }
    )

    useEffect(() => {
        if (compare(state) && code && !isError) {
            reset();
            getToken(code);
        } else {
            setIsError(true);
        }
    }, [code, state, error])

    return (
        <>
            {
                isError && <>
                    <Result
                        status="500"
                        title={errorTitle || '에러가 발생하였습니다.'}
                        subTitle="다시 시도해주세요."
                        extra={<Button type="primary" onClick={() => navigate(ROUTES.MAIN_VIEW.path)}>홈으로</Button>}
                    />
                </>
            }
        </>
    )
}

export default NaverAuth;