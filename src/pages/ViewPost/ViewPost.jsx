import { useLoaderData, NavLink, useParams } from 'react-router-dom';
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
import { useInfiniteQuery } from '@tanstack/react-query';

const COMMENT_ORDER_BY_OPTIONS = {
  NEWEST: 'newest',
  RANK: 'rank',
};

const COMMENT_ORDER_BY_OPTIONS_ARRAY = ['newest', 'rank'];

async function loader({ request, params }) {
  try {
    const urlSearchParams = new URL(request.url).searchParams;
    const highlightedCommentIdQuery = urlSearchParams.get('hc');
    let orderByQuery = urlSearchParams.get('order_by');
    orderByQuery = COMMENT_ORDER_BY_OPTIONS_ARRAY.includes(orderByQuery)
      ? orderByQuery
      : COMMENT_ORDER_BY_OPTIONS.RANK;
    // console.log(highlightedCommentIdQuery);
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
        PostAPI.getCommentsOnPost(params.postId, { order_by: orderByQuery }),
      ]);
    console.log(highlightedComment);
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

// const excluded_ids = [];
// for (let i = 0; i < 200000; i++) {
//   excluded_ids.push('65cb4edaa1ae05a45a35379b');
// }

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
  const initialCommentsWithoutHighlightedComment = initialComments
    ? initialComments.filter(
        (comment) =>
          highlightedComment && highlightedComment._id !== comment._id,
      )
    : [];
  // console.log(initialComments);
  // console.log(initialCommentsWithoutHighlightedComment);
  const upvotesOnPost = postVotesResponse?.data?.upvotes || 0;
  const downvotesOnPost = postVotesResponse?.data?.downvotes || 0;
  const userVote = postVotesResponse?.data?.user_vote || 0;
  const isMaxWidth768 = useMediaQuery('(max-width: 768px)');
  const isFirstRender = useRef(true);

  const [currentVote, setCurrentVote] = useState(userVote);
  const [upvotes, setUpvotes] = useState(upvotesOnPost);
  const [downvotes, setDownvotes] = useState(downvotesOnPost);
  // const [comments, setComments] = useState(
  //   (highlightedComment
  //     ? initialCommentsWithoutHighlightedComment
  //     : initialComments) || [],
  // );
  const [newUserComments, setNewUserComments] = useState([]);
  const [userCommentLoading, setUserCommentLoading] = useState(false);

  const { postId } = useParams();
  const [commentsOrderBy, setCommentsOrderBy] = useState(
    COMMENT_ORDER_BY_OPTIONS.RANK,
  );
  console.log(`comments order by: ${commentsOrderBy}`);
  const {
    isPending,
    isFetching,
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['comments', { commentsOrderBy }],
    queryFn: getCommentsWithStaticCursor,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.paging.cursors.next;
    },
    gcTime: 0,
  });

  let limit = 1;
  function getCommentsWithStaticCursor({ pageParam = null }) {
    return PostAPI.getCommentsOnPost(postId, {
      order_by: commentsOrderBy,
      limit: limit,
      cursor: pageParam,
    });
  }

  // function getCommentsWithoutStaticCursor() {
  //   return PostAPI.getCommentsOnPostWithExcludedCommentIds(
  //     postId,
  //     commentsOrderBy,
  //     { limit: limit },
  //     excluded_ids,
  //     // excludedIds,
  //   );
  // }

  // console.log(data);
  // console.log(comments);

  // console.log(urlSearchParams);
  // const url = new URL(window.location.href);
  // const urlSearchParams = url.searchParams;
  // const orderBySearchParam = urlSearchParams.get('order_by');
  // const orderByValue = COMMENT_ORDER_BY_OPTIONS_ARRAY.includes(
  //   orderBySearchParam,
  // )
  //   ? orderBySearchParam
  //   : COMMENT_ORDER_BY_OPTIONS.RANK;
  // const [commentsOrderBy, setCommentsOrderBy] = useState(
  //   COMMENT_ORDER_BY_OPTIONS.RANK,
  // );

  // useEffect(() => {
  //   const url = new URL(window.location.href);
  //   const urlSearchParams = url.searchParams;
  //   urlSearchParams.set('order_by', commentsOrderBy);
  //   window.history.replaceState({}, '', url);
  // }, [commentsOrderBy]);

  // useEffect(() => {
  //   const url = new URL(window.location.href);
  //   const urlSearchParams = url.searchParams;
  //   const orderBy = urlSearchParams.get('order_by');
  //   if (!COMMENT_ORDER_BY_OPTIONS_ARRAY.includes(orderBy) && !isPreview) {
  //     urlSearchParams.set('order_by', COMMENT_ORDER_BY_OPTIONS.RANK);
  //     window.history.replaceState({}, '', url);
  //   }
  // }, [isPreview]);

  // console.log(comments);
  useEffect(() => {});

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

  async function handleUserCommentActionClick(comment) {
    try {
      setUserCommentLoading(true);
      const createdComment = await PostAPI.createCommentOnPost(post._id, {
        content: comment,
        blog: post.blog._id,
      });
      console.log(createdComment);
      setNewUserComments((newUserComments) => [
        createdComment.data.postComment,
        ...newUserComments,
      ]);
      // setComments([createdComment.data.postComment, ...comments]);
    } catch (err) {
      console.error(err);
    } finally {
      setUserCommentLoading(false);
    }
  }

  const postContainerContainer = useRef(null);
  const commentsSection = useRef(null);
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
    if (commentsSection.current) {
      commentsSection.current.scrollIntoView({
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
            <div ref={commentsSection} className={styles.commentsSection}>
              <div className={styles.commentsHeader}>
                <h2 className={styles.commentsLabel}>
                  {initialComments.length} Comments
                </h2>
                <select
                  value={commentsOrderBy}
                  onChange={(e) => {
                    setNewUserComments([]);
                    setCommentsOrderBy(e.target.value);
                  }}
                >
                  <option value='rank'>Top Comments</option>
                  <option value='newest'>Newest</option>
                </select>
              </div>
              {!isPreview && (
                <>
                  <div className={styles.userComment}>
                    {!userCommentLoading ? (
                      <>
                        <UserComment
                          profilePic={post.author.profile_photo}
                          onUserCommentActionClick={
                            handleUserCommentActionClick
                          }
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
                    {/* {!commentsIsFetching &&
                      comments.map((comment) => {
                        return (
                          <Comment key={comment._id} commentData={comment} />
                        );
                      })} */}
                    {newUserComments.map((comment) => (
                      <Comment key={comment._id} commentData={comment} />
                    ))}
                    {data &&
                      data.pages.map((page, pageIndex) => (
                        <>
                          {page.data.comments.map((comment) => (
                            <Comment key={comment._id} commentData={comment} />
                          ))}
                        </>
                      ))}
                    {hasNextPage && (
                      <button onClick={() => fetchNextPage()}>
                        get next page
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ViewPost.loader = loader;
ViewPost.previewLoader = previewLoader;

export default ViewPost;
