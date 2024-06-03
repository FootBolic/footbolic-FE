import { ReactNode } from "react";

export type ManagementLayoutProps = {
    isFetching: boolean;
    isError: boolean;
    children: ReactNode;
}