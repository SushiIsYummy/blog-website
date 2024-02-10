import { useLoaderData, NavLink, Form } from 'react-router-dom';
import styles from './EditPost.module.css';
import BlogAPI from '../../api/BlogAPI';
import PostAPI from '../../api/PostAPI';
import TinyMCEView from '../../components/TinyMCE/TinyMCEView';
import TinyMCEEdit from '../../components/TinyMCE/TinyMCEEdit';
import { useState } from 'react';
import TinyMCEInput from '../../components/TinyMCE/TinyMCEInput';
import './EditPost.css';

export async function loader({ params }) {
  return null;
}

function EditPost() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [subheading, setSubheading] = useState('');

  const handleSubmit = async (e) => {};

  return (
    <div className={styles.postContainer}>
      <div className={styles.post}>
        <Form className={styles.newPostForm} onSubmit={handleSubmit}>
          <button className={styles.publishButton}>Publish</button>
          <div className='title'>
            <TinyMCEInput
              content={''}
              placeholder={'Title'}
              onChange={() => setTitle(title)}
            />
          </div>
          <div className='subheading'>
            <TinyMCEInput
              content={''}
              placeholder={'Subheading'}
              onChange={() => setSubheading(subheading)}
            />
          </div>
          <TinyMCEEdit
            initialValue={content}
            onChange={() => setContent(content)}
          />
        </Form>
      </div>
    </div>
  );
}

export default EditPost;
