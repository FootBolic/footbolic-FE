import { DialogProps } from "../../types/components/chat/DialogProps";
import styles from "../../styles/components/chat/Dialog.module.scss";
import Message from "./Message";
import { MessageInterface } from "../../types/entity/message/MessageInterface";

function Dialog({ data }: DialogProps) {

    return (
        <div className={styles.container}>
            {
                data.map((message: MessageInterface, index: number) => {
                    return (
                        <Message key={index} message={message} />
                    )
                })
            }
        </div>
    )
}

export default Dialog;