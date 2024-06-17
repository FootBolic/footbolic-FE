import { ReactElement } from "react";

export type TitleProps = {
    title: string;
    buttons?: ButtonProps[];
    centered?: true;
    Icon?: ReactElement;
}

export type ButtonProps = {
    text: string;
    danger?: boolean;
    type?: "link" | "text" | "primary" | "default" | "dashed";
    hidden?: boolean;
    onClick: React.MouseEventHandler<HTMLElement> ;
}