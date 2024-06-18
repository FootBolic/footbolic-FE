import { Form, message, Input } from "antd";
import { useState, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "react-query";
import { IconAPI } from "../../../api/icon/IconAPI";
import ManagementLayout from "../../../components/layout/ManagementLayout";
import SearchBar from "../../../components/search/SearchBar";
import Title from "../../../components/title/Title";
import { API_QUERY_KEYS, BOARD_PAGE_SIZE } from "../../../constants/common/DataConstants";
import { IconSearchInterface, IconInterface } from "../../../types/entity/icon/IconInterface";

function IconManagement() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(0);
    const [search, setSearch] = useState<IconSearchInterface>();
    const [icon, setIcon] = useState<IconInterface>();
    const [iconId, setIconId] = useState<string>("");
    const [allIcons, setAllIcons] = useState<IconInterface[]>([]);

    const { isFetching: isFetchingAll, isError: isErrorAll, refetch: refetchAll } = useQuery({
        queryKey: [API_QUERY_KEYS.PROGRAM.GET_PROGRAMS],
        queryFn: () => IconAPI.getIcons(page-1, BOARD_PAGE_SIZE, search),
        onSuccess: (result) => {
            setAllIcons(result.icons);
            setSize(result.size);
        },
        onError: (e: string) => message.error(e),
    })

    const { isFetching: isFetchingIcon, isError: isErrorIcon, refetch: refetchIcon } = useQuery({
        queryKey: [API_QUERY_KEYS.PROGRAM.GET_PROGRAM],
        queryFn: () => IconAPI.getIcon(iconId),
        enabled: false,
        onSuccess: (result) => setIcon(result.icon),
        onError: (e: string) => message.error(e),
    })

    const { mutate: createIcon } = useMutation(
        (icon: IconInterface) => IconAPI.createIcon(icon),
        {
            onSuccess: (result) => handleSuccess(true, result.createdIcon),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: updateIcon } = useMutation(
        (icon: IconInterface) => IconAPI.updateIcon(icon),
        {
            onSuccess: (result) => handleSuccess(true, result.updatedIcon),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: deleteIcon } = useMutation(
        (id: string) => IconAPI.deleteIcon(id),
        {
            onSuccess: () => handleSuccess(false, { id: "" }),
            onError: (e: string) => {message.error(e)}
        }
    )

    useEffect(() => {
        refetchAll();
        setIconId("");
    }, [page, search])

    useEffect(() => {
        iconId ? refetchIcon() : setIcon(undefined);
    }, [iconId])

    useEffect(() => {
        icon ? form.setFieldsValue(icon) : form.resetFields();
    }, [icon])

    const handleInsertIcon = () => {
        setIconId("");
        (icon && !icon?.id) ? setIcon(undefined) 
            : setTimeout(() => setIcon({ title: "신규 아이콘" } as IconInterface), 5);
    }

    const handleFinish = () => {
        const target: IconInterface = {  ...icon!, ...form.getFieldsValue() };
        icon!.id ? updateIcon(target) : createIcon(target);
    }

    const handleSuccess = (isSave: boolean, result: IconInterface) => {
        message.success(`아이콘이 ${isSave ? '저장' : '삭제'}되었습니다.`);
        refetchAll();
        setIconId(isSave ? result.id :  '');
        queryClient.invalidateQueries([API_QUERY_KEYS.MENU.GET_MENUS_BY_AUTH]);
    }

    return (
        <>
            <Title 
                title="아이콘 관리" 
                buttons={[{ text: "아이콘추가", onClick: handleInsertIcon }]}
                icon="ICON_PREMIER_LEAGUE"
            />
            <ManagementLayout 
                isFetching={isFetchingAll} 
                isError={isErrorAll} 
                searchBar={
                    <SearchBar 
                        defaultValues={search}
                        elements={[
                            { 
                                label: '제목', 
                                name: 'title', 
                                type: 'input', 
                                maxLength: 20, 
                                placeholder: '제목을 입력해주세요.' 
                            },
                            { 
                                label: '코드',
                                name: 'code',
                                type: 'input',
                                maxLength: 20,
                                placeholder: '코드를 입력해주세요.' 
                            }
                        ]}
                        onSearch={(result) => setSearch(result)}
                        onReset={() => setSearch(undefined)}
                    />
                }
                cardContentType="table"
                cardTableColumns={
                    [
                        {
                            dataIndex: 'title',
                            key: 'title',
                            title: '제목',
                            width: 'auto',
                            render: (t, r: IconInterface) => 
                                <a onClick={() => setIconId(iconId === r.id ? "" : r.id)}>{t}</a>
                        },
                        {
                            dataIndex: 'code',
                            key: 'code',
                            title: '코드',
                            width: '40%',
                            render: (t) => t,
                        }
                    ]
                }
                cardData={allIcons}
                cardTablePage={page}
                cardTableSize={size}
                onCardPageChange={(val) => setPage(val)}
                isDeletable
                formInstance={form}
                formDeleteButtonDisabled={!iconId}
                formDisabled={!icon || isFetchingIcon || isErrorIcon}
                formElements= {
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
                        <Form.Item
                            name='code'
                            label='코드'
                            rules={[
                                {
                                    required: true,
                                    message: "코드는 필수입력 항목입니다."
                                }
                            ]}
                            validateTrigger={['onBlur']}
                        >
                            <Input placeholder='코드를 입력해주세요.' maxLength={20} />
                        </Form.Item>
                    </>
                }
                onSave={handleFinish}
                onDelete={() => deleteIcon(icon!.id)}
            />
        </>
    )
}

export default IconManagement;