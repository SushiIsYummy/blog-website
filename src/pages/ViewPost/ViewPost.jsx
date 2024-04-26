import { useLoaderData, NavLink, useOutletContext } from 'react-router-dom';
import styles from './ViewPost.module.css';
import PostAPI from '../../api/PostAPI';
import TinyMCEView from '../../components/TinyMCE/TinyMCEView';
import toRelativeTimeLuxon from '../../utils/toRelativeTimeLuxon';
import { useEffect, useRef, useState } from 'react';
import VotingWidget from '../../components/VotingWidget/VotingWidget';
import _ from 'lodash';
import { useMediaQuery } from '@react-hook/media-query';
import { FaRegComment } from 'react-icons/fa';
import UserComment from './UserComment/UserComment';
import Comment from './Comment/Comment';
import scrollToElementWithOffset from '../../utils/scrollToElementWithOffset';

export async function loader({ request, params }) {
  try {
    const highlightedCommentIdQuery = new URL(request.url).searchParams.get(
      'hc',
    );
    let highlightedComment = null;
    if (highlightedCommentIdQuery) {
      let targetComment = null;
      try {
        targetComment = await PostAPI.getSingleCommentOnPost(
          params.postId,
          highlightedCommentIdQuery,
        );
        highlightedComment = targetComment.data.comment;
      } catch (err) {
        console.error(err);
      }
    }

    const [postResponse, postVotesResponse, commentsResponse] =
      await Promise.all([
        PostAPI.getPostById(params.postId),
        PostAPI.getVotesOnPost(params.postId),
        PostAPI.getCommentsOnPost(params.postId, { page: 1 }),
      ]);
    return {
      postResponse,
      postVotesResponse,
      commentsResponse,
      highlightedComment,
    };
  } catch (err) {
    console.error(err);
  }
  return null;
}

export async function previewLoader({ request, params }) {
  const postResponse = await PostAPI.getPostById(params.postId);
  return {
    postResponse,
  };
}

const voteOptions = {
  UPVOTE: 1,
  NEUTRAL: 0,
  DOWNVOTE: -1,
};

