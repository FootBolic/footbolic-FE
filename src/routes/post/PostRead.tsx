import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { API_QUERY_KEYS } from "../../constants/common/DataConstants";
import { PostAPI } from "../../api/post/PostAPI";
import { useEffect, useState } from "react";
import { PostInterface } from "../../types/entity/post/PostInterface";
import { Skeleton, message } from "antd";
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

    const getParameters = () => {
        return `?menuId=${menuId}`
            + (page ? `&page=${page}` : '')
            + (searchTitle ? `&searchTitle=${searchTitle}` : '')
            + (searchCreatedAt ? `&searchCreatedAt=${searchCreatedAt}` : '')
            + (searchCreatedBy ? `&searchCreatedBy=${searchCreatedBy}` : '')
    }

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
                                        onClick: () => navigate(`/board/${post?.board?.id}` + getParameters())
                                    },
                                    {
                                        text: '수정',
                                        onClick: () => navigate(`/post/${post.id}/edit` + getParameters(), { state: { post } }),
                                        type: "primary",
                                        hidden: !post.isEditable
                                    }
                                ]}
                            />
                            <PostDetails 
                                post={post} 
                                onRecommendationChange={(recommendationsSize, isRecommended) => setPost({ ...post, recommendationsSize, isRecommended })}
                            />
                            <CommentSection
                                comments={post.comments || []}
                                onSaveComment={refetch}
                                onCommentRecommendationChange={(id, size, isRecommended) => {
                                    setPost({
                                        ...post,
                                        comments: post.comments ? [
                                            ...post.comments.map((comment) => {
                                                return comment.id === id ? {
                                                    ...comment,
                                                    recommendationsSize: size,
                                                    isRecommended
                                                } : comment
                                            })
                                        ] : []
                                    })
                                }}
                                onReplyRecommendationChange={(id, size, isRecommended) => {
                                    setPost({
                                        ...post,
                                        comments: post.comments?.length ? [
                                            ...post.comments.map((comment) => {
                                                return {
                                                    ...comment,
                                                    replies: comment.replies?.length ? [
                                                        ...comment.replies.map((reply) => {
                                                            return reply.id === id ? {
                                                                ...reply,
                                                                recommendationsSize: size,
                                                                isRecommended
                                                            } : reply
                                                        })
                                                    ] : []
                                                }
                                            })
                                        ] : []
                                    })
                                }}
                            />
                        </>
                    }
                </>
            }
        </>
    )
}

export default PostRead;