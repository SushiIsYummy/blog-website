import styles from './Comment.module.css';
import toRelativeTimeLuxon from '../../../utils/toRelativeTimeLuxon';
import { NavLink } from 'react-router-dom';
import VotingWidget from '../../../components/VotingWidget/VotingWidget';
import { useContext, useEffect, useRef, useState } from 'react';
import PostAPI from '../../../api/PostAPI';
import _ from 'lodash';
import ExpandableContent from '../../../components/ExpandableContent/ExpandableContent';
import UserComment from '../UserComment/UserComment';
import useReplies from '../useReplies';
import OverflowMenu from './OverflowMenu/OverflowMenu';
import CommentEditForm from '../CommentEditForm/CommentEditForm';
import AuthContext from '../../../context/AuthProvider';

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
  updateNewUserReply,
  maxCreatedAt,
  updateComment,
}) {
  const profilePhoto =
    commentData.author.profile_photo ?? '/images/default_profile_photo.jpg';
  const commentContent = commentData.content;
  const username = commentData.author.username;
  const commentCreationDate = toRelativeTimeLuxon(commentData.created_at);
  const commentAuthorId = commentData.author._id;
  const postId = commentData.post;
  const blogId = commentData.blog;
  const commentId = commentData._id;
  const commentLines = commentContent.split('\n');
  const lastEditedAt = commentData.last_edited_at;
  const userReplyTextArea = useRef(null);
  const userEditTextArea = useRef(null);

  const { user, isLoggedIn } = useContext(AuthContext);
  const userIsCommentAuthor = user.userId === commentAuthorId;

  const isFirstRender = useRef(true);
  const [currentVote, setCurrentVote] = useState(commentData.user_vote || 0);
  const [upvotes, setUpvotes] = useState(commentData.upvotes);
  const [downvotes, setDownvotes] = useState(commentData.downvotes);

  const [userReplyOpen, setUserReplyOpen] = useState(false);
  const [userCommentReplyLoading, setUserCommentReplyLoading] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

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
    if (userReplyOpen && userReplyTextArea.current) {
      userReplyTextArea.current.focus();
    }
  }, [userReplyOpen]);

  // useEffect(() => {
  //   if (isEditMode && userEditTextArea.current) {
  //     userEditTextArea.current.focus();
  //     userEditTextArea.current.setSelectionRange(
  //       userEditTextArea.current.value.length,
  //       userEditTextArea.current.value.length,
  //     );
  //   }
  // }, [isEditMode]);

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

  function focusOnReplyTextArea() {
    if (userReplyTextArea.current) {
      userReplyTextArea.current.focus();
    }
  }

  const [savingEdit, setSavingEdit] = useState(false);

  async function handleEditSaveClick(content) {
    setSavingEdit(true);
    try {
      const updatedComment = await updateComment({
        commentId,
        newComment: content,
      });
      updateNewUserReply(commentId, updatedComment.data.comment);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingEdit(false);
      setIsEditMode(false);
    }
  }

  function isActionButtonEnabled(newText) {
    return newText !== commentContent;
  }

  if (savingEdit) {
    return (
      <div className={styles.loadingIcon}>
        <l-ring size='30' stroke='3' color='black' speed='1.5'></l-ring>
      </div>
    );
  }

  return (
    <div className={styles.comment}>
      <img
        src={profilePhoto}
        alt='user profile pic'
        style={{
          width: `${profilePicSize}px`,
          height: `${profilePicSize}px`,
        }}
      />
      <div className={styles.rightSide}>
        {isEditMode ? (
          <CommentEditForm
            textareaRef={userEditTextArea}
            initialText={commentContent}
            onActionButtonClick={handleEditSaveClick}
            onCancelButtonClick={() => setIsEditMode(false)}
            actionButtonName={'Save'}
            isActionButtonEnabled={isActionButtonEnabled}
          />
        ) : (
          <>
            <p>
              <NavLink to={`/users/${commentAuthorId}`}>@{username}</NavLink>
              <span className={styles.commentCreationDate}>
                {' '}
                • {commentCreationDate}
                {lastEditedAt ? <span> (edited)</span> : null}
              </span>
            </p>
            <div className={styles.content}>
              <ExpandableContent>
                {commentLines.map((line, index) => (
                  <span className={styles.commentLine} key={index}>
                    {line}
                  </span>
                ))}
              </ExpandableContent>
            </div>
            <div className={styles.commentActionBar}>
              <div className={styles.leftSide}>
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
                    focusOnReplyTextArea();
                  }}
                >
                  Reply
                </button>
              </div>
              {isLoggedIn && userIsCommentAuthor ? (
                <OverflowMenu
                  // commentId={commentId}
                  onEditClick={() => {
                    setIsEditMode(true);
                    // focusOnEditTextArea();
                  }}
                />
              ) : null}
            </div>
            {!userCommentReplyLoading && userReplyOpen && (
              <UserComment
                textareaRef={userReplyTextArea}
                profilePic={profilePhoto}
                profilePicSize={30}
                onUserCommentActionClick={onUserCommentReplyActionClick}
                onUserCommentCancelClick={onUserCommentReplyCancelClick}
                actionButtonName={'Reply'}
                actionButtonsOpenInitially={true}
              />
            )}
            {userCommentReplyLoading && (
              <div className={styles.loadingIcon}>
                <l-ring size='30' stroke='3' color='black' speed='1.5'></l-ring>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Comment;
