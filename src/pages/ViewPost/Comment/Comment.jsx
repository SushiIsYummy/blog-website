import styles from './Comment.module.css';
import toRelativeTimeLuxon from '../../../utils/toRelativeTimeLuxon';
import { NavLink } from 'react-router-dom';
import VotingWidget from '../../../components/VotingWidget/VotingWidget';
import { useEffect, useRef, useState } from 'react';
import PostAPI from '../../../api/PostAPI';
import _ from 'lodash';
import ExpandableContent from '../../../components/ExpandableContent/ExpandableContent';
import UserComment from '../UserComment/UserComment';
import { useContext } from 'react';
import AuthContext from '../../../context/AuthProvider';
import useReplies from '../useReplies';

const voteOptions = {
  UPVOTE: 1,
  NEUTRAL: 0,
  DOWNVOTE: -1,
};

function Comment({
  commentData,
  profilePicSize = 40,
  parentId = null,
  setNewUserReplies,
  maxCreatedAt,
  children: repliesList,
}) {
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
  const userReplyTextArea = useRef(null);

  const isFirstRender = useRef(true);
  const [currentVote, setCurrentVote] = useState(commentData.user_vote || 0);
  const [upvotes, setUpvotes] = useState(commentData.upvotes);
  const [downvotes, setDownvotes] = useState(commentData.downvotes);

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

  const { addReplyOnComment } = useReplies({
    parentId: parentId ?? commentId,
    postId,
    enabled: false,
    maxCreatedAt,
  });

  async function onUserCommentReplyActionClick(content) {
    try {
      setUserCommentReplyLoading(true);

      const parentCommentId = parentId ?? commentId;
      const createdComment = await addReplyOnComment({
        postId,
        blogId,
        parentId: parentCommentId,
        content,
      });

      if (setNewUserReplies) {
        setNewUserReplies((parentReplies) => [
          ...parentReplies,
          createdComment.data.comment,
        ]);
      }

      setUserReplyOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUserCommentReplyLoading(false);
    }
  }

  async function onUserCommentReplyCancelClick() {
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
        {repliesList}
      </div>
    </div>
  );
}

export default Comment;
