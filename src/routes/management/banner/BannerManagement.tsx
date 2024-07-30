import { Form, message, Input, Upload, Button, Switch, DatePicker, UploadFile } from "antd";
import { useState, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "react-query";
import { BannerAPI } from "../../../api/banner/BannerAPI";
import ManagementLayout from "../../../components/layout/ManagementLayout";
import SearchBar from "../../../components/search/SearchBar";
import { API_QUERY_KEYS, BOARD_PAGE_SIZE, DATE_FORMAT, UPLOAD_ALLOWED_EXTENSIONS } from "../../../constants/common/DataConstants";
import { BannerSearchInterface, BannerInterface } from "../../../types/entity/banner/BannerInterface";
import Title from "../../../components/title/Title";
import { UploadOutlined } from "@ant-design/icons";
import { fileApi } from "../../../api/api";
import { FileAPI } from "../../../api/file/FileAPI";
import { toDayjsDate } from "../../../util/DateUtil";
import { FileInterface } from "../../../types/entity/file/FileInterface";

function BannerManagement() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [enabled, setEnabled] = useState<boolean>(true);
    const [checked, setChecked] = useState<boolean>(false);
    const [fileId, setFileId] = useState<string>("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
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
        onSuccess: (result) => {
            setBanner(result.banner);
            setChecked(result.banner.isTimeLimited || false);
            if (result.banner.isTimeLimited)
                form.setFieldValue("times", [toDayjsDate(result.banner.startsAt as number[]), toDayjsDate(result.banner.endsAt as number[])])
        },
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
        setChecked(false);
    }, [page, search])

    useEffect(() => {
        setChecked(false);
        bannerId ? refetchBanner() : setBanner(undefined);
    }, [bannerId])

    useEffect(() => {
        if (banner) {
            !banner.isTimeLimited && form.setFieldValue("times", [null, null])
            form.setFieldsValue(banner);

            if (banner.file) {
                setFiles(banner.file);
                setFileId(banner.fileId!);
            }
        } else {
            setChecked(false);
            form.resetFields();
            setFileList([]);
        }
    }, [banner])

    const handleInsertBanner = () => {
        setBannerId("");
        (banner && !banner?.id) ? setBanner(undefined) 
            : setTimeout(() => setBanner({ title: "신규 배너" } as BannerInterface), 5);
    }

    const handleFinish = () => {
        const target: BannerInterface = {
            ...banner!,
            ...form.getFieldsValue(),
            fileId,
            startsAt: checked ? form.getFieldValue("times")[0].format(DATE_FORMAT) : null,
            endsAt: checked ? form.getFieldValue("times")[1].format(DATE_FORMAT) : null,
            file: null,
            times: null
        };

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
            fileId && fileId !== banner?.fileId && deleteFile(fileId);
            setFileId(createdFile.id);
            setFiles(createdFile);
        } else {
            setFileId("");
            setFileList([]);
        }
    }

    const validateImage = () => {
        if (!fileList?.length) return Promise.reject(new Error("이미지는 필수입력 항목입니다."));

        return Promise.resolve();
    }

    const setFiles = (data: FileInterface) => {
        setFileList([{
            uid: data.id,
            status: 'done',
            name: `${data.originalName}.${data.extension}`,
            thumbUrl: `${import.meta.env.VITE_API_URL_DEV}/files/public/images/${data.id}`
        }]);
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
                            },
                            {
                                label: '게시일자',
                                name: 'date',
                                type: 'date',
                                placeholder: '게시일자를 선택해주세요.'
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
                            name='image'
                            label='이미지'
                            valuePropName="image"
                            required
                            rules={[{ validator: validateImage }]}
                            validateTrigger={['onBlur']}
                        >
                            <Upload
                                customRequest={handleUploadImage}
                                listType="picture"
                                maxCount={1}
                                fileList={fileList}
                                beforeUpload={(file) => {
                                    const isImage = UPLOAD_ALLOWED_EXTENSIONS.includes(file.type);
                                    !isImage && message.error(`PNG 파일 또는 JPG 파일만 허용됩니다.`);
                                    return isImage || Upload.LIST_IGNORE;
                                }}
                                onRemove={() => {
                                    fileId && deleteFile(fileId);
                                    setFileId("");
                                    setFileList([]);
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item name='link' label='링크'>
                            <Input placeholder='링크를 입력해주세요.' maxLength={200} />
                        </Form.Item>
                        <Form.Item name='isMobile' label='모바일 배너 여부'>
                            <Switch />
                        </Form.Item>
                        <Form.Item name='isTimeLimited' label='게시 기간 제한 여부'>
                            <Switch 
                                onChange={(val) => {
                                    setChecked(val);
                                    val && form.setFieldValue("times", [
                                        banner?.startsAt ? toDayjsDate(banner.startsAt as number[]) : null,
                                        banner?.endsAt ? toDayjsDate(banner.endsAt as number[]) : null
                                    ])
                                }} 
                            />
                        </Form.Item>
                        <Form.Item hidden={!checked} name='times' label='게시 기간'>
                            <DatePicker.RangePicker showTime />
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