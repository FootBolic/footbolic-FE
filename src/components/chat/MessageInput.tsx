import { Button, Form, Input } from "antd";
import styles from "../../styles/components/chat/MessageInput.module.scss";
import { MessageInputProps } from "../../types/components/chat/MessageInputProps";
import { useForm } from "antd/es/form/Form";
function MessageInput({ onSend }: MessageInputProps) {
    const [form] = useForm();
    
    const handleSend = () => {
        const message = form.getFieldValue("message");
        message && onSend(message);
        form.resetFields();
    }

    return (
        <div className={styles.container}>
            <Form  className={styles.input} form={form}>
                <Form.Item name="message">
                    <Input maxLength={100} onPressEnter={handleSend} />
                </Form.Item>
            </Form>
            <Button onClick={handleSend} type="primary" className={styles.button}>전송</Button>
        </div>
    )
}

export default MessageInput;