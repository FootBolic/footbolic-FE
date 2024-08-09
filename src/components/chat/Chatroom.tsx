import MessageInput from "./MessageInput";
import styles from "../../styles/components/chat/Chatroom.module.scss";
import Dialog from "./Dialog";
import { useEffect, useRef, useState } from "react";
import { MessageInterface } from "../../types/entity/message/MessageInterface";
import { dateToTimeString } from "../../util/DateUtil";
import { Client, IMessage } from "@stomp/stompjs";
import { useSelector } from "react-redux";
import { RootStateInterface } from "../../types/reducers/RootStateInterface";
import { Button, Result, Skeleton } from "antd";

function Chatroom() {
    const stompClient = useRef<Client | null>(null);
    const { accessToken, nickname } = useSelector((state: RootStateInterface) => state.accessToken);
    const [messages, setMessages] = useState<MessageInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        messages.length > 100 && setMessages((cur) => cur.filter((_, i) => i < 100))
    }, [messages])

    useEffect(() => {
        connect();
        return () => disconnect();
    }, []);

    const connect = () => {
        const client = new Client({
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`
            },
            brokerURL: import.meta.env.VITE_STOMP_BROKER_URL,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe('/sub/chat', (msg: IMessage) => {
                    const message: MessageInterface = JSON.parse(msg.body);
                    message.isOwn = message.sentFrom === nickname;
                    setMessages((cur) => [message, ...cur]);
                });
                setLoading(false);
                setConnected(true);
                stompClient.current?.publish({
                    destination: '/pub/ws/chat/enter',
                    body: JSON.stringify({
                        sentAt: dateToTimeString(new Date)
                    })
                })
            },
            onDisconnect: () => disconnect(),
            onStompError: () => disconnect(),
            onWebSocketError: () => disconnect()
        })
        client.activate();
        stompClient.current = client;
    };

    const disconnect = () => {
        if (stompClient.current) {
            stompClient.current.deactivate();
        }
        setLoading(false);
        setConnected(false);
        stompClient.current?.publish({
            destination: '/pub/ws/chat/leave',
            body: JSON.stringify({
                sentAt: dateToTimeString(new Date)
            })
        })
    };

    return (
        <div className={styles.container}>
            {
                loading ? (
                    <Skeleton active />
                ) : (
                    <>
                        {
                            connected ? (
                                <>
                                    <Dialog data={messages} />
                                    <MessageInput 
                                        onSend={(msg: string) => {
                                            stompClient.current?.publish({
                                                destination: '/pub/ws/chat',
                                                body: JSON.stringify({
                                                    payload: msg,
                                                    sentAt: dateToTimeString(new Date)
                                                })
                                            })
                                        }}
                                    />
                                </>
                            ) : (
                                <Result
                                    title="서버와의 연결이 끊어졌습니다."
                                    extra={
                                        <Button type="primary" key="console" onClick={connect}>
                                            다시 연결하기
                                        </Button>
                                    }
                                />
                            )
                        }
                    </>
                )
            }
        </div>
    )
}

export default Chatroom;