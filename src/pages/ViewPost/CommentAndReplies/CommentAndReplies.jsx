import { useState } from 'react';
import Comment from '../Comment/Comment';
import RepliesList from '../RepliesList/RepliesList';

function CommentAndReplies({
  commentData,
  profilePicSize = 40,
  commentRef,
  maxCreatedAt,
}) {
  const postId = commentData.post;
  const parentId = commentData.parent;
  const commentId = commentData._id;
  const commentRepliesCount = commentData.replies;

  const [repliesIsOpen, setRepliesIsOpen] = useState(false);
  const [newUserReplies, setNewUserReplies] = useState([]);

  return (
    <div ref={commentRef}>
      <Comment
        commentData={commentData}
        profilePicSize={profilePicSize}
        parentId={parentId}
        setNewUserReplies={setNewUserReplies}
        maxCreatedAt={maxCreatedAt}
      >
        <RepliesList
          parentId={commentId}
          postId={postId}
          commentRepliesCount={commentRepliesCount}
          repliesIsOpen={repliesIsOpen}
          newUserReplies={newUserReplies}
          setNewUserReplies={setNewUserReplies}
          setRepliesIsOpen={setRepliesIsOpen}
          maxCreatedAt={maxCreatedAt}
        />
      </Comment>
    </div>
  );
}

export default CommentAndReplies;
