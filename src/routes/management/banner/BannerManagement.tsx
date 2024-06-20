import { Form, message, Input, Upload, Button } from "antd";
import { useState, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "react-query";
import { BannerAPI } from "../../../api/banner/BannerAPI";
import ManagementLayout from "../../../components/layout/ManagementLayout";
import SearchBar from "../../../components/search/SearchBar";
import { API_QUERY_KEYS, BOARD_PAGE_SIZE } from "../../../constants/common/DataConstants";
import { BannerSearchInterface, BannerInterface } from "../../../types/entity/banner/BannerInterface";
import Title from "../../../components/title/Title";
import { UploadOutlined } from "@ant-design/icons";
import { fileApi } from "../../../api/api";
import { FileAPI } from "../../../api/file/FileAPI";

function BannerManagement() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [enabled, setEnabled] = useState<boolean>(true);
    const [fileId, setFileId] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(0);
    const [search, setSearch] = useState<BannerSearchInterface>();
    const [banner, setBanner] = useState<BannerInterface>();
    const [bannerId, setBannerId] = useState<string>("");
    const [allBanners, setAllBanners] = useState<BannerInterface[]>([]);

    const { isFetching: isFetchingAll, isError: isErrorAll, refetch: refetchAll } = useQuery({
        queryKey: [API_QUERY_KEYS.PROGRAM.GET_PROGRAMS],
        queryFn: () => BannerAPI.getBanners(page-1, BOARD_PAGE_SIZE, search),
        enabled: enabled,
        onSuccess: (result) => {
            setEnabled(false);
            setAllBanners(result.banners);
            setSize(result.size);
        },
        onError: (e: string) => message.error(e),
    })

    const { isFetching: isFetchingBanner, isError: isErrorBanner, refetch: refetchBanner } = useQuery({
        queryKey: [API_QUERY_KEYS.PROGRAM.GET_PROGRAM],
        queryFn: () => BannerAPI.getBanner(bannerId),
        enabled: false,
        onSuccess: (result) => setBanner(result.banner),
        onError: (e: string) => message.error(e),
    })

    const { mutate: createBanner } = useMutation(
        (banner: BannerInterface) => BannerAPI.createBanner(banner),
        {
            onSuccess: (result) => handleSuccess(true, result.createdBanner),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: updateBanner } = useMutation(
        (banner: BannerInterface) => BannerAPI.updateBanner(banner),
        {
            onSuccess: (result) => handleSuccess(true, result.updatedBanner),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: deleteBanner } = useMutation(
        (id: string) => BannerAPI.deleteBanner(id),
        {
            onSuccess: () => handleSuccess(false, { id: "" }),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: deleteFile } = useMutation((id: string) => FileAPI.deleteFile(id));

    useEffect(() => {
        refetchAll();
        setBannerId("");
    }, [page, search])

    useEffect(() => {
        bannerId ? refetchBanner() : setBanner(undefined);
    }, [bannerId])

    useEffect(() => {
        banner ? form.setFieldsValue(banner) : form.resetFields();
    }, [banner])

    const handleInsertBanner = () => {
        setBannerId("");
        (banner && !banner?.id) ? setBanner(undefined) 
            : setTimeout(() => setBanner({ title: "신규 배너" } as BannerInterface), 5);
    }

    const handleFinish = () => {
        const target: BannerInterface = {  ...banner!, ...form.getFieldsValue() };
        banner!.id ? updateBanner(target) : createBanner(target);
    }

    const handleSuccess = (isSave: boolean, result: BannerInterface) => {
        message.success(`배너가 ${isSave ? '저장' : '삭제'}되었습니다.`);
        refetchAll();
        setBannerId(isSave ? result.id :  '');
        queryClient.invalidateQueries([API_QUERY_KEYS.MENU.GET_MENUS_BY_AUTH]);
    }

    const handleUploadImage = async (options: any) => {
        const file = new FormData();
        file.append('file', options.file);

        const response = await fileApi.post('/files', file);

        if (response.data.isSuccess) {
            const createdFile = response.data.data.createdFile;
            fileId && deleteFile(fileId);
            setFileId(createdFile.id)
        } else {
            setFileId("");
        }
    }

    return (
        <>
            <Title title="배너 관리" buttons={[{ text: "배너추가", onClick: handleInsertBanner }]} />
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
                            render: (t, r: BannerInterface) => 
                                <a onClick={() => setBannerId(bannerId === r.id ? "" : r.id)}>{t}</a>
                        }
                    ]
                }
                cardData={allBanners}
                cardTablePage={page}
                cardTableSize={size}
                onCardPageChange={(val) => setPage(val)}
                isDeletable
                formInstance={form}
                formDeleteButtonDisabled={!bannerId}
                formDisabled={!banner || isFetchingBanner || isErrorBanner}
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
                            name='fileId'
                            label='이미지'
                            valuePropName="fileId"
                            rules={[
                                {
                                    required: true,
                                    message: "이미지는 필수입력 항목입니다."
                                }
                            ]}
                            validateTrigger={['onBlur']}
                        >
                            <Upload
                                customRequest={handleUploadImage}
                                listType="picture"
                                maxCount={1}
                                defaultFileList={[]}
                                beforeUpload={(file) => {
                                    const isImage = ['image/png', 'image/jpeg'].includes(file.type);
                                    !isImage && message.error(`PNG 파일 또는 JPG 파일만 허용됩니다.`);
                                    return isImage;
                                }}
                                onChange={(info) => info.file.status = 'done'}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </Form.Item>
                    </>
                }
                onSave={handleFinish}
                onDelete={() => deleteBanner(banner!.id)}
            />
        </>
    )
}

export default BannerManagement