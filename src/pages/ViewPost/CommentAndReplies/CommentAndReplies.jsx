import { useState } from 'react';
import Comment from '../Comment/Comment';
import RepliesList from '../RepliesList/RepliesList';

function CommentAndReplies({
  commentData,
  profilePicSize = 40,
  profilePic,
  commentRef,
  maxCreatedAt,
  updateComment,
}) {
  const postId = commentData.post;
  const parentId = commentData.parent;
  const commentId = commentData._id;
  const commentRepliesCount = commentData.replies;

  const [repliesIsOpen, setRepliesIsOpen] = useState(false);
  const [newUserReplies, setNewUserReplies] = useState([]);

  function updateNewUserReply(commentId, updatedComment) {
    setNewUserReplies((prevReplies) =>
      prevReplies.map((reply) =>
        reply._id === commentId ? updatedComment : reply,
      ),
    );
  }

  return (
    <div ref={commentRef}>
      <Comment
        commentData={commentData}
        profilePicSize={profilePicSize}
        profilePic={profilePic}
        parentId={parentId}
        setNewUserReplies={setNewUserReplies}
        updateNewUserReply={updateNewUserReply}
        maxCreatedAt={maxCreatedAt}
        updateComment={updateComment}
      />
      <RepliesList
        parentId={commentId}
        postId={postId}
        commentRepliesCount={commentRepliesCount}
        repliesIsOpen={repliesIsOpen}
        newUserReplies={newUserReplies}
        setNewUserReplies={setNewUserReplies}
        updateNewUserReply={updateNewUserReply}
        setRepliesIsOpen={setRepliesIsOpen}
        maxCreatedAt={maxCreatedAt}
        updateComment={updateComment}
      />
    </div>
  );
}

export default CommentAndReplies;
