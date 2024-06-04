import { Button, Popconfirm } from "antd";
import styles from "../../styles/components/confirm_button/ConfirmButton.module.scss";
import { Fragment } from "react";
import { ConfirmButtonProps } from "../../types/components/confirm_button/ConfirmButtonProps";

function ConfirmButton({ confirmText, data, popOpen, setPopOpen, onConfirm }: ConfirmButtonProps) {

    return (
        <div className={styles.container}>
            {data.map(e => {
                return e.isDeleted ? <Fragment key={e.id}></Fragment> : (
                    <Popconfirm 
                        key={e.id}
                        open={popOpen === e.id}
                        title={confirmText || "삭제하시겠습니까?"}
                        okText="확인"
                        cancelText="취소"
                        onCancel={() => setPopOpen("")}
                        onConfirm={() => {
                            onConfirm(e);
                            setPopOpen("");
                        }}
                    >
                        <Button 
                            type="dashed"
                            value={e.id}
                            className={styles.button}
                            onClick={() => setPopOpen(e.id === popOpen ? '' : e.id)}
                        >
                            {e.title}
                        </Button>
                    </Popconfirm>
                )
            })}
        </div>
    )
}

export default ConfirmButton