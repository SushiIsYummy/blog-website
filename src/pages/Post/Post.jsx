import { useLoaderData } from 'react-router-dom';
import styles from './Post.module.css';
import PostAPI from '../../api/PostAPI';
import TinyMCEView from '../../components/TinyMCE/TinyMCEView';

export async function loader({ params }) {
  try {
    const postResponse = await PostAPI.getPostById(params.postId);
    return { postResponse };
  } catch (err) {
    console.error(err);
  }
  return null;
}

function Post() {
  let { postResponse } = useLoaderData();
  const post = postResponse.data.post;

  return (
    <div className={styles.postContainer}>
      <div className={styles.post}>
        <h1>{post.title}</h1>
        <div className={styles.postContent}>
          <TinyMCEView content={post.content}></TinyMCEView>
        </div>
        <div className={styles.author}>
          <img
            className={styles.authorImage}
            src={
              post.author.profile_photo !== null
                ? post.author.profile_photo
                : '/images/default_profile_photo.jpg'
            }
            alt=''
          />
          <p>
            {post.author.first_name} {post.author.last_name}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Post;
