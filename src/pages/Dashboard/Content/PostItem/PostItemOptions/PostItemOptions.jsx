import styles from '../PostItem.module.css';
import { TbTrashXFilled } from 'react-icons/tb';
import { TbTrashFilled } from 'react-icons/tb';
import { MdRestore, MdSend, MdSendAndArchive } from 'react-icons/md';
import { IoMdEye } from 'react-icons/io';
import { Tooltip } from '@mantine/core';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import DeletePostModalContext from '../../../../../context/DeletePostModalProvider';
import clsx from 'clsx';

function PostItemOptions({
  inTrash,
  isHovered,
  postId,
  title,
  isPublished,
  onRestoreClick,
  onTrashClick,
  onUnpublishClick,
  onPublishClick,
}) {
  const { openDeletePostModal } = useContext(DeletePostModalContext);

  return (
    <div
      className={clsx({
        [styles.options]: true,
        [styles.visible]: isHovered,
      })}
    >
      {inTrash && (
        <>
          {isPublished && (
            <Tooltip label='Restore as draft'>
              <button onClick={() => onRestoreClick('draft')}>
                <MdSendAndArchive className={styles.trashIcon} />
              </button>
            </Tooltip>
          )}
          {!isPublished && (
            <Tooltip label='Restore and publish'>
              <button onClick={() => onRestoreClick('publish')}>
                <MdSend className={styles.trashIcon} />
              </button>
            </Tooltip>
          )}
          <Tooltip label='Restore'>
            <button onClick={() => onRestoreClick()}>
              <MdRestore className={styles.trashIcon} />
            </button>
          </Tooltip>
          <Tooltip label='Delete forever'>
            <button onClick={() => openDeletePostModal(postId, title)}>
              <TbTrashXFilled className={styles.trashIcon} />
            </button>
          </Tooltip>
        </>
      )}
      {!inTrash && (
        <>
          {isPublished && (
            <Tooltip label='Revert to draft'>
              <button onClick={onUnpublishClick}>
                <MdSendAndArchive className={styles.trashIcon} />
              </button>
            </Tooltip>
          )}
          {!isPublished && (
            <Tooltip label='Publish'>
              <button onClick={onPublishClick}>
                <MdSend className={styles.trashIcon} />
              </button>
            </Tooltip>
          )}
          {isPublished && (
            <Tooltip label='View'>
              <button>
                <NavLink
                  to={`/posts/${postId}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <IoMdEye />
                </NavLink>
              </button>
            </Tooltip>
          )}
          {!isPublished && (
            <Tooltip label='Preview'>
              <button>
                <NavLink
                  to={`${postId}/preview`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <IoMdEye />
                </NavLink>
              </button>
            </Tooltip>
          )}
          <Tooltip label='Move to Trash'>
            <button onClick={onTrashClick}>
              <TbTrashFilled className={styles.trashIcon} />
            </button>
          </Tooltip>
        </>
      )}
    </div>
  );
}

export default PostItemOptions;
