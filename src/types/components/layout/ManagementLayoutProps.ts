import { FormInstance } from "antd";
import { ReactNode } from "react";

export type ManagementLayoutProps = {
    isFetching: boolean;
    isError: boolean;
    searchBar?: ReactNode;
    cardContentType: 'table' | 'tree';
    cardData: object[];
    cardTableColumns?: ColumnProps[];
    cardTablePage?: number;
    cardTableSize?: number;
    onCardPageChange?: (val: number) => any;
    formInstance: FormInstance<any>;
    formDisabled?: boolean;
    formElements?: ReactNode;
    formDeleteButtonDisabled?: boolean;
    isDeletable?: boolean | true;
    onSave: ((values: any) => void);
    onDelete?: () => void;
}

export type ColumnProps = {
    className?: string;
    title: string;
    dataIndex: string;
    key: string;
    width: string;
    ellipsis?: boolean | false;
    render: (val: any, record: any) => ReactNode;
}