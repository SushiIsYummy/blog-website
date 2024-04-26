import { Menu, Button } from '@mantine/core';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdEye } from 'react-icons/io';
import { TbTrashXFilled } from 'react-icons/tb';
import { TbTrashFilled } from 'react-icons/tb';
import { MdRestore, MdSend, MdSendAndArchive } from 'react-icons/md';
import styles from './OverflowMenu.module.css';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import DeletePostModalContext from '../../../../../context/DeletePostModalProvider';

function OverflowMenu({
  postId,
  postTitle,
  inTrash,
  isPublished,
  onPublishClick,
  onRestoreClick,
  onUnpublishClick,
  onTrashClick,
}) {
  const { openDeletePostModal } = useContext(DeletePostModalContext);

  return (
    <>
      <Menu
        className={styles.overflowMenu}
        shadow='md'
        width={200}
        position='bottom-end'
        offset={3}
      >
        <Menu.Target>
          <Button
            className={styles.threeDotsButton}
            onClick={(e) => e.stopPropagation()}
          >
            <BsThreeDotsVertical className={styles.threeDotsSVG} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {!inTrash && (
            <>
              {isPublished ? (
                <Menu.Item
                  leftSection={
                    <MdSendAndArchive className={styles.menuItemIcon} />
                  }
                  onClick={onUnpublishClick}
                >
                  <p className={styles.menuItemText}>Unpublish</p>
                </Menu.Item>
              ) : (
                <Menu.Item
                  leftSection={<MdSend className={styles.menuItemIcon} />}
                  onClick={onPublishClick}
                >
                  <p className={styles.menuItemText}>Publish</p>
                </Menu.Item>
              )}
              {isPublished && (
                <Menu.Item
                  leftSection={<IoMdEye className={styles.menuItemIcon} />}
                  component={NavLink}
                  rel='noopener noreferrer'
                  target='_blank'
                  to={`/posts/${postId}`}
                >
                  <p className={styles.menuItemText}>View</p>
                </Menu.Item>
              )}
              {!isPublished && (
                <Menu.Item
                  leftSection={<IoMdEye className={styles.menuItemIcon} />}
                  component={NavLink}
                  to={`${postId}/preview`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <p className={styles.menuItemText}>Preview</p>
                </Menu.Item>
              )}
              <Menu.Item
                leftSection={<TbTrashFilled className={styles.menuItemIcon} />}
                onClick={onTrashClick}
              >
                <p className={styles.menuItemText}>Move to Trash</p>
              </Menu.Item>
            </>
          )}
          {inTrash && (
            <>
              {isPublished ? (
                <Menu.Item
                  leftSection={
                    <MdSendAndArchive className={styles.menuItemIcon} />
                  }
                  onClick={() => onRestoreClick('draft')}
                >
                  <p className={styles.menuItemText}>Restore as draft</p>
                </Menu.Item>
              ) : (
                <Menu.Item
                  leftSection={
                    <MdSendAndArchive className={styles.menuItemIcon} />
                  }
                  onClick={() => onRestoreClick('publish')}
                >
                  <p className={styles.menuItemText}>Restore and publish</p>
                </Menu.Item>
              )}
              <Menu.Item
                leftSection={<MdRestore className={styles.menuItemIcon} />}
                onClick={onRestoreClick}
              >
                <p className={styles.menuItemText}>Restore</p>
              </Menu.Item>
              <Menu.Item
                leftSection={<TbTrashXFilled className={styles.menuItemIcon} />}
                onClick={() => openDeletePostModal(postId, postTitle)}
              >
                <p className={styles.menuItemText}>Delete forever</p>
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    </>
  );
}

export default OverflowMenu;
