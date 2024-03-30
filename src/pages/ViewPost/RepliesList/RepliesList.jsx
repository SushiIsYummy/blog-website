import styles from './RepliesList.module.css';
import { useRef, useState } from 'react';
import PostAPI from '../../../api/PostAPI';
import PropTypes from 'prop-types';
import Comment from '../Comment/Comment';
import 'ldrs/ring';

function RepliesList({
  parentId,
  postId,
  commentRepliesCount,
  repliesIsOpen,
  setRepliesIsOpen,
  replies,
  setReplies,
}) {
  const [nextRepliesPage, setNextRepliesPage] = useState(1);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const isFirstRepliesOpen = useRef(true);

  async function fetchCommentReplies(nextRepliesPage) {
    try {
      setLoadingReplies(true);
      const fetchedReplies = await PostAPI.getRepliesOnPostComment(
        postId,
        parentId,
        { page: nextRepliesPage },
      );
      return fetchedReplies;
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  }

  async function handleRepliesButtonClick() {
    if (isFirstRepliesOpen.current) {
      const fetchedReplies = await fetchCommentReplies(nextRepliesPage);
      setNextRepliesPage(fetchedReplies.pagination.next_page);
      setReplies([...replies, ...fetchedReplies.data.replies]);
      isFirstRepliesOpen.current = false;
    }
    setRepliesIsOpen(!repliesIsOpen);
  }

  async function handleShowMoreRepliesButtonClick() {
    const fetchedReplies = await fetchCommentReplies(nextRepliesPage);
    setNextRepliesPage(fetchedReplies.pagination.next_page);
    setReplies([...replies, ...fetchedReplies.data.replies]);
  }

  return (
    <>
      <div className={styles.replies}>
        {commentRepliesCount > 0 && (
          <button
            className={styles.repliesButton}
            onClick={handleRepliesButtonClick}
          >
            {!repliesIsOpen && `▼ View replies (${commentRepliesCount})`}
            {repliesIsOpen && `▲ Hide replies (${commentRepliesCount})`}
          </button>
        )}
        {(repliesIsOpen || (!repliesIsOpen && commentRepliesCount === 0)) &&
          replies.map((reply) => {
            return (
              <Comment
                key={reply._id}
                profilePicSize={30}
                commentData={reply}
                parentReplies={replies}
                setParentReplies={setReplies}
                parentId={parentId}
              />
            );
          })}
        {!loadingReplies && repliesIsOpen && nextRepliesPage !== null && (
          <button
            className={styles.showMoreRepliesButton}
            onClick={handleShowMoreRepliesButtonClick}
          >
            Show more replies
          </button>
        )}
        {loadingReplies && (
          <div className={styles.loadingIconContainer}>
            <l-ring size='30' stroke='3' color='black' speed='1.5'></l-ring>
          </div>
        )}
      </div>
    </>
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
};

export default RepliesList;
