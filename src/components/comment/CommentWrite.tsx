import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import styles from "../../styles/components/comment/CommentWrite.module.scss";

function CommentWrite() {
    return (
        <>
            <div className={styles.container}>
                <TextArea className={styles.textarea} />
                <Button className={styles.save_button}>등록</Button>
            </div>
        </>
    )
}

export default CommentWrite;