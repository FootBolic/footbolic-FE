import { ColumnProps } from "../layout/ManagementLayoutProps"

export type TableProps = {
    columns: ColumnProps[];
    dataSource: object[];
    page: number;
    size: number;
    onPageChange: (value: number) => void;
}