import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PostInterface } from "../../types/entity/post/PostInterface";
import { useMutation, useQuery } from "react-query";
import { API_QUERY_KEYS } from "../../constants/common/DataConstants";
import { PostAPI } from "../../api/post/PostAPI";
import { Skeleton, message } from "antd";
import { ROUTES } from "../../constants/common/RouteConstants";
import Error from "../../components/error/Error";
import Title from "../../components/title/Title";
import useURLParam from "../../hooks/useURLParam";
import PostWrite from "../../components/post/PostWrite";

function PostEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const { postId } = useParams();
    const { menuId, page, searchTitle, searchCreatedAt, searchCreatedBy } = useURLParam();
    const [post, setPost] = useState<PostInterface>();

    const { isFetching, isError, refetch: getPost } = useQuery({
        queryKey: [`${API_QUERY_KEYS.POST.GET_POST}_${postId}`],
        queryFn: () => PostAPI.getPost(postId!),
        enabled: false,
        onSuccess: (result) => setPost(result.post),
        onError: (e: string) => {
            message.error(e);
            navigate(ROUTES.MAIN_VIEW.path);
        }
    })

    const { mutate: updatePost } = useMutation(
        (post: PostInterface) => PostAPI.updatePost(post),
        {
            onSuccess: () => {
                message.success('게시글이 수정되었습니다.');
                navigate(`/post/${postId}`+getParameters());
            },
            onError: (e:string) => {message.error(e)},
        }
    )

    useEffect(() => {
        location.state?.post ? setPost(location.state.post) : getPost();
    }, [location])

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
                                        text: '뒤로',
                                        onClick: () => navigate(`/post/${postId}`+getParameters())
                                    }
                                ]}
                            />
                            <PostWrite post={post} onSave={updatePost} />
                        </>
                    }
                </>
            }
        </>
    )
}

export default PostEdit;