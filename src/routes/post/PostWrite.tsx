import { useNavigate, useParams } from "react-router-dom";
import { PostInterface } from "../../types/entity/post/PostInterface";
import { useMutation } from "react-query";
import { PostAPI } from "../../api/post/PostAPI";
import { message } from "antd";
import Title from "../../components/title/Title";
import useURLParam from "../../hooks/useURLParam";
import PostWriteComponent from "../../components/post/PostWrite";

function PostWrite() {
    const navigate = useNavigate();
    const { boardId } = useParams();
    const { menuId, page, searchTitle, searchCreatedAt, searchCreatedBy } = useURLParam();

    const { mutate: createPost } = useMutation(
        (post: PostInterface) => PostAPI.createPost(post),
        {
            onSuccess: (result) => {
                message.success('게시글이 작성되었습니다.');
                navigate(`/post/${result.createdPost.id}${getParameters()}`);
            },
            onError: (e:string) => {message.error(e)},
        }
    )

    const getParameters = () => {
        return `?menuId=${menuId}`
            + (page ? `&page=${page}` : '')
            + (searchTitle ? `&searchTitle=${searchTitle}` : '')
            + (searchCreatedAt ? `&searchCreatedAt=${searchCreatedAt}` : '')
            + (searchCreatedBy ? `&searchCreatedBy=${searchCreatedBy}` : '')
    }
    
    return (
        <>
            <Title
                title="게시판"
                buttons={[
                    {
                        text: '뒤로',
                        onClick: () => navigate(`/board/${boardId}${getParameters()}`)
                    }
                ]}
            />
            <PostWriteComponent isUpdate boardId={boardId} onSave={createPost} />
        </>
    )
}

export default PostWrite;