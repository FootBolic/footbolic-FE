import { Button, Result } from "antd";
import useURLParam from "../../hooks/useURLParam";
import { useNavigate } from "react-router-dom";
import { API_QUERY_KEYS, AUTH_PLATFORM } from "../../constants/common/DataConstants";
import { KakaoAuthApi } from "../../api/oauth/KakaoAuthApi";
import { useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import { MemberAPI } from "../../api/member/MemberAPI";
import { KakaoTokenInterface } from "../../types/common/KakaoApiInterface";
import { SignAPI } from "../../api/sign/SignAPI";
import { useDispatch } from "react-redux";
import { setAccessTokenState } from "../../reducers/AccessTokenReducer";
import { toDate } from "../../util/DateUtil";


function KakaoAuth () {
    const { code, error } = useURLParam();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorTitle, setErrorTitle] = useState<string>("");
    const [member, setMember] = useState<MemberInterface>({ id: '', roleId: import.meta.env.VITE_DEFAULT_ROLE_ID, platform: AUTH_PLATFORM.KAKAO });
    const [tokenInfo, setTokenInfo] = useState<KakaoTokenInterface>();

    const {} = useQuery({
        queryKey: [API_QUERY_KEYS.MEMBER.GET_MEMBER_BY_ID_AT_PLATFORM],
        queryFn: () => MemberAPI.getMemberByIdAtPlatform(member?.idAtProvider ?? '', AUTH_PLATFORM.KAKAO),
        onSuccess: (result) => result.memberExists ? signIn(member) : tokenInfo && handleMemberNotExists(),
        onError: (e: Error) => {
            setIsError(true);
            setErrorTitle(e.message);
        },
        enabled: isFetching
    })

    const { mutate: getToken } = useMutation((code: string) => KakaoAuthApi.requestToken(code), {
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

    const { mutate: signIn } = useMutation(
        (member: MemberInterface) => SignAPI.signIn(member),
        {
            onSuccess: (data) => {
                dispatch(setAccessTokenState({
                    accessToken: data.access_token,
                    accessTokenExpiresAt: toDate(data.expires_at).getTime(),
                    nickname: data.nickname
                }))
                tokenInfo?.access_token && invalidateKakaoToken(tokenInfo?.access_token);
                navigate('/');
            },
            onError: (e: Error) => {
                setIsError(true);
                setErrorTitle(e.message);
            }
        }
    )

    const { mutate: invalidateKakaoToken } = useMutation(
        (accessToken: string) => KakaoAuthApi.invalidateToken(accessToken)
    )

    const handleMemberNotExists = () => {
        tokenInfo?.access_token && invalidateKakaoToken(tokenInfo.access_token);
        navigate('/member/create', { state: { member } });
    }

    useEffect(() => {
        code && !isError ? getToken(code) : setIsError(true);
    }, [code, error])

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


