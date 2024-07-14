import styles from './RepliesList.module.css';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Comment from '../Comment/Comment';
import 'ldrs/ring';
import useReplies from '../useReplies';
import { isEqual } from 'lodash';

function RepliesList({
  parentId,
  postId,
  commentRepliesCount,
  repliesIsOpen,
  setRepliesIsOpen,
  newUserReplies,
  updateNewUserReply,
  setNewUserReplies,
  maxCreatedAt,
}) {
  const [isFirstRepliesOpen, setIsFirstRepliesOpen] = useState(true);

  const queryKey = useRef(['replies', { parentId, postId, maxCreatedAt }]);
  const generatedQueryKey = ['replies', { parentId, postId, maxCreatedAt }];

  // Prevent new fetches for new query keys because whenever the sort by option
  // option is changed, the comments and its children including this component will
  // be remounted and its state will be reset.
  const enabled =
    !isFirstRepliesOpen && isEqual(queryKey.current, generatedQueryKey);

  const {
    replies,
    fetchNextPage,
    updateReplyOnComment,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useReplies({
    parentId,
    postId,
    enabled: enabled,
    limit: 10,
    maxCreatedAt,
  });

  async function handleRepliesButtonClick() {
    if (isFirstRepliesOpen) {
      setIsFirstRepliesOpen(false);
    }
    setRepliesIsOpen(!repliesIsOpen);
  }

  const allReplies = replies
    ? replies.pages.flatMap((page) => page.data.replies)
    : [];

  return (
    <div className={styles.repliesList}>
      {commentRepliesCount > 0 && (
        <button
          className={styles.repliesButton}
          onClick={handleRepliesButtonClick}
        >
          {!repliesIsOpen && `▼ View replies (${commentRepliesCount})`}
          {repliesIsOpen && `▲ Hide replies (${commentRepliesCount})`}
        </button>
      )}
      {repliesIsOpen
        ? allReplies.map((comment) => (
            <Comment
              key={comment._id}
              parentId={parentId}
              profilePicSize={30}
              commentData={comment}
              setNewUserReplies={setNewUserReplies}
              maxCreatedAt={maxCreatedAt}
              updateComment={updateReplyOnComment}
              updateNewUserReply={updateNewUserReply}
            />
          ))
        : null}
      {!repliesIsOpen &&
        newUserReplies.map((comment) => (
          <Comment
            key={comment._id}
            parentId={parentId}
            profilePicSize={30}
            commentData={comment}
            setNewUserReplies={setNewUserReplies}
            maxCreatedAt={maxCreatedAt}
            updateComment={updateReplyOnComment}
            updateNewUserReply={updateNewUserReply}
          />
        ))}
      {(isFetching || isFetchingNextPage) && (
        <div className={styles.loadingIconContainer}>
          <l-ring size='30' stroke='3' color='black' speed='1.5'></l-ring>
        </div>
      )}
      {!isFetchingNextPage && hasNextPage && repliesIsOpen && (
        <button
          className={styles.showMoreRepliesButton}
          onClick={fetchNextPage}
        >
          Show more replies
        </button>
      )}
    </div>
  );
}

RepliesList.propTypes = {
  parentId: PropTypes.string,
  postId: PropTypes.string,
  commentId: PropTypes.string,
  commentRepliesCount: PropTypes.number,
  repliesIsOpen: PropTypes.boolean,
  setRepliesIsOpen: PropTypes.func,
  replies: PropTypes.array,
  setReplies: PropTypes.func,
  newUserReplies: PropTypes.array,
  setNewUserReplies: PropTypes.func,
  maxCreatedAt: PropTypes.string,
};

export default RepliesList;
