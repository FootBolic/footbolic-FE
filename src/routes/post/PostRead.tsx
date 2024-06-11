import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { API_QUERY_KEYS } from "../../constants/common/DataConstants";
import { PostAPI } from "../../api/post/PostAPI";
import { useEffect, useState } from "react";
import { PostInterface } from "../../types/entity/post/PostInterface";
import { FloatButton, Skeleton, message } from "antd";
import Error from "../../components/error/Error";
import Title from "../../components/title/Title";
import useURLParam from "../../hooks/useURLParam";
import CommentSection from "../../components/comment/CommentSection";
import PostDetails from "../../components/post/PostDetails";

function PostRead() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const { menuId, page, searchTitle, searchCreatedAt, searchCreatedBy } = useURLParam();
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
                isFetching || !post ? <Skeleton active /> : <>
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
                            <PostDetails post={post} />
                            <CommentSection />
                            <FloatButton.BackTop visibilityHeight={1} />
                        </>
                    }
                </>
            }
        </>
    )
}

export default PostRead;