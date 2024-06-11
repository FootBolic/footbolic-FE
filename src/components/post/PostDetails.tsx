import { Card, Divider, Button, Typography } from "antd";
import { toDatetimeString } from "../../util/DateUtil";
import styles from "../../styles/components/post/PostDetails.module.scss";
import { PostDetailsProps } from "../../types/components/post/PostDetailsProps";
import { useState } from "react";
import { HeartOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

function PostDetails({ post }: PostDetailsProps) {
    const [hover, setHover] = useState<boolean>(false);

    return (
        <>
            <Card>
                <div className={styles.post_info}>
                    <Title className={styles.title} level={3}>{post?.title}</Title>
                    <Text className={styles.title} type="secondary">
                        {post?.createdBy?.nickname} · {post?.createdAt && toDatetimeString(post.createdAt)}
                    </Text>
                </div>
                <Divider />
                <div className={styles.post_content}>
                    {post?.content}
                </div>
                <Divider />
                <div className={styles.post_buttons}>
                    <div className={styles.like_button_container}>
                        <Button
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            shape="circle"
                            size="large"
                            icon={<HeartOutlined className={hover ? styles.heart_hover : styles.heart} />}
                            danger={hover}
                            type={hover ? 'primary' : 'default'}
                        />
                        <Text>0</Text>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default PostDetails;