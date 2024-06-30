import { useParams } from 'react-router-dom';
import styles from './CommentsSection.module.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import _ from 'lodash';
import UserComment from '../UserComment/UserComment';
import { Select } from '@mantine/core';
import useComments from '../useComments';
import CommentAndReplies from '../CommentAndReplies/CommentAndReplies';

const COMMENT_SORT_BY_OPTIONS = {
  TOP: 'top',
  NEWEST: 'newest',
};

const COMMENT_SORT_BY_OPTIONS_ARRAY = ['top', 'newest'];

const CommentsSection = ({
  post,
  highlightedComment,
  canLoadComments,
  numberOfComments,
  commentsSectionRef,
}) => {
  const { postId } = useParams();
  const [commentsSortBy, setCommentsSortBy] = useState(
    COMMENT_SORT_BY_OPTIONS.TOP,
  );
  const [maxCreatedAt, setMaxCreatedAt] = useState(new Date());
  const [userCommentLoading, setUserCommentLoading] = useState(false);
  const excludedIds = highlightedComment ? highlightedComment._id : '';

  const {
    comments,
    status,
    isFetching,
    isPlaceholderData,
    addNewComment,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments({
    postId,
    sortBy: commentsSortBy,
    enabled: canLoadComments,
    limit: 20,
    maxCreatedAt: maxCreatedAt,
    excludedIds,
  });

  const prevIsPlaceholderData = useRef(isPlaceholderData);

  const [commentsResetKey, setCommentsResetKey] = useState(0);

  // When new data is finished fetching (isPlaceholderData turns from true to false),
  // prevent showing render where the replies of a comment are opened for a single render
  // right before the comment components are to be remounted
  useLayoutEffect(() => {
    if (prevIsPlaceholderData.current && !isPlaceholderData) {
      setCommentsResetKey((key) => key + 1);
    }
    prevIsPlaceholderData.current = isPlaceholderData;
  }, [isPlaceholderData]);

  async function handleUserCommentActionClick(content) {
    try {
      setUserCommentLoading(true);
      const createdComment = await addNewComment({
        postId,
        blogId: post.blog._id,
        content,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUserCommentLoading(false);
    }
  }

  async function handleSelectChange(value) {
    const lowercaseSortByOption = value.toLowerCase();
    setCommentsSortBy(lowercaseSortByOption);
    setMaxCreatedAt(new Date());
  }

  const lastCommentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const lastComment = entries[0];
        if (!lastComment.isIntersecting) return;

        if (hasNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 1,
      },
    );

    const lastComment = lastCommentRef.current;
    if (lastComment && comments) {
      observer.observe(lastComment);
    }

    return () => {
      if (lastComment) {
        observer.unobserve(lastComment);
      }
    };
  }, [comments, fetchNextPage, hasNextPage]);

  const allComments = comments
    ? comments.pages.flatMap((page) => page.data.comments)
    : [];

  return (
    <div ref={commentsSectionRef} className={styles.commentsSection}>
      <div className={styles.commentsHeader}>
        <h2 className={styles.commentsLabel}>{numberOfComments} Comments</h2>
        <div className={styles.sortComments}>
          <p>Sort by:</p>
          <Select
            className={styles.commentsOrderBySelect}
            data={_.map(COMMENT_SORT_BY_OPTIONS_ARRAY, _.capitalize)}
            defaultValue={COMMENT_SORT_BY_OPTIONS.TOP}
            value={_.capitalize(commentsSortBy)}
            maw={120}
            allowDeselect={false}
            onChange={handleSelectChange}
          />
        </div>
      </div>

      <div className={styles.userComment}>
        {!userCommentLoading ? (
          <>
            <UserComment
              profilePic={post.author.profile_photo}
              onUserCommentActionClick={handleUserCommentActionClick}
              actionButtonName={'Comment'}
              actionButtonsOpenInitially={false}
            />
          </>
        ) : (
          <div className={styles.userCommentLoading}>
            <l-ring size='30' stroke='3' color='black' speed='1.5'></l-ring>
          </div>
        )}
      </div>
      <div
        className={`${styles.comments} ${isFetching && !isFetchingNextPage ? styles.loading : ''}`}
      >
        {isFetching && !isFetchingNextPage && (
          <div className={`${styles.loadingComments}`}>
            <l-ring size='30' stroke='3' color='black' speed='1.5' />
          </div>
        )}
        {highlightedComment && status === 'success' ? (
          <div className={styles.highlightedComment}>
            <p className={styles.highlightedCommentTag}>Highlighted Comment</p>
            <CommentAndReplies
              key={highlightedComment._id}
              commentData={highlightedComment}
              maxCreatedAt={maxCreatedAt}
            />
          </div>
        ) : null}
        {allComments.map((comment, index) => {
          return (
            <CommentAndReplies
              key={`${comment._id}-${commentsResetKey}`}
              commentRef={
                index === allComments.length - 1 ? lastCommentRef : null
              }
              commentData={comment}
              maxCreatedAt={maxCreatedAt}
            />
          );
        })}
        {(hasNextPage || isFetchingNextPage) && (
          <div
            className={`${styles.loadingNextComments} ${isFetchingNextPage || isFetching ? styles.hidden : ''}`}
          >
            <l-ring size='30' stroke='3' color='black' speed='1.5' />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
