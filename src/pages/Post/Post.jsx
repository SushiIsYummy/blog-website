import { useLoaderData, NavLink } from 'react-router-dom';
import styles from './Post.module.css';
import PostAPI from '../../api/PostAPI';
import TinyMCEView from '../../components/TinyMCE/TinyMCEView';
import toRelativeTimeLuxon from '../../utils/toRelativeTimeLuxon';
import { useContext, useEffect, useRef, useState } from 'react';
import VotingWidget from '../../components/VotingWidget/VotingWidget';
import AuthContext from '../../context/AuthProvider';
import _debounce from 'lodash/debounce';

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
  const { user } = useContext(AuthContext);
  const post = postResponse.data.post;
  const upvotesOnPost = votesResponse.data.upvotes;
  const downvotesOnPost = votesResponse.data.downvotes;
  const userVote = votesResponse.data.user_vote;
  const [voteOption, setVoteOption] = useState(userVote || 'NEUTRAL');
  // const isFirstRender = useRef(true);

  useEffect(() => {
    async function updateVote() {
      try {
        if (voteOption === 'NEUTRAL') {
          const vote = PostAPI.deleteVoteOnPost(post._id);
        } else {
          const updatedVote = PostAPI.updateVoteOnPost(post._id, {
            vote_value: voteOption,
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
  }, [post._id, userVote, voteOption]);

  console.log(votesResponse);
  console.log(user.userId);

  function handleVote(vote) {
    setVoteOption(vote);
  }

  return (
    <div className={styles.postContainer}>
      <div className={styles.post}>
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
            <p className={styles.authorName}>
              {post.author.first_name} {post.author.last_name}
            </p>
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
        <div className={styles.votesAndComments}>
          <VotingWidget
            initialVoteOption={voteOption}
            initialUpvotes={upvotesOnPost}
            initialDownvotes={downvotesOnPost}
            onVote={handleVote}
          />
        </div>
        <div className={styles.postContent}>
          <TinyMCEView content={post.content}></TinyMCEView>
        </div>
      </div>
    </div>
  );
}

export default Post;
