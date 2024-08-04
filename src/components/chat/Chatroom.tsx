import MessageInput from "./MessageInput";
import styles from "../../styles/components/chat/Chatroom.module.scss";
import Dialog from "./Dialog";
import { useEffect, useRef, useState } from "react";
import { MessageInterface } from "../../types/entity/message/MessageInterface";
import { dateToDatetimeString } from "../../util/DateUtil";
import { Stomp, CompatClient } from "@stomp/stompjs";

function Chatroom() {
    // const webSocket = useRef<WebSocket | null>(null);
    const stompClient = useRef<CompatClient | null>(null);
    const [messages, setMessages] = useState<MessageInterface[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        messages.length > 100 && setMessages((cur) => cur.filter((_, i) => i < 100))
    }, [messages])

    // useEffect(() => {
    //     webSocket.current = new WebSocket('ws://localhost:8080/chat');
        
    //     webSocket.current.onopen = () => {
    //         console.log('WebSocket 연결!');    
    //     };
    //     webSocket.current.onclose = (closeEvent) => {
    //         console.log('close', closeEvent);
    //         setConnected(false);
    //     }
    //     webSocket.current.onerror = (error) => {
    //         console.error(error);
    //         setError(true);
    //     }
    //     webSocket.current.onmessage = (event: MessageEvent) => {   
    //         setMessages((prev) => [...prev, event.data]);
    //     };
      
    //     return () => {
    //       webSocket.current?.close();
    //     };
    //   }, []);

    useEffect(() => {
        connect();
        return () => disconnect();
    }, []);

    const connect = () => {
        //웹소켓 연결
        try {
        const socket = new WebSocket("ws://localhost:8080/ws");
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({}, () => {
            stompClient.current && stompClient.current.subscribe(`/sub/chat`, (message) => {console.log(message)
                //누군가 발송했던 메시지를 리스트에 추가
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        });
    } catch(e) {
console.log('eeeeeeee', e);
    }
    };

    const disconnect = () => {
        if (stompClient.current) {
            stompClient.current.disconnect();
        }
    };

    return (
        <div className={styles.container}>
            <Dialog data={messages} />
            <MessageInput 
                onSend={(msg: string) => setMessages((cur) => [
                    { 
                        payload: msg,
                        sentAt: dateToDatetimeString(new Date())
                    }, 
                    ...cur
                ])}
            />
        </div>
    )
}

export default Chatroom;