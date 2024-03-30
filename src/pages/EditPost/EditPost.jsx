import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import styles from './EditPost.module.css';
import BlogAPI from '../../api/BlogAPI';
import PostAPI from '../../api/PostAPI';
import TinyMCEEdit from '../../components/TinyMCE/TinyMCEEdit';
import { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import EditPostModal from './EditPostModal/EditPostModal';
import AutoResizeTextarea from '../../components/AutoResizeTextarea/AutoResizeTextarea';
import checkImageValidity from '../../utils/checkImageValidity';
import useEffectAfterMount from '../../hooks/useEffectAfterMount';

export async function loader({ params }) {
  try {
    let postResponse = null;
    if (params.postId) {
      postResponse = await PostAPI.getPostById(params.postId);
    }
    return { postResponse };
  } catch (err) {
    console.error(err);
  }
  return null;
}

function EditPost() {
  const { postResponse } = useLoaderData();
  const [title, setTitle] = useState(postResponse?.data?.post?.title ?? '');
  const [subheading, setSubheading] = useState(
    postResponse?.data?.post?.subheading ?? '',
  );
  const [content, setContent] = useState(
    postResponse?.data?.post?.content ?? '',
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageInput, setCoverImageInput] = useState('');
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [savingPost, setSavingPost] = useState(false);
  const [savedPost, setSavedPost] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { postId } = useParams();
  console.log(postId);
  const postIsPublished = postResponse?.data?.post?.published || false;

  const contentRef = useRef(null);
  const topPartRef = useRef(null);

  // TODO: do not allow user to create a post without having at least one blog

  useEffectAfterMount(() => {
    setSavedPost(false);
  }, [title, subheading, content]);

  useEffect(() => {
    async function getUserBlogs() {
      try {
        const blogsResponse = await BlogAPI.getBlogsByUser(user.userId);
        setUserBlogs(blogsResponse.data.blogs);
        setSelectedBlogId(blogsResponse.data.blogs[0]._id);
      } catch (err) {
        console.error(err);
      }
    }
    if (user.userId) {
      getUserBlogs();
    }
  }, [user]);

  const handleImageUpload = async (imageUrl) => {
    const isValidImage = await checkImageValidity(imageUrl);
    if (isValidImage) {
      setCoverImage(imageUrl);
    } else {
      setCoverImage(null);
    }
  };

  // below function is for uploading local files
  // const handleImageUpload = (event) => {
  //   const selectedImage = event.target.files[0];

  //   if (selectedImage) {
  //     const reader = new FileReader();

  //     reader.onload = function (event) {
  //       const imageData = event.target.result;
  //       setCoverImageData(imageData);
  //     };

  //     reader.readAsDataURL(selectedImage);
  //     setCoverImage(selectedImage);
  //   }
  // };

  const handleOnClearButtonClick = () => {
    setCoverImage(null);
    setCoverImageInput('');
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };
  const handleSubheadingChange = (newSubheading) => {
    setSubheading(newSubheading);
  };
  const handleContentChange = (newContent, editor) => {
    setContent(newContent);
  };

  const publishPost = async () => {
    try {
      const response = await PostAPI.createPost(selectedBlogId, {
        title,
        subheading,
        content,
        published: true,
        cover_image: coverImage,
      });
      const postId = response?.data?.post?._id;
      if (postId) {
        navigate(`/posts/${postId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function updatePost() {
    try {
      setSavingPost(true);
      const updatedPost = await PostAPI.updatePost(postId, {
        title,
        subheading,
        content,
      });
      setSavedPost(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPost(false);
    }
  }

  const handleEditorInit = (evt, editor) => {
    contentRef.current = editor;
  };

  return (
    <div className={styles.editPost}>
      <div className={styles.topPart} ref={topPartRef}>
        {savingPost ? (
          <p>Saving...</p>
        ) : (
          savedPost !== null && <p>{savedPost ? 'Saved' : 'Unsaved'}</p>
        )}
        <button
          className={styles.updateButton}
          onClick={updatePost}
          disabled={savedPost === null ? true : savedPost}
        >
          Update
        </button>

        {!postIsPublished && (
          <button
            className={styles.publishButton}
            onClick={() => setModalOpen(true)}
          >
            Publish
          </button>
        )}
      </div>
      <div className={styles.titleSubheadingContent}>
        <div className={styles.titleAndSubheading}>
          <div className={styles.title}>
            <AutoResizeTextarea
              content={title}
              allowLineBreak={false}
              onTextChange={handleTitleChange}
              placeholder='Title'
            />
          </div>
          <div className={styles.subheading}>
            <AutoResizeTextarea
              content={subheading}
              allowLineBreak={false}
              onTextChange={handleSubheadingChange}
              placeholder='Subheading'
            />
          </div>
        </div>
        <div
          className={styles.contentContainer}
          style={{
            maxHeight: `calc(100vh - 52px - ${topPartRef.current ? `${topPartRef.current.clientHeight}px` : '0'})`,
          }}
        >
          <TinyMCEEdit
            onInit={handleEditorInit}
            initialValue={content}
            onChange={handleContentChange}
            contentStyle={`body { overflow-y: auto!important; }`}
          />
        </div>
      </div>
      {modalOpen && (
        <EditPostModal
          setModalOpen={setModalOpen}
          handleImageUpload={handleImageUpload}
          handleOnClearButtonClick={handleOnClearButtonClick}
          coverImage={coverImage}
          selectedBlogId={selectedBlogId}
          setSelectedBlogId={setSelectedBlogId}
          userBlogs={userBlogs}
          publishPost={publishPost}
          coverImageInput={coverImageInput}
          setCoverImageInput={setCoverImageInput}
        />
      )}
    </div>
  );
}

export default EditPost;
