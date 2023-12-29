import { Layout } from 'antd';
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

const { Content } = Layout;

const App = () => {

  const { width: windowWidth } = useDocumentSize();
  const dispatch = useDispatch();
  const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);
  
  useEffect(() => {
    dispatch(setIsMobile({ isMobile: windowWidth < MOBILE_SIZE }))
  }, [windowWidth])

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
              {/* 메인페이지 */}
              <Route path={ROUTES.MAIN_VIEW.path} element={<ROUTES.MAIN_VIEW.element />} />
            </Routes>
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default App;