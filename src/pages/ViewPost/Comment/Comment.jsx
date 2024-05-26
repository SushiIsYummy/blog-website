import styles from './Comment.module.css';
import toRelativeTimeLuxon from '../../../utils/toRelativeTimeLuxon';
import { NavLink } from 'react-router-dom';
import VotingWidget from '../../../components/VotingWidget/VotingWidget';
import { useEffect, useRef, useState } from 'react';
import PostAPI from '../../../api/PostAPI';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ExpandableContent from '../../../components/ExpandableContent/ExpandableContent';
import UserComment from '../UserComment/UserComment';
import { useContext } from 'react';
import AuthContext from '../../../context/AuthProvider';
import RepliesList from '../RepliesList/RepliesList';

const voteOptions = {
  UPVOTE: 1,
  NEUTRAL: 0,
  DOWNVOTE: -1,
};

function Comment({
  commentData,
  profilePicSize = 40,
  parentId = null,
  parentReplies,
  setParentReplies,
}) {
  console.log(commentData);
  const { user } = useContext(AuthContext);
  const profilePhoto = commentData.author.profile_photo;
  const commentContent = commentData.content;
  const username = commentData.author.username;
  const commentCreationDate = toRelativeTimeLuxon(commentData.created_at);
  const commentUserId = commentData.author._id;
  const postId = commentData.post;
  const blogId = commentData.blog;
  const commentId = commentData._id;
  const commentLines = commentContent.split('\n');
  const isParent = commentData.parent === null;
  const commentRepliesCount = commentData.replies;
  const userReplyTextArea = useRef(null);

  const isFirstRender = useRef(true);
  const [currentVote, setCurrentVote] = useState(commentData.user_vote || 0);
  const [upvotes, setUpvotes] = useState(commentData.upvotes);
  const [downvotes, setDownvotes] = useState(commentData.downvotes);

  const [repliesIsOpen, setRepliesIsOpen] = useState(false);
  const [localReplies, setLocalReplies] = useState([]);
  const [localNewReplies, setLocalNewReplies] = useState([]);
  const [userReplyOpen, setUserReplyOpen] = useState(false);
  const [userCommentReplyLoading, setUserCommentReplyLoading] = useState(false);

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

  useEffect(() => {
    if (userReplyOpen) {
      focusOnUserReplyTextArea();
    }
  }, [userReplyOpen]);

  async function onUserCommentReplyActionClick(comment) {
    try {
      setUserCommentReplyLoading(true);
      const createdComment = await PostAPI.createCommentOnPost(postId, {
        content: comment,
        parent: parentId || commentId,
        blog: blogId,
      });
      if (!isParent) {
        setParentReplies([...parentReplies, createdComment.data.postComment]);
      }
      if (isParent) {
        setLocalReplies([...localReplies, createdComment.data.postComment]);
      }
      if (commentRepliesCount > 0) {
        setLocalNewReplies([
          ...localNewReplies,
          createdComment.data.postComment,
        ]);
      }
      setUserReplyOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUserCommentReplyLoading(false);
    }
  }

  async function onUserCommentReplyCancelClick(comment) {
    setUserReplyOpen(false);
  }

  function focusOnUserReplyTextArea() {
    if (userReplyTextArea.current) {
      userReplyTextArea.current.focus();
    }
  }

  return (
    <div className={styles.comment}>
      <img
        src={
          profilePhoto !== null
            ? profilePhoto
            : '/images/default_profile_photo.jpg'
        }
        alt='user profile pic'
        style={{ width: `${profilePicSize}px`, height: `${profilePicSize}px` }}
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
          <button
            className={styles.replyButton}
            onClick={() => {
              setUserReplyOpen(true);
              focusOnUserReplyTextArea();
            }}
          >
            Reply
          </button>
        </div>
        {!userCommentReplyLoading && userReplyOpen && (
          <UserComment
            textareaRef={userReplyTextArea}
            profilePic={user.profile_photo}
            profilePicSize={30}
            onUserCommentActionClick={onUserCommentReplyActionClick}
            onUserCommentCancelClick={onUserCommentReplyCancelClick}
            actionButtonName={'Reply'}
            actionButtonsOpenInitially={true}
          />
        )}
        {userCommentReplyLoading && (
          <div className={styles.userCommentLoading}>
            <l-ring size='30' stroke='3' color='black' speed='1.5'></l-ring>
          </div>
        )}
        {isParent && (
          <RepliesList
            textareaRef={userReplyTextArea}
            parentId={commentId}
            postId={postId}
            commentRepliesCount={commentRepliesCount}
            repliesIsOpen={repliesIsOpen}
            setRepliesIsOpen={setRepliesIsOpen}
            replies={localReplies}
            setReplies={setLocalReplies}
          />
        )}
        <div className={styles.repliesToOriginalComment}>
          {isParent &&
            !repliesIsOpen &&
            localNewReplies.map((reply) => {
              return (
                <Comment
                  key={reply._id}
                  profilePicSize={30}
                  commentData={reply}
                  parentReplies={localReplies}
                  setParentReplies={setLocalReplies}
                  parentId={commentId}
                />
              );
            })}
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
    user_vote: PropTypes.oneOf([
      voteOptions.UPVOTE,
      voteOptions.NEUTRAL,
      voteOptions.DOWNVOTE,
    ]),
    upvotes: PropTypes.number.isRequired,
    downvotes: PropTypes.number.isRequired,
    post: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
};

export default Comment;
