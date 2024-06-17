import { Card, Modal, Space, Typography, message } from "antd";
import { CommentDetailsProps } from "../../types/components/comment/CommentDetailsProps";
import { toDatetimeString } from "../../util/DateUtil";
import styles from "../../styles/components/comment/CommentDetails.module.scss";
import { CloseOutlined, EnterOutlined, EditOutlined, DeleteOutlined, RightOutlined, HeartTwoTone, HeartFilled } from "@ant-design/icons";
import { useState } from "react";
import CommentWrite from "./CommentWrite";
import { SpaceSpan } from "../html/HtmlElements";
import { useMutation, useQuery } from "react-query";
import { CommentAPI } from "../../api/comment/CommentAPI";
import ReplyDetails from "../reply/ReplyDetails";
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";
import { RecommendationAPI } from "../../api/recommendation/RecommendationAPI";
import { API_QUERY_KEYS } from "../../constants/common/DataConstants";

const { Text } = Typography;

function CommentDetails({ comment, onSaveComment, onCommentRecommendationChange, onReplyRecommendationChange }: CommentDetailsProps) {
    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const { mutate: deleteComment } = useMutation(
        (id: string) => CommentAPI.deleteComment(id),
        {
            onSuccess: () => {
                onSaveComment && onSaveComment();
                message.success('댓글이 삭제되었습니다.');
            },
            onError: (e: string) => {message.error(e)}
        }
    )

    const { refetch } = useQuery({
        queryFn: () => RecommendationAPI.getRecommendations("comment", comment.id),
        queryKey: [API_QUERY_KEYS.RECOMMENDATION.GET_RECOMMENDATIONS + `_${comment.id}`],
        enabled: false,
        onSuccess: (result) => onCommentRecommendationChange && onCommentRecommendationChange(comment.id, result.size, result.isRecommended)
    })

    const { mutate: recommend, isLoading: isLoadingRecommendation } = useMutation(
        (objectId: string) => RecommendationAPI.recommend("comment", objectId),
        {
            onSuccess: () => refetch()
        }
    )

    const { mutate: unrecommend, isLoading: isLoadingUnrecommendation } = useMutation(
        (objectId: string) => RecommendationAPI.unrecommend("comment", objectId),
        {
            onSuccess: () => refetch()
        }
    )

    return (
        <>
            <Card bodyStyle={{ width: '100%' }} className={styles.card}>
                <Space direction="vertical" className={styles.container}>
                    <Text type="secondary">
                        {comment.createdBy?.nickname}
                        {isMobile ? <br /> : <><SpaceSpan />·<SpaceSpan /></>}
                        {comment.createdAt && toDatetimeString(comment.createdAt)}
                        {isMobile ? <br/> : <><SpaceSpan />·<SpaceSpan /></>}
                        <a onClick={() => setIsReplying(!isReplying)}>
                            {isReplying ? <>
                                답글 취소 <CloseOutlined />
                            </> : <>
                                답글 <EnterOutlined />
                            </>}
                        </a>
                        {comment.isEditable && (
                            <>
                                <a onClick={() => setIsEditing(!isEditing)}>
                                    <SpaceSpan />·<SpaceSpan />
                                    {isEditing ? <>
                                        수정 취소 <CloseOutlined />
                                    </> :<>
                                        수정 <EditOutlined />
                                    </>}
                                </a>
                                <a onClick={() => setIsDeleteModalOpen(true)}>
                                    <SpaceSpan />·<SpaceSpan />
                                    삭제 <DeleteOutlined />
                                </a>
                            </>
                        )}
                        <SpaceSpan />·<SpaceSpan />
                        <a 
                            onClick={() => {
                                if (isLoadingRecommendation || isLoadingUnrecommendation) return;
                                comment.isRecommended ? unrecommend(comment.id) : recommend(comment.id);
                            }}
                        >
                            {comment.isRecommended ? <HeartFilled className={styles.heart} /> : <HeartTwoTone twoToneColor="rgb(255, 47, 47)" />}
                            <SpaceSpan />
                            {comment.recommendationsSize}
                        </a>
                    </Text>
                    {isEditing ? (
                        <CommentWrite
                            isUpdate
                            commentId={comment.id}
                            content={comment.content}
                            onSaveComment={() => {
                                onSaveComment && onSaveComment();
                                message.success('댓글이 수정되었습니다.');
                            }}
                        />
                    ) : (
                        <div className={styles.comment}>
                            <Text>{comment.content}</Text>
                        </div>
                    )}
                    {comment.replies?.map((reply, idx) => 
                        <ReplyDetails 
                            key={idx}
                            reply={reply}
                            onSaveReply={onSaveComment}
                            onRecommendationChange={onReplyRecommendationChange} 
                        />
                    )}
                    {isReplying && (
                        <div className={styles.reply_container}>
                            <div className={styles.arrow}>
                                <RightOutlined />
                            </div>
                            <div className={styles.comment}>
                                <CommentWrite 
                                    isReply
                                    commentId={comment.id}
                                    onSaveComment={() => {
                                        onSaveComment && onSaveComment();
                                        message.success('답글이 저장되었습니다.');
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </Space>
                <Modal
                    title='댓글 삭제'
                    open={isDeleteModalOpen}
                    onOk={() => deleteComment(comment.id)}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    okText='삭제'
                    cancelText='취소'
                    okButtonProps={{ danger: true }}
                >
                    <Text>댓글을 삭제하시겠습니까?</Text>
                </Modal>
            </Card>
        </>
    )
}

export default CommentDetails;