function ViewPost({ isPreview }) {
  const { headerRef } = useOutletContext();
  let {
    postResponse,
    postVotesResponse,
    commentsResponse,
    highlightedComment,
  } = useLoaderData();
  const post = postResponse.data.post;
  const initialComments = commentsResponse?.data?.comments || [];
  const initialCommentsWithoutHighlightedComment = initialComments
    ? initialComments.filter(
        (comment) =>
          highlightedComment && highlightedComment._id !== comment._id,
      )
    : [];
  const upvotesOnPost = postVotesResponse?.data?.upvotes || 0;
  const downvotesOnPost = postVotesResponse?.data?.downvotes || 0;
  const userVote = postVotesResponse?.data?.user_vote || 0;
  const isMaxWidth768 = useMediaQuery('(max-width: 768px)');
  const isFirstRender = useRef(true);

  const [currentVote, setCurrentVote] = useState(userVote);
  const [upvotes, setUpvotes] = useState(upvotesOnPost);
  const [downvotes, setDownvotes] = useState(downvotesOnPost);
  const [comments, setComments] = useState(
    (highlightedComment
      ? initialCommentsWithoutHighlightedComment
      : initialComments) || [],
  );
  const [userCommentLoading, setUserCommentLoading] = useState(false);

  useEffect(() => {
    async function updateVote() {
      try {
        if (currentVote === voteOptions.NEUTRAL) {
          const vote = await PostAPI.deleteVoteOnPost(post._id);
        } else if (
          currentVote === voteOptions.UPVOTE ||
          currentVote === voteOptions.DOWNVOTE
        ) {
          const updatedVote = await PostAPI.updateVoteOnPost(post._id, {
            vote_value: currentVote,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (isPreview) {
      return;
    }

    // prevent sending unnecessary request on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const debouncedRequest = _.debounce(updateVote, 1000);
    debouncedRequest();

    // update vote even if user closes tab or refreshes
    // before debounce delay is finished
    function handleBeforeUnload() {
      debouncedRequest.flush();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      debouncedRequest.cancel();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentVote, isPreview, post._id]);

  async function onUserCommentCommentClick(comment) {
    try {
      setUserCommentLoading(true);
      const createdComment = await PostAPI.createCommentOnPost(post._id, {
        content: comment,
        blog: post.blog._id,
      });
      setComments([createdComment.data.postComment, ...comments]);
    } catch (err) {
      console.error(err);
    } finally {
      setUserCommentLoading(false);
    }
  }

  const commentsSection = useRef(null);
  const commentBadge = (
    <div
      className={`${styles.commentBadge} ${isMaxWidth768 ? styles.horizontal : styles.vertical}`}
      onClick={jumpToComments}
    >
      <FaRegComment
        className={styles.commentIcon}
        style={{ width: '20px', height: '20px' }}
      />
      <p>{initialComments.length}</p>
    </div>
  );

  function jumpToComments() {
    if (commentsSection.current) {
      const headerHeight = parseFloat(
        window.getComputedStyle(headerRef.current).height,
      );
      scrollToElementWithOffset(commentsSection.current, headerHeight);
    }
  }

  return (
    <div className={styles.postContainer}>
      {!isMaxWidth768 && (
        <div className={styles.votesAndComments}>
          <VotingWidget
            orientation={'vertical'}
            currentVote={currentVote}
            setCurrentVote={setCurrentVote}
            upvotes={upvotes}
            downvotes={downvotes}
            setUpvotes={setUpvotes}
            setDownvotes={setDownvotes}
          />
          {commentBadge}
        </div>
      )}
      <div className={styles.post}>
        {post.cover_image && (
          <div className={styles.coverImageContainer}>
            <img src={post.cover_image ? post.cover_image : null} alt='' />
          </div>
        )}
        <div className={styles.postBody}>
          <h1 className={styles.postTitle}>{post.title}</h1>
          {post.subheading !== '' && (
            <h2 className={styles.postSubheading}>{post.subheading}</h2>
          )}
          <div className={styles.postInfo}>
            <img
              className={styles.authorImage}
              src={
                post.author.profile_photo !== null
                  ? post.author.profile_photo
                  : '/images/default_profile_photo.jpg'
              }
              alt=''
            />
            <div className={styles.rightSide}>
              <NavLink
                className={styles.authorName}
                to={`/users/${post.author._id}`}
              >
                {post.author.first_name} {post.author.last_name}
              </NavLink>
              <div className={styles.publishedIn}>
                <p>
                  Published in&nbsp;
                  <NavLink
                    className={styles.blogLink}
                    to={`/blogs/${post.blog._id}`}
                  >
                    {post.blog.title}
                  </NavLink>{' '}
                  • {toRelativeTimeLuxon(post.created_at)}
                </p>
              </div>
            </div>
          </div>
          {isMaxWidth768 && (
            <div className={`${styles.votesAndComments}`}>
              <VotingWidget
                orientation={'horizontal'}
                currentVote={currentVote}
                setCurrentVote={setCurrentVote}
                upvotes={upvotes}
                downvotes={downvotes}
                setUpvotes={setUpvotes}
                setDownvotes={setDownvotes}
              />
              {commentBadge}
            </div>
          )}
          <div className={styles.postContent}>
            <TinyMCEView content={post.content}></TinyMCEView>
          </div>
          {isMaxWidth768 && (
            <div className={`${styles.votesAndComments}`}>
              <VotingWidget
                orientation={'horizontal'}
                currentVote={currentVote}
                setCurrentVote={setCurrentVote}
                upvotes={upvotes}
                downvotes={downvotes}
                setUpvotes={setUpvotes}
                setDownvotes={setDownvotes}
              />
              {commentBadge}
            </div>
          )}
          {!isPreview && (
            <div ref={commentsSection} className={styles.commentSection}>
              <div className={styles.commentsHeader}>
                <h2 className={styles.commentsLabel}>
                  {initialComments.length} Comments
                </h2>
                <div className={styles.userComment}>
                  {!userCommentLoading ? (
                    <>
                      <UserComment
                        profilePic={post.author.profile_photo}
                        onUserCommentActionClick={onUserCommentCommentClick}
                        userCommentLoading={userCommentLoading}
                        setUserCommentLoading={setUserCommentLoading}
                        actionButtonName={'Comment'}
                      />
                    </>
                  ) : (
                    <div className={styles.userCommentLoading}>
                      <l-ring
                        size='30'
                        stroke='3'
                        color='black'
                        speed='1.5'
                      ></l-ring>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.comments}>
                {highlightedComment ? (
                  <div className={styles.highlightedComment}>
                    <p className={styles.highlightedCommentTag}>
                      Highlighted Comment
                    </p>
                    <Comment
                      key={highlightedComment._id}
                      commentData={highlightedComment}
                      highlightedComment={true}
                    />
                  </div>
                ) : null}
                {comments.map((comment) => {
                  return <Comment key={comment._id} commentData={comment} />;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewPost;
