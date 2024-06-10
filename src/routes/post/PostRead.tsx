import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { API_QUERY_KEYS } from "../../constants/common/DataConstants";
import { PostAPI } from "../../api/post/PostAPI";
import { useEffect, useState } from "react";
import { PostInterface } from "../../types/entity/post/PostInterface";
import { Card, Skeleton, Typography, message } from "antd";
import Error from "../../components/error/Error";
import Title from "../../components/title/Title";
import useURLParam from "../../hooks/useURLParam";
import { toDatetimeString } from "../../util/DateUtil";
import styles from "../../styles/routes/post/PostRead.module.scss";

const { Title: TitleText, Text } = Typography;

function PostRead() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const { menuId } = useURLParam();
    const [post, setPost] = useState<PostInterface>();

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
                                    { text: '목록', onClick: () => navigate(`/board/${post?.board?.id}?menuId=${menuId}`) }
                                ]}
                            />
                            <Card
                                title={
                                    <>
                                        <div className={styles.post_info}>
                                            <TitleText level={3}>{post?.title}</TitleText>
                                            <Text type="secondary">
                                                {post?.createdBy?.nickname} | {post?.createdAt && toDatetimeString(post.createdAt)}
                                            </Text>
                                        </div>
                                    </>
                                }
                                bodyStyle={{ minHeight: '40vh' }}
                            >
                                {post?.content}
                            </Card>
                        </>
                    }
                </>
            }
        </>
    )
}

export default PostRead;