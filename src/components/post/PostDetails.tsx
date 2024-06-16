import { Card, Divider, Button, Typography } from "antd";
import { toDatetimeString } from "../../util/DateUtil";
import styles from "../../styles/components/post/PostDetails.module.scss";
import { PostDetailsProps } from "../../types/components/post/PostDetailsProps";
import { useState } from "react";
import { HeartOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from "react-query";
import { RecommendationAPI } from "../../api/recommendation/RecommendationAPI";
import { API_QUERY_KEYS } from "../../constants/common/DataConstants";
import { Viewer } from "@toast-ui/react-editor";
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import Prism from 'prismjs';

const { Text, Title } = Typography;

function PostDetails({ post, onRecommendationChange }: PostDetailsProps) {
    const [hover, setHover] = useState<boolean>(false);

    const { refetch } = useQuery({
        queryFn: () => RecommendationAPI.getRecommendations("post", post.id),
        queryKey: [API_QUERY_KEYS.RECOMMENDATION.GET_RECOMMENDATIONS + `_${post.id}`],
        enabled: false,
        onSuccess: (result) => onRecommendationChange && onRecommendationChange(result.size, result.isRecommended)
    })

    const { mutate: recommend, isLoading: isLoadingRecommendation } = useMutation(
        (objectId: string) => RecommendationAPI.recommend("post", objectId),
        {
            onSuccess: () => refetch()
        }
    )

    const { mutate: unrecommend, isLoading: isLoadingUnrecommendation } = useMutation(
        (objectId: string) => RecommendationAPI.unrecommend("post", objectId),
        {
            onSuccess: () => refetch()
        }
    )

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
                    <Viewer initialValue={post.content} plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]} />
                </div>
                <Divider />
                <div className={styles.post_buttons}>
                    <div className={styles.like_button_container}>
                        <Button
                            disabled={isLoadingRecommendation || isLoadingUnrecommendation}
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            shape="circle"
                            size="large"
                            icon={<HeartOutlined className={(hover || post.isRecommended) ? styles.heart_hover : styles.heart} />}
                            danger={hover || post.isRecommended}
                            type={(hover || post.isRecommended) ? 'primary' : 'default'}
                            onClick={() => post.isRecommended ? unrecommend(post.id) : recommend(post.id)}
                        />
                        <Text>{post.recommendationsSize || 0}</Text>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default PostDetails;