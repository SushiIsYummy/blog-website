import { useLoaderData, NavLink } from 'react-router-dom';
import styles from './Post.module.css';
import PostAPI from '../../api/PostAPI';
import TinyMCEView from '../../components/TinyMCE/TinyMCEView';
import toRelativeTimeLuxon from '../../utils/toRelativeTimeLuxon';
import { useEffect, useRef, useState } from 'react';
import VotingWidget from '../../components/VotingWidget/VotingWidget';
import _debounce from 'lodash/debounce';
import { useMediaQuery } from '@react-hook/media-query';
import { FaRegComment } from 'react-icons/fa';

export async function loader({ params }) {
  try {
    const [postResponse, votesResponse] = await Promise.all([
      PostAPI.getPostById(params.postId),
      PostAPI.getVotesOnPost(params.postId),
    ]);
    return { postResponse, votesResponse };
  } catch (err) {
    console.error(err);
  }
  return null;
}

function Post() {
  let { postResponse, votesResponse } = useLoaderData();
  const post = postResponse.data.post;
  const upvotesOnPost = votesResponse.data.upvotes;
  const downvotesOnPost = votesResponse.data.downvotes;
  const userVote = votesResponse.data.user_vote;
  const isMaxWidth768 = useMediaQuery('(max-width: 768px)');
  // const isFirstRender = useRef(true);

  const [currentVote, setCurrentVote] = useState(userVote);
  const [upvotes, setUpvotes] = useState(upvotesOnPost);
  const [downvotes, setDownvotes] = useState(downvotesOnPost);

  useEffect(() => {
    async function updateVote() {
      try {
        if (currentVote === 'NEUTRAL') {
          const vote = PostAPI.deleteVoteOnPost(post._id);
        } else {
          const updatedVote = PostAPI.updateVoteOnPost(post._id, {
            vote_value: currentVote,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }

    // prevent sending unnecessary request on first render
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }

    const debouncedRequest = _debounce(updateVote, 1000);
    debouncedRequest();

    // update vote even if user closes tab or refreshes
    // before debounce delay is finished
    function handleBeforeUnload() {
      debouncedRequest.flush();
      updateVote();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      debouncedRequest.cancel();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentVote, post._id, userVote]);

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
          <FaRegComment style={{ width: '20px', height: '20px' }} />
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
                  </NavLink>
                  &nbsp;• {toRelativeTimeLuxon(post.created_at)}
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
              <FaRegComment style={{ width: '20px', height: '20px' }} />
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
              <FaRegComment style={{ width: '20px', height: '20px' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
