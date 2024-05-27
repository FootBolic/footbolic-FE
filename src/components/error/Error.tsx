import { Button, Result } from "antd"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../constants/common/RouteConstants";
import { ErrorProps } from "../../types/components/error/ErrorProps";

function Error({title, subTitle, to}: ErrorProps) {
    const navigate = useNavigate();

    return (
        <Result
            status="500"
            title={title || '에러가 발생하였습니다.'}
            subTitle={subTitle || "다시 시도해주세요."}
            extra={<Button type="primary" onClick={() => navigate(to || ROUTES.MAIN_VIEW.path)}>홈으로</Button>}
        />
    )
}

export default Error