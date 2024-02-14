import { useLoaderData, NavLink } from 'react-router-dom';
import styles from './Blog.module.css';
import BlogAPI from '../../api/BlogAPI';
import PostAPI from '../../api/PostAPI';
import convertHtmlStringToRawContent from '../../utils/convertHtmlStringToRawContent';

export async function loader({ params }) {
  try {
    const blogResponse = await BlogAPI.getBlogById(params.blogId);
    const postsResponse = await PostAPI.getPostsByBlog(params.blogId);
    return { blogResponse, postsResponse };
  } catch (err) {
    console.error(err);
  }
  return null;
}

function Blog() {
  let { blogResponse, postsResponse } = useLoaderData();
  const blog = blogResponse.data.blog;
  const posts = postsResponse.data.posts;

  return (
    <div className={styles.blogContainer}>
      <div className={styles.blog}>
        <section className={styles.blogBanner}>
          <h1>{blog.title}</h1>
          <NavLink
            className={styles.authorUsername}
            to={`/users/${blog.author._id}`}
          >
            <p>
              {blog.author.first_name} {blog.author.last_name}
            </p>
            <p>@{blog.author.username}</p>
          </NavLink>
        </section>
        <div className={styles.posts}>
          {posts.map((post) => {
            return (
              <NavLink
                to={`/posts/${post._id}`}
                key={post._id}
                className={styles.post}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={
                      post.cover_image
                        ? post.cover_image
                        : '/images/no-image.jpg'
                    }
                    alt=''
                  />
                </div>
                <div className={styles.postTitleAndContent}>
                  <h1 className={styles.postTitle}>{post.title}</h1>
                  <p className={styles.postContent}>
                    {post.subheading
                      ? post.subheading
                      : convertHtmlStringToRawContent(post.content)}
                  </p>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Blog;
