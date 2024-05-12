import { useLoaderData, useParams } from 'react-router-dom';
import styles from './EditPost.module.css';
import PostAPI from '../../api/PostAPI';
import TinyMCEEdit from '../../components/TinyMCE/TinyMCEEdit';
import { useRef, useState, useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import AutoResizeTextarea from '../../components/AutoResizeTextarea/AutoResizeTextarea';
import useEffectAfterMount from '../../hooks/useEffectAfterMount';
import OverflowMenu from './OverflowMenu/OverflowMenu';
import PublishPostModal from './PublishPostModal/PublishPostModal';

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
  const [currentCoverImage, setCurrentCoverImage] = useState(
    postResponse?.data?.post?.cover_image ?? null,
  );

  const [savingPost, setSavingPost] = useState(false);
  const [postIsSaved, setPostIsSaved] = useState(null);
  const [publishPostModalOpened, setPublishPostModalOpened] = useState(false);

  const handlePublishPostModalClose = () => {
    setPublishPostModalOpened(false);
  };

  const { user } = useContext(AuthContext);
  const { postId } = useParams();
  const [postIsPublished, setPostIsPublished] = useState(
    postResponse?.data?.post?.published,
  );

  const contentRef = useRef(null);
  const postToolbar = useRef(null);

  useEffectAfterMount(() => {
    setPostIsSaved(false);
  }, [title, subheading, content]);

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };
  const handleSubheadingChange = (newSubheading) => {
    setSubheading(newSubheading);
  };
  const handleContentChange = (newContent, editor) => {
    setContent(newContent);
  };

  async function updatePost() {
    try {
      setSavingPost(true);
      const updatedPost = await PostAPI.updatePostContent(postId, {
        title,
        subheading,
        content,
      });
      setPostIsSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPost(false);
    }
  }

  const handleEditorInit = (evt, editor) => {
    contentRef.current = editor;
  };

  const headerHeight = getComputedStyle(document.body).getPropertyValue(
    '--header-height',
  );

  const [toolbarHeight, setToolbarHeight] = useState(0);

  useEffect(() => {
    const observedElement = postToolbar.current;
    if (!observedElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const contentHeight = entries[0].contentRect.height;
      const paddingTop = parseFloat(
        window.getComputedStyle(entries[0].target).paddingTop,
      );
      const paddingBottom = parseFloat(
        window.getComputedStyle(entries[0].target).paddingBottom,
      );
      setToolbarHeight(contentHeight + paddingTop + paddingBottom);
    });

    resizeObserver.observe(observedElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [postToolbar]);

  return (
    <div className={styles.editPost}>
      <div className={styles.toolbar} ref={postToolbar}>
        {savingPost ? (
          <p>Saving...</p>
        ) : (
          postIsSaved !== null && <p>{postIsSaved ? 'Saved' : 'Unsaved'}</p>
        )}
        <button
          className={styles.updateButton}
          onClick={updatePost}
          disabled={postIsSaved === null ? true : postIsSaved}
        >
          Update
        </button>

        {!postIsPublished && (
          <button
            className={styles.publishButton}
            onClick={() => setPublishPostModalOpened(true)}
          >
            Publish
          </button>
        )}
        <OverflowMenu
          currentCoverImage={currentCoverImage}
          setCurrentCoverImage={setCurrentCoverImage}
        />
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
            height: `calc(100vh - ${headerHeight} - ${toolbarHeight}px)`,
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
      {!postIsPublished && (
        <PublishPostModal
          opened={publishPostModalOpened}
          onClose={handlePublishPostModalClose}
          postIsSaved={postIsSaved}
          setPostIsPublished={setPostIsPublished}
        />
      )}
    </div>
  );
}

export default EditPost;
