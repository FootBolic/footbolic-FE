import { Typography, message } from "antd";
import CommentWrite from "./CommentWrite";
import CommentDetails from "./CommentDetails";
import { CommentSectionProps } from "../../types/components/comment/CommentSectionProps";
import { useEffect, useState } from "react";

const { Title } = Typography;

function CommentSection({ comments, onSaveComment }: CommentSectionProps) {
    const [size, setSize] = useState<number>(0);

    useEffect(() => {
        let sum = comments.length;
        for (let c of comments) sum += c.replies?.length || 0;
        setSize(sum);
    }, [comments])


    return (
        <>
            <Title level={4}>{size}개의 댓글</Title>
            <div>
                {comments.map((comment, idx) => 
                    <CommentDetails key={idx} comment={comment} onSaveComment={onSaveComment} />
                )}
            </div>
            <CommentWrite
                onSaveComment={() => {
                    onSaveComment && onSaveComment();
                    message.success('댓글이 저장되었습니다.');
                }}
            />
        </>
    )
}

export default CommentSection;