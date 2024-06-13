import { Card, Modal, Space, Typography, message } from "antd";
import { CommentDetailsProps } from "../../types/components/comment/CommentDetailsProps";
import { toDatetimeString } from "../../util/DateUtil";
import styles from "../../styles/components/comment/CommentDetails.module.scss";
import { CloseOutlined, EnterOutlined, EditOutlined, DeleteOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import CommentWrite from "./CommentWrite";
import { SpaceSpan } from "../html/HtmlElements";
import { useMutation } from "react-query";
import { CommentAPI } from "../../api/comment/CommentAPI";

const { Text } = Typography;

function CommentDetails({ comment, onSaveComment }: CommentDetailsProps) {
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

    return (
        <>
            <Card bodyStyle={{ width: '100%' }}>
                <Space direction="vertical" className={styles.container}>
                    <Text className={styles.comment_info} type="secondary">
                        {comment.createdBy?.nickname}<SpaceSpan />·<SpaceSpan />
                        {comment.createdAt && toDatetimeString(comment.createdAt)}<SpaceSpan />·<SpaceSpan /> 
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
                                    <SpaceSpan />·<SpaceSpan />삭제 <DeleteOutlined />
                                </a>
                            </>
                        )}
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
                        <Text>{comment.content}</Text>
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