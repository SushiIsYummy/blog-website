import { createContext, useState } from 'react';

const DeletePostModalContext = createContext();

export const DeletePostModalProvider = ({ children }) => {
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [postId, setPostId] = useState(null);
  const [postTitle, setPostTitle] = useState(null);

  const openDeletePostModal = (id, postTitle) => {
    setPostId(id);
    if (postTitle === '') {
      setPostTitle('(Untitled)');
    } else {
      setPostTitle(postTitle);
    }
    setIsDeletePostModalOpen(true);
  };

  const closeDeletePostModal = () => {
    setIsDeletePostModalOpen(false);
    resetInputs();
  };

  const resetInputs = () => {
    setPostId(null);
    setPostTitle(null);
  };

  return (
    <DeletePostModalContext.Provider
      value={{
        isDeletePostModalOpen,
        postId,
        postTitle,
        openDeletePostModal,
        closeDeletePostModal,
      }}
    >
      {children}
    </DeletePostModalContext.Provider>
  );
};

export default DeletePostModalContext;
