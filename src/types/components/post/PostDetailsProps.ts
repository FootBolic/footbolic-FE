import { PostInterface } from "../../entity/post/PostInterface"

export type PostDetailsProps = {
    post: PostInterface;
    onRecommendationChange?: (size: number, isRecommended: boolean) => any;
}