import { useLoaderData, NavLink } from 'react-router-dom';
import styles from './ViewPost.module.css';
import PostAPI from '../../api/PostAPI';
import TinyMCEView from '../../components/TinyMCE/TinyMCEView';
import toRelativeTimeLuxon from '../../utils/toRelativeTimeLuxon';
import { useEffect, useRef, useState } from 'react';
import VotingWidget from '../../components/VotingWidget/VotingWidget';
import _ from 'lodash';
import { useMediaQuery } from '@react-hook/media-query';
import { FaRegComment } from 'react-icons/fa';
import CommentsSection from './CommentsSection/CommentsSection';

const COMMENT_SORT_BY_OPTIONS = {
  TOP: 'top',
  NEWEST: 'newest',
};

const COMMENT_SORT_BY_OPTIONS_ARRAY = ['top', 'newest'];

async function loader({ request, params }) {
  try {
    const urlSearchParams = new URL(request.url).searchParams;
    const highlightedCommentIdQuery = urlSearchParams.get('hc');
    let sortByQuery = urlSearchParams.get('sort_by');
    sortByQuery = COMMENT_SORT_BY_OPTIONS_ARRAY.includes(sortByQuery)
      ? sortByQuery
      : COMMENT_SORT_BY_OPTIONS.TOP;
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
        PostAPI.getCommentsOnPost(params.postId, { sort_by: sortByQuery }),
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

async function previewLoader({ params }) {
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
  let {
    postResponse,
    postVotesResponse,
    commentsResponse,
    highlightedComment,
  } = useLoaderData();
  const post = postResponse.data.post;
  const initialComments = commentsResponse?.data?.comments || [];

  const upvotesOnPost = postVotesResponse?.data?.upvotes || 0;
  const downvotesOnPost = postVotesResponse?.data?.downvotes || 0;
  const userVote = postVotesResponse?.data?.user_vote || 0;
  const isMaxWidth768 = useMediaQuery('(max-width: 768px)');
  const isFirstRender = useRef(true);

  const [currentVote, setCurrentVote] = useState(userVote);
  const [upvotes, setUpvotes] = useState(upvotesOnPost);
  const [downvotes, setDownvotes] = useState(downvotesOnPost);

  const commentsSectionRef = useRef(null);

  const [tinymceIsLoaded, setTinymceIsLoaded] = useState(false);
  const [tinymceLoadedTimeoutOver, setTinymceLoadedTimeoutOver] =
    useState(false);

  const commentsSectionCanBeShown =
    !isPreview && (tinymceIsLoaded || tinymceLoadedTimeoutOver);

  const [canLoadComments, setCanLoadComments] = useState(false);

  // Comments section is meant to be displayed after post content is loaded
  // This useEffect is used to ensure that if the post content takes too
  // long to load, it will display the comments section
  useEffect(() => {
    const timer = setTimeout(() => {
      setTinymceLoadedTimeoutOver(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          commentsSectionCanBeShown &&
          !canLoadComments
        ) {
          setCanLoadComments(true);
        }
      },
      {
        threshold: 1,
      },
    );

    const commentsSection = commentsSectionRef.current;
    if (commentsSection) {
      observer.observe(commentsSection);
    }

    return () => {
      if (commentsSection) {
        observer.unobserve(commentsSection);
      }
    };
  }, [
    canLoadComments,
    commentsSectionCanBeShown,
    tinymceIsLoaded,
    tinymceLoadedTimeoutOver,
  ]);

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

  const postContainerContainer = useRef(null);
  const commentBadge = (
    <div
      className={`${styles.commentBadge} ${isMaxWidth768 ? styles.horizontal : ''}`}
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
    if (commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  return (
    <div ref={postContainerContainer} className={styles.postContainerContainer}>
      {isPreview && (
        <div className={styles.watermarkContainer}>
          <div className={styles.previewWatermark}>PREVIEW</div>
        </div>
      )}
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
              {!tinymceIsLoaded && (
                <div className={styles.loadingPostContent}>
                  <l-ring
                    size='30'
                    stroke='3'
                    color='black'
                    speed='1.5'
                  ></l-ring>
                </div>
              )}
              <TinyMCEView
                content={post.content}
                setTinymceIsLoaded={setTinymceIsLoaded}
              ></TinyMCEView>
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
            {commentsSectionCanBeShown && (
              <CommentsSection
                post={post}
                highlightedComment={highlightedComment}
                canLoadComments={canLoadComments}
                numberOfComments={initialComments.length}
                commentsSectionRef={commentsSectionRef}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ViewPost.loader = loader;
ViewPost.previewLoader = previewLoader;

export default ViewPost;
