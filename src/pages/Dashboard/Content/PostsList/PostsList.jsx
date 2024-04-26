import styles from './PostsList.module.css';
import PostItem from '../PostItem/PostItem';
import { Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import PostAPI from '../../../../api/PostAPI';
import { capitalize } from 'lodash';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { DeletePostModalProvider } from '../../../../context/DeletePostModalProvider';
import DeletePostModal from '../PostItem/DeletePostModal/DeletePostModal';

const postFilterOptions = ['All', 'Published', 'Draft', 'Trash'];

function PostsList() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedOptionQueryParam = queryParams.get('selected_option')
    ? capitalize(queryParams.get('selected_option'))
    : postFilterOptions[0];

  const [selectedOption, setSelectedOption] = useState(
    selectedOptionQueryParam,
  );
  const { blogId, sidebarOption } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [allPosts, setAllPosts] = useState(null);
  const [draftPosts, setDraftPosts] = useState(null);
  const [publishedPosts, setPublishedPosts] = useState(null);
  const [trashedPosts, setTrashedPosts] = useState(null);

  // set default selected option to 'all' if no option selected
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (!queryParams.has('selected_option') && sidebarOption === 'posts') {
      queryParams.set('selected_option', 'all');
      navigate({ search: queryParams.toString() }, { replace: true });
    }
  }, [navigate, location.search, sidebarOption]);

  useEffect(() => {
    const selectedOption = searchParams.get('selected_option');
    if (selectedOption === 'all') {
      setSelectedOption('All');
    } else if (selectedOption === 'published') {
      setSelectedOption('Published');
    } else if (selectedOption === 'draft') {
      setSelectedOption('Draft');
    } else if (selectedOption === 'trash') {
      setSelectedOption('Trash');
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        let postsResponse = null;
        if (selectedOption === 'All') {
          postsResponse = await PostAPI.getPostsByBlog(blogId, {
            selected_option: 'all',
          });
          const posts = postsResponse ? postsResponse.data.posts : [];
          setAllPosts(posts);
        } else if (selectedOption === 'Published') {
          postsResponse = await PostAPI.getPostsByBlog(blogId, {
            selected_option: 'published',
          });
          const posts = postsResponse ? postsResponse.data.posts : [];
          setPublishedPosts(posts);
        } else if (selectedOption === 'Draft') {
          postsResponse = await PostAPI.getPostsByBlog(blogId, {
            selected_option: 'draft',
          });
          const posts = postsResponse ? postsResponse.data.posts : [];
          setDraftPosts(posts);
        } else if (selectedOption === 'Trash') {
          postsResponse = await PostAPI.getPostsByBlog(blogId, {
            selected_option: 'trash',
          });
          const posts = postsResponse ? postsResponse.data.posts : [];
          setTrashedPosts(posts);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchPosts();
  }, [blogId, navigate, selectedOption]);

  function getPostsByType() {
    switch (selectedOption) {
      case 'All':
        return allPosts;
      case 'Published':
        return publishedPosts;
      case 'Draft':
        return draftPosts;
      case 'Trash':
        return trashedPosts;
      default:
        return [];
    }
  }

  function renderPosts() {
    const posts = getPostsByType();
    if (posts) {
      if (posts.length === 0) {
        return <p className={styles.noPostsMsg}>No Posts</p>;
      } else {
        return posts.map((post) => (
          <PostItem
            key={post._id}
            postData={post}
            removePost={removePost}
            selectedOption={selectedOption}
            inTrash={selectedOption === 'Trash'}
          />
        ));
      }
    } else {
      return (
        <div className={styles.loadingIconContainer}>
          <l-ring size='30' stroke='3' color='black' speed='1.5'></l-ring>
        </div>
      );
    }
  }

  function removePost(postId) {
    if (selectedOption === 'All') {
      setAllPosts((posts) => {
        if (posts) {
          return posts.filter((post) => post._id !== postId);
        }
      });
    } else if (selectedOption === 'Published') {
      setPublishedPosts((posts) => {
        if (posts) {
          return posts.filter((post) => post._id !== postId);
        }
      });
    } else if (selectedOption === 'Draft') {
      setDraftPosts((posts) => {
        if (posts) {
          return posts.filter((post) => post._id !== postId);
        }
      });
    } else if (selectedOption === 'Trash') {
      setTrashedPosts((posts) => {
        if (posts) {
          return posts.filter((post) => post._id !== postId);
        }
      });
    }
  }

  function handleSelectChange(value) {
    setSelectedOption(value);
    queryParams.set('selected_option', value.toLowerCase());
    navigate({ search: queryParams.toString() });
  }

  return (
    <DeletePostModalProvider>
      <div className={styles.postsList}>
        <div className={styles.filterBar}>
          <Select
            className={styles.filterSelect}
            data={postFilterOptions}
            defaultValue='All'
            allowDeselect={false}
            value={selectedOption}
            onChange={handleSelectChange}
          />
        </div>
        <div className={styles.postItems}>{renderPosts()}</div>
      </div>
      <DeletePostModal removePost={removePost} />
    </DeletePostModalProvider>
  );
}

export default PostsList;
