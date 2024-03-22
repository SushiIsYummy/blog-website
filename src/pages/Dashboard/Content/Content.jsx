import styles from './Content.module.css';
import PostItem from './PostItem/PostItem';
import CommentItem from './CommentItem/CommentItem';
import PostAPI from '../../../api/PostAPI';
import { useEffect, useRef, useState } from 'react';
import { SIDEBAR_ITEMS } from '../sidebarItems';

function Content({ selectedBlogId, selectedSidebarItem }) {
  const loadingContent = useRef(true);
  loadingContent.current = true;
  const [cache, setCache] = useState(new Map());
  const cacheKey = `${selectedBlogId}-${selectedSidebarItem}`;

  useEffect(() => {
    async function fetchAndSetContent(selectedBlogId, selectedSidebarItem) {
      if (!cache.has(cacheKey)) {
        try {
          let postsResponse = null;
          if (
            selectedSidebarItem === SIDEBAR_ITEMS.POSTS &&
            selectedBlogId !== 'none'
          ) {
            postsResponse = await PostAPI.getPostsByBlog(selectedBlogId);
            const posts = postsResponse ? postsResponse.data.posts : [];
            setCache((prevCache) => new Map(prevCache.set(cacheKey, posts)));
          }
          let commentsResponse = null;
          if (
            selectedSidebarItem === SIDEBAR_ITEMS.COMMENTS &&
            selectedBlogId !== 'none'
          ) {
            commentsResponse =
              await PostAPI.getAllPostCommentsByBlog(selectedBlogId);
            const comments = commentsResponse
              ? commentsResponse.data.comments
              : [];
            setCache((prevCache) => new Map(prevCache.set(cacheKey, comments)));
          }
        } catch (err) {
          console.error(err);
        } finally {
          loadingContent.current = false;
        }
      }
    }
    if (selectedBlogId && selectedSidebarItem) {
      fetchAndSetContent(selectedBlogId, selectedSidebarItem);
    }
  }, [cache, cacheKey, selectedBlogId, selectedSidebarItem]);

  function renderItems() {
    const items = cache.get(cacheKey);

    if (!items) {
      return (
        <div className={styles.loadingIconContainer}>
          <l-ring size='30' stroke='3' color='black' speed='1.5'></l-ring>
        </div>
      );
    }

    let noItems = items.length === 0;
    if (selectedSidebarItem === SIDEBAR_ITEMS.POSTS) {
      return noItems ? (
        <p>No posts found in blog.</p>
      ) : (
        items.map((post) => <PostItem key={post._id} postData={post} />)
      );
    } else if (selectedSidebarItem === SIDEBAR_ITEMS.COMMENTS) {
      return noItems ? (
        <p>No comments found in blog.</p>
      ) : (
        items.map((comment) => (
          <CommentItem key={comment._id} commentData={comment} />
        ))
      );
    }
    return null;
  }

  return (
    <div className={styles.content}>
      <div className={styles.itemsList}>
        {selectedBlogId !== 'none' && renderItems()}
      </div>
      {selectedBlogId === 'none' && (
        <p>
          You currently have no blogs. Create a blog to see posts and comments.
        </p>
      )}
    </div>
  );
}

export default Content;
