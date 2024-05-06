import { useMutation, useQuery, useQueryClient } from "react-query";
import Title from "../../../components/title/Title";
import { MenuAPI } from "../../../api/menu/MenuAPI";
import { Key, useEffect, useState } from "react";
import Tree from "../../../components/tree/Tree";
import { Card, Form, Input, TreeSelect, Button, Modal, Typography, message, Switch } from "antd";
import styles from "../../../styles/routes/management/menu/MenuManagementList.module.scss";
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../../types/reducers/RootStateInterface";
import useMenuManagement from "../../../hooks/useMenuManagement";
import { MenuInterface } from "../../../types/entity/menu/MenuInterface";
import { API_QUERY_KEYS, MUTATION_TYPES } from "../../../constants/common/DataConstants";

const { Text } = Typography;

function MenuManagementList () {

    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);

    const [selectionKeys, setSelectionKeys] = useState<Key[]>([]);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    
    const { 
        targetMenu,
        setTargetMenu,
        optionMenus,
        treeNodeMenus,
        setAllMenus,
        handleSelectionChange,
        handleInsertMenu,
        isIdenticalMenus
    } = useMenuManagement();

    const { isFetching, isError } = useQuery({
        queryKey: [API_QUERY_KEYS.MENU.GET_MENUS],
        queryFn: () => MenuAPI.getMenus(),
        onSuccess: (result) => setAllMenus(result),
    })

    const { mutate: createMenu } = useMutation((data : MenuInterface) => MenuAPI.createMenu(data), {
        onSuccess: () => handleMutateCompleted(MUTATION_TYPES.CREATE)
    })

    const { mutate: updateMenu } = useMutation((data : MenuInterface) => MenuAPI.updateMenu(data), {
        onSuccess: () => handleMutateCompleted(MUTATION_TYPES.UPDATE)
    })

    const { mutate: deleteMenu } = useMutation((id: string) => MenuAPI.deleteMenu(id), {
        onSuccess: () => handleMutateCompleted(MUTATION_TYPES.DELETE)
    })

    useEffect(() => {
        form.setFieldValue("title", targetMenu?.title);
        form.setFieldValue("parentId", targetMenu?.parentId);
        form.setFieldValue("path", targetMenu?.path);
        form.setFieldValue("isUsed", targetMenu?.isUsed);
    }, [targetMenu])

    const handleMutateCompleted = (type: string) => {
        queryClient.invalidateQueries(API_QUERY_KEYS.MENU.GET_MENUS);
        setTargetMenu(null);
        if (type === MUTATION_TYPES.DELETE) {
            setIsDeleteModalOpen(false);
            message.success('메뉴가 삭제되었습니다.');
        } else {
            setIsSaveModalOpen(false);
            type === 'CREATE' ? message.success('메뉴가 생성되었습니다.') : message.success('메뉴가 수정되었습니다.');
        }
    }

    /**
     * 현재 select된 메뉴에 form 데이터를 입력한 후 id가 있으면 메뉴수정, 없으면 메뉴생성 API 실행
     * @param {MenuInterface} menu form에 입력된 데이터
     */
    const handleSaveMenu = (menu: MenuInterface) => {
        const currentMenu: MenuInterface = { 
            ...targetMenu,
            title: menu.title,
            parentId: menu.parentId,
            path: menu.path,
            isUsed: menu.isUsed
        } as MenuInterface;
        currentMenu.id ? updateMenu(currentMenu) : createMenu(currentMenu);
    }

    return (
        <>
            <Title title="메뉴관리" buttons={[{text: '메뉴추가', onClick: handleInsertMenu}]} />
            {
                isFetching ? <></> : (
                    isError ? <></> : (
                        <div className={isMobile ? styles.mobile_container : styles.container}>
                            <div className={styles.card_container}>
                                <Card className={styles.card}>
                                    <Tree showLine={true} data={treeNodeMenus} onSelect={(keys) => {
                                        setSelectionKeys(keys);
                                        (targetMenu && !isIdenticalMenus(targetMenu, {
                                            ...targetMenu,
                                            title: form.getFieldValue('title'),
                                            parentId: form.getFieldValue('parentId'),
                                            path: form.getFieldValue('path'),
                                            isUsed: form.getFieldValue('isUsed')
                                        } as MenuInterface)) ? setIsConfirmModalOpen(true) : handleSelectionChange(keys);
                                    }} />
                                </Card>
                            </div>
                            <div className={styles.form_container}>
                                <Form form={form} layout="vertical" disabled={!targetMenu} onFinish={handleSaveMenu} >
                                    <Form.Item
                                        name='title'
                                        label='제목'
                                        rules={[
                                            {
                                                required: true,
                                                message: "제목은 필수입력 항목입니다."
                                            }
                                        ]}
                                        validateTrigger={['onBlur']}
                                    >
                                        <Input placeholder='제목을 입력해주세요.' maxLength={20} />
                                    </Form.Item>
                                    <Form.Item name='parentId' label='상위메뉴'>
                                        <TreeSelect
                                            placeholder='선택된 항목이 없을 시 최상위 메뉴로 등록됩니다.'
                                            treeData={optionMenus}
                                            treeDefaultExpandAll
                                            style={{ width: '100%' }}
                                            value={targetMenu?.parentId}
                                            allowClear
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name='path'
                                        label='경로'
                                        rules={[
                                            {
                                                required: true,
                                                message: "경로는 필수입력 항목입니다."
                                            }
                                        ]}
                                        validateTrigger={['onBlur']}
                                    >
                                        <Input
                                            placeholder='경로를 입력해주세요.'
                                            maxLength={100}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name='isUsed'
                                        label='사용여부'
                                        rules={[
                                            {
                                                required: true,
                                                message: "사용여부는 필수입력 항목입니다."
                                            }
                                        ]}
                                        validateTrigger={['onBlur']}
                                    >
                                        <Switch />
                                    </Form.Item>
                                    <Form.Item className={styles.button_container}>
                                        <Button type='primary' onClick={() => setIsSaveModalOpen(true)}>
                                            저장
                                        </Button>
                                        <Modal
                                            title='메뉴 저장'
                                            open={isSaveModalOpen}
                                            onOk={() => form.submit()}
                                            onCancel={() => setIsSaveModalOpen(false)}
                                            okText='확인'
                                            cancelText='취소'
                                        >
                                            <Text>메뉴를 저장하시겠습니까?</Text>
                                        </Modal>
                                        <Button danger type='primary' onClick={() => setIsDeleteModalOpen(true)}>
                                            삭제
                                        </Button>
                                        <Modal
                                            title='메뉴 삭제'
                                            open={isDeleteModalOpen}
                                            onOk={() => targetMenu?.id ? deleteMenu(targetMenu.id) : message.error('삭제할 메뉴를 선택해주세요.')}
                                            onCancel={() => setIsDeleteModalOpen(false)}
                                            okText='삭제'
                                            cancelText='취소'
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Text>메뉴를 삭제하시겠습니까?<br/>하위의 메뉴도 함께 삭제됩니다.</Text>
                                        </Modal>
                                    </Form.Item>
                                </Form>
                            </div>
                            <Modal
                                open={isConfirmModalOpen}
                                onOk={() => {
                                    handleSelectionChange(selectionKeys);
                                    setIsConfirmModalOpen(false);
                                }}
                                onCancel={() => setIsConfirmModalOpen(false)}
                                okText='확인'
                                cancelText='취소'
                            >
                                <Text>저장되지 않은 변경사항은 지워집니다.</Text>
                            </Modal>
                        </div>
                    )
                )
            }
        </>
    )
}

export default MenuManagementList;