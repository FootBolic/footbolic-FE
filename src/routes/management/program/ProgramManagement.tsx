import { useState } from "react";
import ManagementLayout from "../../../components/layout/ManagementLayout";
import SearchBar from "../../../components/search/SearchBar";
import Title from "../../../components/title/Title";
import styles from "../../../styles/routes/management/program/ProgramManagement.module.scss";
import { ProgramSearchInterface } from "../../../types/entity/program/ProgramInterface";
import { SEARCH_TYPES } from "../../../constants/components/SearchBarConstants";

function ProgramManagement() {

    const [search, setSearch] = useState<ProgramSearchInterface>();

    return (
        <>
            <Title title="프로그램 관리" buttons={[{ text: "프로그램추가", onClick: () => {} }]} />
            <ManagementLayout 
                isFetching={false} 
                isError={false} 
                searchBar={
                    <SearchBar 
                        defaultValues={search}
                        elements={[
                            { label: '제목', name: 'title', type: SEARCH_TYPES.INPUT, maxLength: 20, placeholder: '제목을 입력해주세요.' },
                            { label: '코드', name: 'code', type: SEARCH_TYPES.INPUT, maxLength: 20, placeholder: '코드를 입력해주세요.' }
                        ]}
                        onSearch={(result) => setSearch(result)}
                        onReset={() => setSearch(undefined)}
                    />
                }
            />
        </>
    )
}

export default ProgramManagement;