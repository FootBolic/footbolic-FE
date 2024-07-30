import { FloatButton, Layout } from 'antd';
import styles from './styles/app/App.module.scss'
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Sider from './components/sider/Sider';
import Breadcrumb from './components/breadcrumb/Breadcrumb';
import { Route, Routes } from 'react-router-dom';
import { ROUTES } from './constants/common/RouteConstants';
import { useEffect } from 'react';
import useDocumentSize from './hooks/useDocumentSize';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile } from './reducers/PlatformReducer';
import { MOBILE_SIZE } from './constants/common/ViewConstants';
import { RootStateInterface } from './types/reducers/RootStateInterface';
import MobilMenuDrawer from './components/drawer/MobileMenuDrawer';
import useToken from './hooks/useToken';
import { RouteInterface } from './types/common/RouteInterface';
import { MessageOutlined } from "@ant-design/icons";

const { Content } = Layout;

function App () {
  const dispatch = useDispatch();
  const { width: windowWidth } = useDocumentSize();
  const { checkRefreshToken, isCheckRefreshTokenError, checkAccessToken } = useToken();
  const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);
  const authError = useSelector((state: RootStateInterface) => state.authError.isError);
  const accessToken = useSelector((state: RootStateInterface) => state.accessToken.accessToken);

  useEffect(() => {
    dispatch(setIsMobile({ isMobile: windowWidth < MOBILE_SIZE }))
  }, [windowWidth])

  useEffect(() => {
    if (authError && !isCheckRefreshTokenError) checkRefreshToken();
  }, [authError])

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
              <Routes>
                {
                  Object.keys(ROUTES).map((key, idx) => {
                    const route: RouteInterface = (ROUTES as any)[key];  
                    return <Route key={idx} path={route.path} element={<route.element /> } 
                    />
                })}
              </Routes>
          </div>
        </Content>
        <Footer />
      </Layout>
      <FloatButton.Group>
        {
          accessToken && <FloatButton type='primary' icon={<MessageOutlined />} />
        }
        <FloatButton.BackTop visibilityHeight={1} />
      </FloatButton.Group>
    </Layout>
  );
};

export default App;