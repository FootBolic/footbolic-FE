import { DialogProps } from "../../types/components/chat/DialogProps";
import styles from "../../styles/components/chat/Dialog.module.scss";
import Message from "./Message";

function Dialog({ data }: DialogProps) {

    return (
        <div className={styles.container}>
            {
                data.map(message => {
                    return (
                        <Message message={message} />
                    )
                })
            }
        </div>
    )
}

export default Dialog;