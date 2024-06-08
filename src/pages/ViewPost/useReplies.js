import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import PostAPI from '../../api/PostAPI';

async function getRepliesOnPostComment({
  pageParam,
  postId,
  parentId,
  limit,
  maxCreatedAt,
}) {
  const comments = await PostAPI.getRepliesOnPostComment(postId, parentId, {
    limit: limit,
    cursor: pageParam,
    max_created_at: maxCreatedAt,
  });
  return comments;
}

const useReplies = ({
  parentId,
  postId,
  enabled = true,
  limit = 10,
  maxCreatedAt,
}) => {
  const queryClient = useQueryClient();

  const queryKey = ['replies', { parentId, postId, maxCreatedAt }];

  const { data: replies, ...rest } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam = null }) =>
      getRepliesOnPostComment({
        pageParam,
        postId,
        parentId,
        limit,
        maxCreatedAt,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.paging.cursors.next;
    },
    placeholderData: keepPreviousData,
    enabled,
    gcTime: 0,
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ postId, blogId, parentId, content }) => {
      const createdComment = await PostAPI.createCommentOnPost(postId, {
        parent: parentId,
        content: content,
        blog: blogId,
      });
      return createdComment;
    },
    onSuccess: (newComment) => {
      // append comment to end of replies if data exists
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return;
        const lastPage = oldData.pages[oldData.pages.length - 1];
        const newPages = [
          ...oldData.pages.slice(0, -1),
          {
            ...lastPage,
            data: {
              replies: [...lastPage.data.replies, newComment.data.comment],
            },
          },
        ];
        return {
          ...oldData,
          pages: newPages,
        };
      });
    },
  });

  return {
    replies,
    addReplyOnComment: addCommentMutation.mutateAsync,
    ...rest,
  };
};

export default useReplies;
