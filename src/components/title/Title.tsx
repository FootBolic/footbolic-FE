import { Button, Typography } from "antd";
import { TitleProps } from "../../types/components/title/TitleProps";
import styles from "../../styles/components/title/Title.module.scss";
import usePath from "../../hooks/usePath";
import { Fragment, ReactNode, useEffect, useState } from "react";
import useIcon from "../../hooks/useIcon";

const { Title: AntTitle } = Typography;

function Title ({ title, buttons, centered }: TitleProps) {
    const { menu } = usePath();
    const { getIcon } = useIcon();
    const [Icon, setIcon] = useState<ReactNode | null>();

    useEffect(() => {
        menu?.icon ? setIcon(getIcon(menu.icon.code!, menu.icon.type!, false)) : setIcon(null);
    }, [menu])

    return (
        <div className={centered ? styles.container_center : styles.container}>
            {Icon ? (
                <div className={styles.title_container}>
                    <div className={styles.icon}>
                        {Icon}
                    </div>
                    <div className={styles.title}>
                        <AntTitle level={2}>
                            {menu?.title || title}
                        </AntTitle>
                    </div>
                </div>
            ) : (
                <AntTitle level={2}>
                    {menu?.title || title}
                </AntTitle>
            )}
            <div className={styles.buttons_container}>
                {   
                    buttons && !centered && buttons.map((each, index) => {
                        return (
                            <Fragment key={index}>
                                {each.hidden ? <></> : (
                                    <Button 
                                        className={styles.button}
                                        danger={each.danger}
                                        type={each.type ?? 'default'}
                                        onClick={each.onClick}
                                    >
                                        {each.text}
                                    </Button>
                                )}
                            </Fragment>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Title;