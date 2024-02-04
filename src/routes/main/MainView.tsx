import Banner from "../../components/banner/Banner";
import styles from "../../styles/routes/main/MainView.module.scss"
import { Card, List, Tabs } from 'antd';
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
import { MemberAPI } from "../../api/member/MemberAPI";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";

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
            createdAt: new Date()
        })
    }
    if (i < 2) listData.push(tmp)
    else tabData.push(tmp)
}

function MainView () {

    const queryClient = useQueryClient();

    const [memberId, setMemberId] = useState<string>('');

    const {} = useQuery({
        queryKey: ['getMembers'],
        queryFn: () => MemberAPI.getMembers(),
        onSuccess: (data) => console.log(data)
    });

    const { mutate: createMember } = useMutation(
        () => MemberAPI.createMember(),
        {
            onSuccess: (data) => {
                console.log(data);
                setMemberId(data.data.data.id);
                queryClient.invalidateQueries('getMembers');
            }
        }
    );

    const { mutate: updateMember } = useMutation(
        (id: string) => MemberAPI.updateMember(id),
        {
            onSuccess: (data) => {
                console.log(data);
                queryClient.invalidateQueries('getMembers');
            }
        }
    )

    const { mutate: deleteMember } = useMutation(
        (id: string) => MemberAPI.deleteMember(id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('getMembers');
            }
        }
    )

    const handleCreate = () => {
        createMember();
    }

    const handleUpdate = () => {
        updateMember(memberId);
    }

    const handleDelete = () => {
        deleteMember(memberId);
    }

    return (
        <>
            <button onClick={handleCreate}>create</button>
            <button onClick={handleUpdate}>update</button>
            <button onClick={handleDelete}>delete</button>
            <div className={styles.main_el}>
                <Banner />
            </div>
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
        </>
    )
}

export default MainView;