import Banner from "../../components/banner/Banner";
import styles from "../../styles/routes/main/MainView.module.scss"
import { Card, Divider, FloatButton, List, Tabs } from 'antd';
import { 
    AndroidOutlined,
    AppleOutlined,
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    PicCenterOutlined
} from '@ant-design/icons';
import SimpleTable from "../../components/table/SimpleTable";
import { RESPONSIVE_GRID } from "../../constants/common/ViewConstants";

const listData:any[] = [];
const tabData:any[] = [];
const icons = [
    AndroidOutlined,
    AppleOutlined,
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    PicCenterOutlined
]

const boards = [
    '인기 게시글',
    '최신 게시글',
    '프리미어리그',
    '라리가',
    '분데스리가',
    '세리에A',
    '챔피언스리그',
    '월드컵'
]

for (let i=0; i< boards.length; i++) {
    const tmp = [];
    for (let j = 1; j <= 10; j++) {
        tmp.push({
            title: `${boards[i]} Test Data Title ${j}`,
            createdAt: [2024, 6, 10, 10, 57, 35, 25],
            createdBy: {
                nickname: `테스트 작성자 ${i}_${j}`
            }
        })
    }
    if (i < 2) listData.push(tmp)
    else tabData.push(tmp)
}

function MainView () {

    return (
        <>
            <div className={styles.main_el}>
                <Banner />
            </div>
            <Divider />
            <div className={styles.main_el}>
                <Tabs
                    centered
                    defaultActiveKey="1"
                    items={tabData.map((board, i) => {
                        const id = String(i + 1);
                        const Icon = icons[i];
                        return {
                            key: id,
                            label: boards[i+2],
                            children: (
                                <Card>
                                    <SimpleTable dataSource={board} />
                                </Card>
                            ),
                            icon: <Icon />,
                        };
                    })}
                />
            </div>
            <Divider />
            <div className={styles.main_el}>
                <List
                    grid={RESPONSIVE_GRID}
                    dataSource={listData}
                    renderItem={(item, index) => (
                        <List.Item>
                            <Card title={boards[index]} bodyStyle={{ padding: '0' }}>
                                <SimpleTable dataSource={item} size="small" />
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
            <FloatButton.BackTop visibilityHeight={1} />
        </>
    )
}

export default MainView;