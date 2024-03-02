import styles from './Comment.module.css';
import toRelativeTimeLuxon from '../../../utils/toRelativeTimeLuxon';
import { NavLink } from 'react-router-dom';
import VotingWidget from '../../../components/VotingWidget/VotingWidget';
import { useEffect, useRef, useState } from 'react';
import PostAPI from '../../../api/PostAPI';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ExpandableContent from '../../../components/ExpandableContent/ExpandableContent';

const voteOptions = {
  UPVOTE: 1,
  NEUTRAL: 0,
  DOWNVOTE: -1,
};

function Comment({ commentData }) {
  const profilePhoto = commentData.author.profile_photo;
  const commentContent = commentData.content;
  const username = commentData.author.username;
  const commentCreationDate = toRelativeTimeLuxon(commentData.created_at);
  const commentUserId = commentData.author._id;
  const postId = commentData.post;
  const commentId = commentData._id;
  const isFirstRender = useRef(true);
  const commentLines = commentContent.split('\n');

  const [currentVote, setCurrentVote] = useState(commentData.user_vote || 0);
  const [upvotes, setUpvotes] = useState(commentData.upvotes);
  const [downvotes, setDownvotes] = useState(commentData.downvotes);

  useEffect(() => {
    async function updateVote() {
      try {
        if (currentVote === voteOptions.NEUTRAL) {
          const vote = await PostAPI.deleteCommentVoteOnPost(postId, commentId);
        } else if (
          currentVote === voteOptions.UPVOTE ||
          currentVote === voteOptions.DOWNVOTE
        ) {
          const updatedVote = await PostAPI.updateCommentVoteOnPost(
            postId,
            commentId,
            {
              vote_value: currentVote,
            },
          );
        }
      } catch (err) {
        console.error(err);
      }
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
  }, [commentId, currentVote, postId]);

  return (
    <div className={styles.comment}>
      <img
        src={
          profilePhoto !== null
            ? profilePhoto
            : '/images/default_profile_photo.jpg'
        }
        alt='user profile pic'
      />
      <div className={styles.rightSide}>
        <p>
          <NavLink to={`/users/${commentUserId}`}>@{username}</NavLink>
          <span className={styles.commentCreationDate}>
            {' '}
            • {commentCreationDate}
          </span>
        </p>
        <ExpandableContent>
          {commentLines.map((line, index) => (
            <span className={styles.commentLine} key={index}>
              {line}
            </span>
          ))}
        </ExpandableContent>
        <div className={styles.votesAndReply}>
          <VotingWidget
            orientation={'horizontal'}
            currentVote={currentVote}
            setCurrentVote={setCurrentVote}
            upvotes={upvotes}
            downvotes={downvotes}
            setUpvotes={setUpvotes}
            setDownvotes={setDownvotes}
          />
        </div>
      </div>
    </div>
  );
}

Comment.propTypes = {
  commentData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      profile_photo: PropTypes.string,
      username: PropTypes.string.isRequired,
    }).isRequired,
    created_at: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    user_vote: PropTypes.oneOf([voteOptions.UPVOTE, voteOptions.DOWNVOTE]),
    upvotes: PropTypes.number.isRequired,
    downvotes: PropTypes.number.isRequired,
    post: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
};

export default Comment;
