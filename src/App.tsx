import { Layout } from 'antd';
import styles from './App.module.scss'
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Sider from './components/sider/Sider';
import Breadcrumb from './components/breadcrumb/Breadcrumb';

const { Content } = Layout;

const App = () => {
  return (
    <Layout className={styles.main_layout}>
      <Sider />
      <Layout>
        <Header />
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