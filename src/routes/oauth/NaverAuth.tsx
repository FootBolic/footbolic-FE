import { Button, Result } from "antd";
import useURLParam from "../../hooks/useURLParam";
import { useNavigate } from "react-router-dom";
import { API_QUERY_KEYS, AUTH_PLATFORM, DATE_FORMAT } from "../../constants/common/DataConstants";
import { useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import { MemberAPI } from "../../api/member/MemberAPI";
import dayjs from "dayjs";
import useCsrfCheck from "../../hooks/useCsrfCheck";
import { NaverAuthApi } from "../../api/oauth/NaverAuthApi";
import { NaverTokenInterface } from "../../types/common/NaverApiInterface";


function NaverAuth () {
    const { code, state, error, error_description } = useURLParam();
    const navigate = useNavigate();
    const { compare, reset } = useCsrfCheck();

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorTitle, setErrorTitle] = useState<string>("");
    const [member, setMember] = useState<MemberInterface>({ id: '', roleId: import.meta.env.VITE_DEFAULT_ROLE_ID, platform: AUTH_PLATFORM.NAVER });
    const [tokenInfo, setTokenInfo] = useState<NaverTokenInterface>();

    const {} = useQuery({
        queryKey: [API_QUERY_KEYS.MEMBER.GET_MEMBER_BY_ID_AT_PLATFORM],
        queryFn: () => MemberAPI.getMemberByIdAtPlatform(member?.idAtProvider ?? '', AUTH_PLATFORM.NAVER),
        onSuccess: (result) => {
            if (result.memberExists) {
                console.log('로그인 처리')
            } else {
                tokenInfo && navigate('/member/create', {
                    state: {
                        member: {
                            ...member,
                            refreshToken: tokenInfo.refresh_token,
                            accessToken: tokenInfo.access_token,
                            accessTokenExpiresAt: dayjs(new Date().getTime() + (Number(tokenInfo.expires_in) * 1000)).format(DATE_FORMAT),
                            tokenType: tokenInfo.token_type
                        }
                    }
                })
            }
        },
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

    const { mutate: getUserInfo } = useMutation(
        ({ token_type, access_token }: { token_type: string, access_token: string }) => NaverAuthApi.getUserInfo(token_type, access_token),
        {
            onSuccess: (data) => {
                setMember({ ...member, idAtProvider: data.id } as MemberInterface);
                setIsFetching(true);
            },
            onError: () => getUserInfoFromServer({ token_type: tokenInfo?.token_type ?? '', access_token: tokenInfo?.access_token ?? '' })
        }
    )

    const { mutate: getUserInfoFromServer } = useMutation(
        ({ token_type, access_token }: { token_type: string, access_token: string }) => MemberAPI.getUserInfoFromServer(token_type, access_token),
        {
            onSuccess: (data) => {
                setMember({ ...member, idAtProvider: data.id } as MemberInterface);
                setIsFetching(true);
            },
            onError: () => setIsError(true)
        }
    )

    useEffect(() => {
        if (compare(state)) {
            reset();
            code ? getToken(code) : setIsError(true);
        } else {
            setIsError(true);
        }
    }, [code, state, error, error_description])

    return (
        <>
            {
                isError && <>
                    <Result
                        status="500"
                        title={errorTitle || '에러가 발생하였습니다.'}
                        subTitle="다시 시도해주세요."
                        extra={<Button type="primary" onClick={() => navigate('/')}>홈으로</Button>}
                    />
                </>
            }
        </>
    )
}

export default NaverAuth;