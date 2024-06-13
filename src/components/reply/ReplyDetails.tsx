import { ReplyLayoutProps } from "../../types/components/layout/ReplyLayoutProps";
import { CloseOutlined, EditOutlined, DeleteOutlined, RightOutlined } from "@ant-design/icons";
import styles from "../../styles/components/layout/ReplyLayout.module.scss";
import { Card, Modal, Space, Typography, message } from "antd";
import { useState } from "react";
import { SpaceSpan } from "../html/HtmlElements";
import { toDatetimeString } from "../../util/DateUtil";
import CommentWrite from "../comment/CommentWrite";
import { ReplyAPI } from "../../api/reply/ReplyAPI";
import { useMutation } from "react-query";

const { Text } = Typography;

function ReplyDetails({ reply, onSaveReply }: ReplyLayoutProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const { mutate: deleteReply } = useMutation(
        (id: string) => ReplyAPI.deleteReply(id),
        {
            onSuccess: () => {
                onSaveReply && onSaveReply();
                message.success('답글이 삭제되었습니다.');
            },
            onError: (e: string) => {message.error(e)}
        }
    )

    return (
        <>
            <div className={styles.reply_container}>
                <div className={styles.arrow}>
                    <RightOutlined />
                </div>
                <Card bodyStyle={{ width: '100%', paddingTop: 0, paddingBottom: 0 }} className={styles.comment}>
                    <Space direction="vertical" className={styles.container}>
                        <Text type="secondary">
                            {reply.createdBy?.nickname}
                            <SpaceSpan />·<SpaceSpan />
                            {reply.createdAt && toDatetimeString(reply.createdAt)}
                            {reply.isEditable && (
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
                        </Text>
                        {isEditing ? (
                            <CommentWrite
                                isUpdate
                                isReply
                                commentId={reply.commentId}
                                replyId={reply.id}
                                content={reply.content}
                                onSaveComment={() => {
                                    onSaveReply && onSaveReply();
                                    message.success('답글이 수정되었습니다.');
                                }}
                            />
                        ) : (
                            <Text>{reply.content}</Text>
                        )}
                    </Space>
                    <Modal
                        title='답글 삭제'
                        open={isDeleteModalOpen}
                        onOk={() => deleteReply(reply.id)}
                        onCancel={() => setIsDeleteModalOpen(false)}
                        okText='삭제'
                        cancelText='취소'
                        okButtonProps={{ danger: true }}
                    >
                        <Text>답글을 삭제하시겠습니까?</Text>
                    </Modal>
                </Card>
            </div>
        </>
    )
}

export default ReplyDetails;