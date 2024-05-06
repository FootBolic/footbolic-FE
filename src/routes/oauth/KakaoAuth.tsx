import { Button, Result } from "antd";
import useURLParam from "../../hooks/useURLParam";
import { useNavigate } from "react-router-dom";
import { API_QUERY_KEYS, AUTH_PLATFORM, DATE_FORMAT, KAKAO_AUTH_ERROR_DESCRIPTIONS } from "../../constants/common/DataConstants";
import { KakaoAuthApi } from "../../api/oauth/KakaoAuthApi";
import { useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import { MemberAPI } from "../../api/member/MemberAPI";
import { KakaoTokenInterface } from "../../types/common/KakaoApiInterface";
import dayjs from "dayjs";


function KakaoAuth () {
    const { code, error, error_description } = useURLParam();
    const navigate = useNavigate();

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorTitle, setErrorTitle] = useState<string>("");
    const [member, setMember] = useState<MemberInterface>({ id: '', roleId: import.meta.env.VITE_DEFAULT_ROLE_ID, platform: AUTH_PLATFORM.KAKAO });
    const [tokenInfo, setTokenInfo] = useState<KakaoTokenInterface>();

    const {} = useQuery({
        queryKey: [API_QUERY_KEYS.MEMBER.GET_MEMBER_BY_ID_AT_PLATFORM],
        queryFn: () => MemberAPI.getMemberByIdAtPlatform(member?.idAtProvider ?? '', AUTH_PLATFORM.KAKAO),
        onSuccess: (result) => {
            if (result.memberExists) {
                console.log('로그인 처리')
            } else {
                tokenInfo && navigate('/member/create', {
                    state: {
                        member: {
                            ...member,
                            refreshToken: tokenInfo.refresh_token,
                            refreshTokenExpiresAt: dayjs(new Date().getTime() + (Number(tokenInfo.refresh_token_expires_in) * 1000)).format(DATE_FORMAT),
                            accessToken: tokenInfo.access_token,
                            idToken: tokenInfo.id_token,
                            accessTokenExpiresAt: dayjs(new Date().getTime() + (Number(tokenInfo.expires_in) * 1000)).format(DATE_FORMAT),
                            scope: tokenInfo.scope,
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

    const { mutate: getToken } = useMutation((code: string) => KakaoAuthApi.getToken(code), {
        onSuccess: (data) => {
            setTokenInfo(data);
            getUserInfo(data.access_token);
        },
        onError: () => setIsError(true),
    })

    const { mutate: getUserInfo } = useMutation((data: string) => KakaoAuthApi.getUserInfo(data), {
        onSuccess: (data) => {
            setMember({ ...member, idAtProvider: `${data.id}` } as MemberInterface);
            setIsFetching(true);
        }
    })

    useEffect(() => {
        if (code) {
            getToken(code);
        } else if (error) {
            setIsError(true);
            error_description === KAKAO_AUTH_ERROR_DESCRIPTIONS.CANCELLATION && setErrorTitle('로그인이 취소되었습니다');
        }
    }, [code, error, error_description])

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

export default KakaoAuth;


