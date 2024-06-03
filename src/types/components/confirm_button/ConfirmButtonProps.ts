export type ConfirmButtonProps = {
    data: (any & { id: string, isDeleted: boolean, title: string })[];
    confirmText?: string;
    popOpen: string;
    setPopOpen: Function;
    onConfirm: (p: any) => any;
}