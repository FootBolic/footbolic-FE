import { useMutation, useQuery, useQueryClient } from "react-query";
import Title from "../../../components/title/Title";
import { MenuAPI } from "../../../api/menu/MenuAPI";
import { useEffect, useState } from "react";
import { Form, Input, TreeSelect, message, Switch, Select } from "antd";
import { MenuInterface } from "../../../types/entity/menu/MenuInterface";
import { API_QUERY_KEYS } from "../../../constants/common/DataConstants";
import ManagementLayout from "../../../components/layout/ManagementLayout";
import { getOptionMenus, getTreeNodeMenus, toOption } from "../../../util/DataUtil";
import { ProgramAPI } from "../../../api/program/ProgramAPI";

function MenuManagement () {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [allMenus, setAllMenus] = useState<MenuInterface[]>([]);
    const [menuId, setMenuId] = useState<string>("");
    const [menu, setMenu] = useState<MenuInterface>();
    const [selectedKey, setSelectedKey] = useState<React.Key[]>([]);

    const { isFetching: isFetchingAll, isError: isErrorAll, refetch: refetchAll } = useQuery({
        queryKey: [API_QUERY_KEYS.MENU.GET_MENUS],
        queryFn: () => MenuAPI.getMenus(),
        onSuccess: (result) => setAllMenus(result.menus),
        onError: (e: string) => message.error(e)
    })

    const { isFetching: isFetchingMenu, isError: isErrorMenu, refetch: refetchMenu } = useQuery({
        queryKey: [API_QUERY_KEYS.MENU.GET_MENU_BY_ID],
        queryFn: () => MenuAPI.getMenuById(menuId),
        onSuccess: (result) => setMenu(result.menu),
        onError: (e: string) => message.error(e),
        enabled: false
    })

    const { data: programs } = useQuery({
        queryKey: [API_QUERY_KEYS.PROGRAM.GET_ALL_PROGRAMS],
        queryFn: () => ProgramAPI.getAllprograms(),
        onError: (e: string) => message.error(e)
    })

    const { mutate: createMenu } = useMutation(
        (data : MenuInterface) => MenuAPI.createMenu(data), 
        {
            onSuccess: (result) => handleSuccess(true, result.createdMenu),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: updateMenu } = useMutation(
        (data : MenuInterface) => MenuAPI.updateMenu(data),
        {
            onSuccess: (result) => handleSuccess(true, result.updatedMenu),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: deleteMenu } = useMutation(
        (id: string) => MenuAPI.deleteMenu(id), 
        {
            onSuccess: () => handleSuccess(false, { id: '' } as MenuInterface),
            onError: (e: string) => {message.error(e)}
        }
    )

    useEffect(() => {
        menuId ? refetchMenu() : setMenu(undefined);
    }, [menuId])

    useEffect(() => {
        menu ? form.setFieldsValue(menu) : form.resetFields();
    }, [menu])

    const handleInsertMenu = () => {
        setMenuId("");
        (menu && !menu.id) ? setMenu(undefined) 
            : setTimeout(() => setMenu({ title: "신규 메뉴" } as MenuInterface), 5);
    }

    const handleFinish = () => {
        const target: MenuInterface = { 
            ...menu!,
            ...form.getFieldsValue()
        };
        menu!.id ? updateMenu(target) : createMenu(target);
    }

    const handleSuccess = (isSave: boolean, result: MenuInterface) => {
        message.success(`메뉴가 ${isSave ?  '저장' : '삭제'}되었습니다.`);
        refetchAll();
        setMenuId(isSave ? result.id : '');
        queryClient.invalidateQueries([API_QUERY_KEYS.MENU.GET_MENUS_BY_AUTH]);
    }

    return (
        <>
            <Title title="메뉴관리" buttons={[{text: '메뉴추가', onClick: handleInsertMenu}]} />
            <ManagementLayout
                isFetching={isFetchingAll}
                isError={isErrorAll}
                cardContentType="tree"
                cardData={getTreeNodeMenus(allMenus)}
                cardTreeDefaultExpandAll
                cardTreeSelectedKeys={selectedKey}
                onTreeSelect={(keys) => {
                    setSelectedKey(keys);
                    setMenuId(keys.length ? keys[0].toString() : "");
                }}
                isDeletable
                formInstance={form}
                formDeleteButtonDisabled={!menuId}
                formDisabled={!menu || isFetchingMenu || isErrorMenu}
                formElements={
                    <>
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
                                treeData={menu && getOptionMenus(allMenus, menu)}
                                treeDefaultExpandAll
                                style={{ width: '100%' }}
                                value={menu?.parentId}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item
                            name='order'
                            label='순서'
                            rules={[
                                {
                                    required: true,
                                    message: "순서는 필수입력 항목입니다."
                                },
                                {
                                    pattern: /^[0-9]+$/,
                                    message: "순서는 자연수만 입력 가능합니다."
                                }
                            ]}
                            validateTrigger={['onBlur']}
                        >
                            <Input
                                type="number"
                                placeholder='경로를 입력해주세요.'
                                maxLength={100}
                            />
                        </Form.Item>
                        <Form.Item name='programId' label='프로그램'>
                            <Select 
                                placeholder="프로그램을 선택해주세요."
                                options={programs && toOption("title", "id", programs?.programs)}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item name='isUsed' label='사용여부'>
                            <Switch />
                        </Form.Item>
                    </>
                }
                onSave={handleFinish}
                onDelete={() => deleteMenu(menu!.id)}
            />
        </>
    )
}

export default MenuManagement;