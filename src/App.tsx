import { Layout } from 'antd';
import styles from './styles/app/App.module.scss'
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Sider from './components/sider/Sider';
import Breadcrumb from './components/breadcrumb/Breadcrumb';
import { useState } from 'react';

const { Content } = Layout;

const App = () => {

  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className={styles.main_layout}>
      <Sider collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Header collapsed={collapsed} />
        <Content className={styles.content}>
          <Breadcrumb />
          <div className={styles.content_div}>
            Bill is a cat.
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default App;