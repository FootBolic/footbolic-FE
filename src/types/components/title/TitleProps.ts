export type TitleProps = {
    title: string;
    buttons?: ButtonProps[];
    centered?: true;
    icon?: string;
}

export type ButtonProps = {
    text: string;
    danger?: boolean;
    type?: "link" | "text" | "primary" | "default" | "dashed";
    hidden?: boolean;
    onClick: React.MouseEventHandler<HTMLElement> ;
}