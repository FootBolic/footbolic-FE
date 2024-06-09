import { Button, Typography } from "antd";
import { TitleProps } from "../../types/components/title/TitleProps";
import styles from "../../styles/components/title/Title.module.scss";
import usePath from "../../hooks/usePath";

const { Title: AntTitle } = Typography;

function Title ({ title, buttons, centered, Icon }: TitleProps) {
    const { menu } = usePath();

    return (
        <div className={centered ? styles.container_center : styles.container}>
            <AntTitle level={2}>
                {Icon} {menu?.title || title}
            </AntTitle>
            <div className={styles.buttons_container}>
                {   
                    buttons && !centered && buttons.map((each, index) => {
                        return (
                            <Button 
                                key={index}
                                className={styles.button}
                                danger={each.danger}
                                type={each.type ?? 'default'}
                                onClick={each.onClick}
                            >
                                {each.text}
                            </Button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Title;