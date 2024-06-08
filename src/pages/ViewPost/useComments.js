import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import PostAPI from '../../api/PostAPI';

const useComments = ({
  postId,
  sortBy,
  enabled = true,
  limit = 10,
  maxCreatedAt,
  excludedIds,
}) => {
  const queryClient = useQueryClient();

  const queryKey = ['topLevelComments', { postId, sortBy, maxCreatedAt }];

  const { data: comments, ...rest } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: async ({ pageParam = null }) =>
      await PostAPI.getCommentsOnPost(postId, {
        sort_by: sortBy,
        limit: limit,
        cursor: pageParam,
        max_created_at: maxCreatedAt,
        excluded_ids: excludedIds,
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.paging.cursors.next;
    },
    placeholderData: keepPreviousData,
    enabled,
    gcTime: 0,
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ postId, blogId, content }) => {
      const createdComment = await PostAPI.createCommentOnPost(postId, {
        parent: null,
        content: content,
        blog: blogId,
      });

      return createdComment;
    },
    onSuccess: (newComment) => {
      // If the first page does not exist or is not for user comments,
      // create it and prepend the new comment
      queryClient.setQueryData(queryKey, (oldData) => {
        if (!oldData) return;

        if (!oldData.pages[0] || !oldData.pages[0].isUserCommentsPage) {
          const newPages = [
            {
              data: {
                comments: [newComment.data.comment],
                isUserCommentsPage: true,
              },
            },
            ...oldData.pages,
          ];
          return {
            ...oldData,
            pages: newPages,
          };
        }

        const newPages = [
          {
            data: {
              comments: [newComment.data.comment, ...oldData.pages[0].comments],
              isUserCommentsPage: true,
            },
          },
          ...oldData.pages,
        ];
        return {
          ...oldData,
          pages: newPages,
        };
      });
    },
  });

  return {
    comments,
    addNewComment: addCommentMutation.mutateAsync,
    ...rest,
  };
};

export default useComments;
