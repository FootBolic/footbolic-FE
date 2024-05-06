import Icon from '@ant-design/icons';
import { Avatar } from 'antd';
import styles from '../../styles/components/sign/SignInCard.module.scss';
import Kakao from '../../assets/kakao.png';
import Naver from '../../assets/naver.png';
import useCsrfCheck from '../../hooks/useCsrfCheck';

function SignInCard () {

    const { issue } = useCsrfCheck();

    const handleKakaoSignIn = () => {
        const kakaoApiUrl = 'https://kauth.kakao.com/oauth/authorize?response_type=code'
                                + `&client_id=${import.meta.env.VITE_KAKAO_API_KEY}`
                                + `&redirect_uri=${import.meta.env.VITE_KAKAO_RET_URI}`;
        location.href = kakaoApiUrl;
    }

    const handleNaverSignIn = () => {
        const authCsrfState = issue(30);
        const naverApiUrl = 'https://nid.naver.com/oauth2.0/authorize?response_type=code'
                                + `&client_id=${import.meta.env.VITE_NAVER_CLIENT_ID}&state=${authCsrfState}`
                                + `&redirect_uri=${import.meta.env.VITE_NAVER_RET_URI}`;
        location.href = naverApiUrl;   
    }

    return (
        <div className={styles.icon_container}>
            <Avatar
                className={styles.icon}
                size="large"
                icon={<Icon component={() => <img className={styles.icon_image_kakao} src={Kakao} />} />}
                onClick={handleKakaoSignIn}
            />
            <Avatar
                className={styles.icon}
                size="large"
                icon={<Icon component={() => <img className={styles.icon_image_naver} src={Naver} />} />}
                onClick={handleNaverSignIn}
            />
        </div>
    )
}

export default SignInCard;