import { useEffect, useState } from "react";
import ManagementLayout from "../../../components/layout/ManagementLayout";
import SearchBar from "../../../components/search/SearchBar";
import Title from "../../../components/title/Title";
import { ProgramInterface, ProgramSearchInterface } from "../../../types/entity/program/ProgramInterface";
import { API_QUERY_KEYS, BOARD_PAGE_SIZE } from "../../../constants/common/DataConstants";
import { ProgramAPI } from "../../../api/program/ProgramAPI";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form, Input, message } from "antd";

function ProgramManagement() {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [enabled, setEnabled] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(0);
    const [search, setSearch] = useState<ProgramSearchInterface>();
    const [program, setProgram] = useState<ProgramInterface>();
    const [programId, setProgramId] = useState<string>("");
    const [allPrograms, setAllPrograms] = useState<ProgramInterface[]>([]);

    const { isFetching: isFetchingAll, isError: isErrorAll, refetch: refetchAll } = useQuery({
        queryKey: [API_QUERY_KEYS.PROGRAM.GET_PROGRAMS],
        queryFn: () => ProgramAPI.getPrograms(page-1, BOARD_PAGE_SIZE, search),
        enabled: enabled,
        onSuccess: (result) => {
            setEnabled(false);
            setAllPrograms(result.programs);
            setSize(result.size);
        },
        onError: (e: string) => message.error(e),
    })

    const { isFetching: isFetchingProgram, isError: isErrorProgram, refetch: refetchProgram } = useQuery({
        queryKey: [API_QUERY_KEYS.PROGRAM.GET_PROGRAM],
        queryFn: () => ProgramAPI.getProgram(programId),
        enabled: false,
        onSuccess: (result) => setProgram(result.program),
        onError: (e: string) => message.error(e),
    })

    const { mutate: createProgram } = useMutation(
        (program: ProgramInterface) => ProgramAPI.createProgram(program),
        {
            onSuccess: (result) => handleSuccess(true, result.createdProgram),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: updateProgram } = useMutation(
        (program: ProgramInterface) => ProgramAPI.updateProgram(program),
        {
            onSuccess: (result) => handleSuccess(true, result.updatedProgram),
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: deleteProgram } = useMutation(
        (id: string) => ProgramAPI.deleteProgram(id),
        {
            onSuccess: () => handleSuccess(false, { id: "" }),
            onError: (e: string) => {message.error(e)}
        }
    )

    useEffect(() => {
        refetchAll();
        setProgramId("");
    }, [page, search])

    useEffect(() => {
        programId ? refetchProgram() : setProgram(undefined);
    }, [programId])

    useEffect(() => {
        program ? form.setFieldsValue(program) : form.resetFields();
    }, [program])

    const handleInsertProgram = () => {
        setProgramId("");
        (program && !program?.id) ? setProgram(undefined) 
            : setTimeout(() => setProgram({ title: "신규 프로그램" } as ProgramInterface), 5);
    }

    const handleFinish = () => {
        const target: ProgramInterface = {  ...program!, ...form.getFieldsValue() };
        program!.id ? updateProgram(target) : createProgram(target);
    }

    const handleSuccess = (isSave: boolean, result: ProgramInterface) => {
        message.success(`프로그램이 ${isSave ? '저장' : '삭제'}되었습니다.`);
        refetchAll();
        setProgramId(isSave ? result.id :  '');
        queryClient.invalidateQueries([API_QUERY_KEYS.MENU.GET_MENUS_BY_AUTH]);
    }

    return (
        <>
            <Title title="프로그램 관리" buttons={[{ text: "프로그램추가", onClick: handleInsertProgram }]} />
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
                            render: (t, r: ProgramInterface) => 
                                <a onClick={() => setProgramId(programId === r.id ? "" : r.id)}>{t}</a>
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
                cardData={allPrograms}
                cardTablePage={page}
                cardTableSize={size}
                onCardPageChange={(val) => setPage(val)}
                isDeletable
                formInstance={form}
                formDeleteButtonDisabled={!programId}
                formDisabled={!program || isFetchingProgram || isErrorProgram}
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
                        <Form.Item name='path' label='경로'>
                            <Input placeholder='경로를 입력해주세요.' maxLength={100} />
                        </Form.Item>
                    </>
                }
                onSave={handleFinish}
                onDelete={() => deleteProgram(program!.id)}
            />
        </>
    )
}

export default ProgramManagement;