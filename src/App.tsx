import { Button, Layout, Result } from 'antd';
import styles from './styles/app/App.module.scss'
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Sider from './components/sider/Sider';
import Breadcrumb from './components/breadcrumb/Breadcrumb';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ROUTES } from './constants/common/RouteConstants';
import { useEffect } from 'react';
import useDocumentSize from './hooks/useDocumentSize';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile } from './reducers/PlatformReducer';
import { MOBILE_SIZE } from './constants/common/ViewConstants';
import { RootStateInterface } from './types/reducers/RootStateInterface';
import MobilMenuDrawer from './components/drawer/MobileMenuDrawer';
import { ResultStatusType } from 'antd/es/result';
import { resetApiError } from './reducers/ApiErrorReducer';
import useToken from './hooks/useToken';

const { Content } = Layout;

function App () {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { width: windowWidth } = useDocumentSize();
  const { checkRefreshToken, isCheckRefreshTokenError, checkAccessToken } = useToken();
  const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);
  const apiError = useSelector((state: RootStateInterface) => state.apiError);
  const accessToken = useSelector((state: RootStateInterface) => state.accessToken.accessToken);

  useEffect(() => {
    dispatch(setIsMobile({ isMobile: windowWidth < MOBILE_SIZE }))
  }, [windowWidth])

  useEffect(() => {
    if (apiError.isError && apiError.status === 403 && !isCheckRefreshTokenError) checkRefreshToken();
  }, [apiError])

  useEffect(() => {
    accessToken && checkAccessToken();
  }, [accessToken])

  return (
    <Layout hasSider>
      <Sider />
      <MobilMenuDrawer />
      <Layout className={styles.main_layout}>
        <Header />
        <Content className={isMobile ? styles.mobile_layout : styles.content}>
          <Breadcrumb />
          <div className={styles.content_div}>
            {apiError.isError ? <Result
                status={apiError.status as ResultStatusType  || "500"}
                title={apiError.title}
                subTitle="다시 시도해주세요."
                extra={<Button type="primary" onClick={() => {
                  dispatch(resetApiError());
                  navigate('/');
                }}>홈으로</Button>}
              /> : <Routes>
                {/* 메인페이지 */}
                <Route path={ROUTES.MAIN_VIEW.path} element={<ROUTES.MAIN_VIEW.element />} />
                {/* 메뉴관리 목록 */}
                <Route path={ROUTES.MENU_MANAGEMENT_LIST.path} element={<ROUTES.MENU_MANAGEMENT_LIST.element />} />
                {/* 카카오 API 회원가입 및 로그인 */}
                <Route path={ROUTES.KAKAO_AUTH.path} element={<ROUTES.KAKAO_AUTH.element />} />
                {/* 네이버 API 회원가입 및 로그인 */}
                <Route path={ROUTES.NAVER_AUTH.path} element={<ROUTES.NAVER_AUTH.element />} />
                {/* 회원가입 - 회원 정보 입력 */}
                <Route path={ROUTES.MEMBER_CREATE.path} element={<ROUTES.MEMBER_CREATE.element />} />
              </Routes>
            }
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default App;