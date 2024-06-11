import { Typography } from "antd";
import CommentWrite from "./CommentWrite";

const { Title } = Typography

function CommentSection() {
    return (
        <>
            <Title level={4}>댓글</Title>
            <CommentWrite />
        </>
    )
}

export default CommentSection;