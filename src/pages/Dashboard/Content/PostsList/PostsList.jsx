import styles from './PostsList.module.css';
import PostItem from '../PostItem/PostItem';
import { Select } from '@mantine/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PostAPI from '../../../../api/PostAPI';
import _ from 'lodash';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { DeletePostModalProvider } from '../../../../context/DeletePostModalProvider';
import DeletePostModal from '../PostItem/DeletePostModal/DeletePostModal';

const postFilterOptions = {
  ALL: 'all',
  PUBLISHED: 'published',
  DRAFT: 'draft',
  TRASH: 'trash',
};

function PostsList() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedOptionQueryParam = Object.values(postFilterOptions).includes(
    queryParams.get('selected_option'),
  )
    ? queryParams.get('selected_option')
    : postFilterOptions.ALL;

  const [selectedOption, setSelectedOption] = useState(
    selectedOptionQueryParam,
  );
  const { blogId, sidebarOption } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  console.log(selectedOption);
  const [allPosts, setAllPosts] = useState(null);
  const [draftPosts, setDraftPosts] = useState(null);
  const [publishedPosts, setPublishedPosts] = useState(null);
  const [trashedPosts, setTrashedPosts] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  const currentPage = useRef(1);
  // const [lastPostVisible, setLastPostVisible] = useState(false);
  // console.log(allPosts);
  // console.log(currentPage);
  const lastPostItemRef = useRef(null);
  // console.log('all posts');
  // console.log(allPosts);
  // set default selected option to 'all' if no option selected
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (!queryParams.has('selected_option') && sidebarOption === 'posts') {
      queryParams.set('selected_option', 'all');
      navigate({ search: queryParams.toString() }, { replace: true });
    }
  }, [navigate, location.search, sidebarOption]);

  // const poop = useRef(0);
  // useEffect(() => {
  //   console.log(`poop: ${poop.current}`);
  //   poop.current += 1;
  // }, []);
  useEffect(() => {
    const selectedOption = searchParams.get('selected_option');
    // console.log(selectedOption);
    setSelectedOption(selectedOption);
  }, [searchParams]);

  const getPostsByType = useCallback(() => {
    switch (selectedOption) {
      case postFilterOptions.ALL:
        return allPosts;
      case postFilterOptions.PUBLISHED:
        return publishedPosts;
      case postFilterOptions.DRAFT:
        return draftPosts;
      case postFilterOptions.TRASH:
        return trashedPosts;
      default:
        return null;
    }
  }, [selectedOption, allPosts, publishedPosts, draftPosts, trashedPosts]);

  const getSetterFunction = useCallback(() => {
    switch (selectedOption) {
      case postFilterOptions.ALL:
        return setAllPosts;
      case postFilterOptions.PUBLISHED:
        return setPublishedPosts;
      case postFilterOptions.DRAFT:
        return setDraftPosts;
      case postFilterOptions.TRASH:
        return setTrashedPosts;
      default:
        return null;
    }
  }, [selectedOption]);

  const fetchAndSetPosts = useCallback(async () => {
    // console.log('in fetch and set posts!');
    console.log(currentPage.current);
    try {
      let postsResponse = await PostAPI.getPostsByBlog(blogId, {
        selected_option: selectedOption,
        page: currentPage.current,
      });
      console.log(postsResponse);
      const fetchedPosts = postsResponse ? postsResponse.data.posts : [];
      // console.log(postsResponse);
      // return fetchedPosts;
      let setterFunction = getSetterFunction();
      if (setterFunction) {
        updatePostsForCategory(fetchedPosts, setterFunction);
      }
      if (currentPage.current) {
        currentPage.current = postsResponse?.pagination?.next_page;
      }
    } catch (err) {
      console.error(err);
    }
  }, [blogId, getSetterFunction, selectedOption]);

  // const debouncedFetchData = _.debounce(fetchAndSetPosts, 0);

  const debouncedFetchAndSetPosts = useMemo(
    () => _.debounce(fetchAndSetPosts, 0),
    [fetchAndSetPosts],
  );

  useEffect(() => {
    // const abortController = new AbortController();
    // console.log('fetch and set posts!');
    if (blogId && selectedOption) {
      // fetchAndSetPosts();
      debouncedFetchAndSetPosts();
    }

    // return () => {
    //   // this will cancel the fetch request when the effect is unmounted
    //   abortController.abort();
    // };
  }, [fetchAndSetPosts, blogId, selectedOption, debouncedFetchAndSetPosts]);

  // useEffect(() => {
  //   if (lastPostVisible) {
  //     setCurrentPage((prevPage) => prevPage + 1);
  //   }
  // }, [lastPostVisible]);

  useEffect(() => {
    const lastPostObserver = new IntersectionObserver((entries) => {
      const lastPost = entries[0];
      if (!lastPost.isIntersecting) return;
      // lastPostObserver.unobserve(lastPost);
      // SET POSTS
      // const fetchedPost = await fetchPosts();
      if (currentPage.current) {
        // fetchAndSetPosts();
      }
    }, {});

    // const currentDisplayedPosts = getPostsByType();

    const lastPostItem = lastPostItemRef.current;
    if (lastPostItem) {
      // console.log(lastPostItem);
      lastPostObserver.observe(lastPostItem);
    }

    return () => {
      if (lastPostItem) {
        lastPostObserver.unobserve(lastPostItem); // Clean up the observer
      }
    };
  }, [fetchAndSetPosts, getPostsByType]);

  function updatePostsForCategory(posts, setterFunction) {
    if (posts && setterFunction) {
      setterFunction((prevPosts) => {
        if (prevPosts) {
          return [...prevPosts, ...posts];
        } else {
          return posts;
        }
      });
    }
  }

  function renderPosts() {
    const posts = getPostsByType();
    // console.log(posts);
    if (posts) {
      if (posts.length === 0) {
        return <p className={styles.noPostsMsg}>No Posts</p>;
      } else {
        return posts.map((post, index) => (
          <PostItem
            key={post._id}
            lastPostItemRef={
              index === posts.length - 1 ? lastPostItemRef : null
            }
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
    // console.log(value);
    setAllPosts(null);
    setPublishedPosts(null);
    setDraftPosts(null);
    setTrashedPosts(null);
    setSelectedOption(value.toLowerCase());
    currentPage.current = 1;
    queryParams.set('selected_option', value.toLowerCase());
    navigate({ search: queryParams.toString() });
  }

  return (
    <DeletePostModalProvider>
      <div className={styles.postsList}>
        <div className={styles.filterBar}>
          <Select
            className={styles.filterSelect}
            data={_.map(postFilterOptions, _.capitalize)}
            defaultValue='All'
            allowDeselect={false}
            value={_.capitalize(selectedOption)}
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
