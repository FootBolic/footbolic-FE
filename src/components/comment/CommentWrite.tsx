import { Button, Form, Modal, Typography, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import styles from "../../styles/components/comment/CommentWrite.module.scss";
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { CommentAPI } from "../../api/comment/CommentAPI";
import { CommentInterface } from "../../types/entity/comment/CommentInterface";
import { useState } from "react";
import { CommentWriteProps } from "../../types/components/comment/CommentWriteProps";
import { ReplyAPI } from "../../api/reply/ReplyAPI";
import { ReplyInterface } from "../../types/entity/reply/ReplyInterface";

const { Text } = Typography;

function CommentWrite({ commentId, replyId, isReply, isUpdate, content, hidden, onSaveComment }: CommentWriteProps) {
    const [form] = Form.useForm();
    const { postId } = useParams();
    const isMobile = useSelector((state: RootStateInterface) => state.platform.isMobile);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

    const { mutate: createComment } = useMutation(
        (comment: CommentInterface) => CommentAPI.createComment(comment),
        {
            onSuccess: onSaveComment,
            onError: (e: string) => {message.error(e)}
        }
    )
    
    const { mutate: updateComment } = useMutation(
        (comment: CommentInterface) => CommentAPI.updateComment(comment),
        {
            onSuccess: onSaveComment,
            onError: (e: string) => {message.error(e)}
        }
    )

    const { mutate: createReply } = useMutation(
        (reply: ReplyInterface) => ReplyAPI.createReply(reply),
        {
            onSuccess: onSaveComment,
            onError: (e: string) => {message.error(e)}
        }
    )
    
    const { mutate: updateReply } = useMutation(
        (reply: ReplyInterface) => ReplyAPI.updateReply(reply),
        {
            onSuccess: onSaveComment,
            onError: (e: string) => {message.error(e)}
        }
    )

    return (
        <>
            <div hidden={hidden} className={isMobile ? styles.mobile_container : styles.container}>
                <Form form={form} className={styles.form} onFinish={() => setIsSaveModalOpen(true)}>
                    <Form.Item name='content' style={{ margin: '0' }}>
                        <TextArea defaultValue={content} />
                    </Form.Item>
                    <Modal 
                        title={`${isReply ? '답글' : '댓글'} ${isUpdate ? '수정' : '등록'}`}
                        open={isSaveModalOpen}
                        onOk={() => {
                            if (isReply) {
                                const reply = { ...form.getFieldsValue(), commentId };
                                isUpdate ? updateReply({ id: replyId, ...reply }) : createReply(reply);
                            } else {
                                const comment = { ...form.getFieldsValue(), postId };
                                isUpdate ? updateComment({ id: commentId, ...comment }) : createComment(comment)
                            }
                        }}
                        onCancel={() => setIsSaveModalOpen(false)}
                        okText='확인'
                        cancelText='취소'
                    >
                        <Text>{isReply ? '답글' : '댓글'}을 {isUpdate ? '수정' : '등록'}하시겠습니까?</Text>
                    </Modal>
                </Form>
                <div className={styles.buttons_container}>
                    <div>
                        <Button type="primary" onClick={() => form.submit()} >
                            {isUpdate ? '수정' : '등록'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CommentWrite;