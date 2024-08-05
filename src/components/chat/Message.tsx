import { Card, Typography } from "antd";
import { MessageProps } from "../../types/components/chat/MessageProps";
import styles from "../../styles/components/chat/Message.module.scss";

const { Text } = Typography;

function Message({ message }: MessageProps) {
    return (
        <>
            {
                message.isNotice ? (
                    <Text className={styles.notice}>{message.payload}</Text>
                ) : (
                    <>
                        {
                            message.isOwn ? (
                                <div className={styles.sent}>
                                    <div className={styles.sent_at_container}>
                                        <Text className={styles.sent_at}>{message.sentAt}</Text>
                                    </div>
                                    <div className={styles.layout}>
                                        <Card className={styles.message} bodyStyle={{ padding: "10px" }}>
                                            <Text>
                                                {message.payload}
                                            </Text>
                                        </Card>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.received}>
                                    <div className={styles.layout}>
                                        <Text className={styles.sent_from}>{message.sentFrom}</Text>
                                        <Card className={styles.message} bodyStyle={{ padding: "10px" }}>
                                            <Text>
                                                {message.payload}
                                            </Text>
                                        </Card>
                                    </div>
                                    <div className={styles.sent_at_container}>
                                        <Text className={styles.sent_at}>{message.sentAt}</Text>
                                    </div>
                                </div>
                            )
                        }
                    </>
                )
            }
        </>
    )
}

export default Message;