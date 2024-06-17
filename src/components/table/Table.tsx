import { Table as AntTable, Pagination } from "antd";
import { BOARD_PAGE_SIZE } from "../../constants/common/DataConstants";
import styles from "../../styles/components/table/Table.module.scss";
import { TableProps } from "../../types/components/table/TableProps";

function Table({ columns, dataSource, page, size, onPageChange }: TableProps) {
    return (
        <>
            <div className={styles.board_container}>
                <AntTable 
                    pagination={false}
                    columns={columns}
                    dataSource={dataSource}
                />
            </div>
            <div className={styles.pagination_container}>
                <Pagination
                    showSizeChanger={false}
                    pageSize={BOARD_PAGE_SIZE}
                    defaultCurrent={page}
                    total={size}
                    onChange={onPageChange}
                />
            </div>
        </>
    )
}

export default Table;