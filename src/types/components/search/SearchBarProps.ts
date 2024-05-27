import { DefaultOptionType } from "antd/es/select";

export type SearchBarProps = {
    defaultValues?: any;
    elements: SearchBarElementProps[];
    onSearch: (a: any) => any;
    onReset: () => any;
}

export type SearchBarElementProps = {
    label: string;
    name: string;
    type: string;
    options?: DefaultOptionType[];
    maxLength?: number;
    placeholder?: string;
}