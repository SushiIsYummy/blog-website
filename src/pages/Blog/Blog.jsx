import { useLoaderData, NavLink } from 'react-router-dom';
import styles from './Blog.module.css';
import BlogAPI from '../../api/BlogAPI';
import PostAPI from '../../api/PostAPI';

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
              <div key={post._id} className={styles.post}>
                <div className={styles.imageContainer}>
                  <img src='/images/no-image.jpg' alt='' />
                  {/* <img
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsTnQRtsNQsZd-lWVZ1gAfZdIqikuNMpJB3g&usqp=CAU'
                    alt=''
                  /> */}
                  {/* <img src='https://upload.wikimedia.org/wikipedia/en/a/a6/Pok%C3%A9mon_Pikachu_art.png'></img> */}
                  {/* <img src='https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Patrick-Star.SpongeBob-SquarePants.webp'></img> */}
                </div>
                <div className={styles.postTitleAndContent}>
                  <h1 className={styles.postTitle}>{post.title}</h1>
                  <p className={styles.postContent}>{post.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Blog;
