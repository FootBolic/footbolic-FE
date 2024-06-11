import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { API_QUERY_KEYS } from "../../constants/common/DataConstants";
import { PostAPI } from "../../api/post/PostAPI";
import { useEffect, useState } from "react";
import { PostInterface } from "../../types/entity/post/PostInterface";
import { Card, FloatButton, Skeleton, Space, Typography, message } from "antd";
import Error from "../../components/error/Error";
import Title from "../../components/title/Title";
import useURLParam from "../../hooks/useURLParam";
import { toDatetimeString } from "../../util/DateUtil";
import styles from "../../styles/routes/post/PostRead.module.scss";
import { HeartOutlined } from '@ant-design/icons';
import CommentSection from "../../components/comment/CommentSection";

const { Title: TitleText, Text } = Typography;

function PostRead() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const { menuId, page, searchTitle, searchCreatedAt, searchCreatedBy } = useURLParam();
    const [post, setPost] = useState<PostInterface>();
    const [hover, setHover] = useState<boolean>(false);

    const { isFetching, isError, refetch } = useQuery({
        queryKey: [`${API_QUERY_KEYS.POST.GET_POST}_${postId}`],
        queryFn: () => PostAPI.getPost(postId!),
        enabled: false,
        onSuccess: (result) => setPost(result.post),
        onError: (e: string) => message.error(e)
    })

    useEffect(() => {
        postId && refetch();
    }, [postId])

    return (
        <>
            {
                isFetching ? <Skeleton active /> : <>
                    {
                        isError ? <Error /> : <>
                            <Title
                                title="게시판"
                                buttons={[
                                    { 
                                        text: '목록',
                                        onClick: () => navigate(`/board/${post?.board?.id}?menuId=${menuId}&page=${page}`
                                        + (searchTitle ? `&searchTitle=${searchTitle}` : '')
                                        + (searchCreatedAt ? `&searchCreatedAt=${searchCreatedAt}` : '')
                                        + (searchCreatedBy ? `&searchCreatedBy=${searchCreatedBy}` : '')
                                        )
                                    }
                                ]}
                            />
                            <Card
                                title={
                                    <>
                                        <div className={styles.post_info}>
                                            <TitleText className={styles.title} level={3}>{post?.title}</TitleText>
                                            <Space direction="vertical">
                                                <Text className={styles.title} type="secondary">
                                                    {post?.createdBy?.nickname}
                                                </Text>
                                                <Text className={styles.title} type="secondary">
                                                    {post?.createdAt && toDatetimeString(post.createdAt)}
                                                </Text>
                                            </Space>
                                        </div>
                                    </>
                                }
                                bodyStyle={{ minHeight: '40vh' }}
                            >
                                {post?.content}
                            </Card>
                            <CommentSection />
                            <FloatButton.Group>
                                <FloatButton 
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                    icon={
                                        <HeartOutlined className={hover ? styles.heart_hover : styles.heart} />
                                    } 
                                    className={hover ? styles.like_button_hover : ''}
                                />
                                <FloatButton.BackTop visibilityHeight={1} />
                            </FloatButton.Group>
                        </>
                    }
                </>
            }
        </>
    )
}

export default PostRead;