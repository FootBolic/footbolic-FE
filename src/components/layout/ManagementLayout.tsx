import { Skeleton } from "antd";
import { ManagementLayoutProps } from "../../types/components/layout/ManagementLayoutProps";
import Error from "../error/Error";

function ManagementLayout({ isFetching, isError, children }: ManagementLayoutProps) {
    return (
        <>
            {
                isFetching ? <Skeleton active /> : <>
                    {
                        isError ? <Error /> : (
                            <>
                                {children}
                            </>
                        )
                    }
                </>
            }
        </>
    )
}

export default ManagementLayout;