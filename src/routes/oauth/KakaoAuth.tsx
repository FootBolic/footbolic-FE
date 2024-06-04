import { Button, Result, message } from "antd";
import useURLParam from "../../hooks/useURLParam";
import { useNavigate } from "react-router-dom";
import { API_QUERY_KEYS, AUTH_PLATFORM } from "../../constants/common/DataConstants";
import { KakaoAuthAPI } from "../../api/oauth/KakaoAuthAPI";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { MemberInterface } from "../../types/entity/member/MemberInterface";
import { MemberAPI } from "../../api/member/MemberAPI";
import { KakaoTokenInterface } from "../../types/common/KakaoApiInterface";
import { SignAPI } from "../../api/sign/SignAPI";
import { useDispatch } from "react-redux";
import { setAccessTokenState } from "../../reducers/AccessTokenReducer";
import { toDate } from "../../util/DateUtil";
import { ROUTES } from "../../constants/common/RouteConstants";


function KakaoAuth () {
    const { code, error } = useURLParam();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorTitle, setErrorTitle] = useState<string>("");
    const [member, setMember] = useState<MemberInterface>({ id: '', platform: AUTH_PLATFORM.KAKAO });
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

    const { mutate: getToken } = useMutation(
        (code: string) => KakaoAuthAPI.requestToken(code, false), 
        {
            onSuccess: (data) => {
                setTokenInfo(data);
                getUserInfo(data.access_token);
            },
            onError: () => setIsError(true),
        }
    )

    const { mutate: getUserInfo } = useMutation(
        (data: string) => KakaoAuthAPI.getUserInfo(data),
        {
            onSuccess: (data) => {
                setMember({ ...member, idAtProvider: `${data.id}` } as MemberInterface);
                setIsFetching(true);
            },
            onError: () => setIsError(true),
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
                tokenInfo?.access_token && invalidateKakaoToken(tokenInfo?.access_token);
                queryClient.invalidateQueries([API_QUERY_KEYS.MENU.GET_MENUS_BY_AUTH]);
                message.success(`${data.nickname} 님 반갑습니다!`);
                navigate(ROUTES.MAIN_VIEW.path);
            },
            onError: (e: Error) => {
                setIsError(true);
                setErrorTitle(e.message);
            }
        }
    )

    const { mutate: invalidateKakaoToken } = useMutation(
        (accessToken: string) => KakaoAuthAPI.invalidateToken(accessToken)
    )

    const handleMemberNotExists = () => {
        tokenInfo?.access_token && invalidateKakaoToken(tokenInfo.access_token);
        navigate(ROUTES.MEMBER_CREATE.path, { state: { member } });
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
                        extra={<Button type="primary" onClick={() => navigate(ROUTES.MAIN_VIEW.path)}>홈으로</Button>}
                    />
                </>
            }
        </>
    )
}

export default KakaoAuth;


