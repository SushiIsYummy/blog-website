import { Menu, Button } from '@mantine/core';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { TbPhotoEdit } from 'react-icons/tb';
import styles from './OverflowMenu.module.css';
import CoverImageModal from '../CoverImageModal/CoverImageModal';
import { useState } from 'react';

function OverflowMenu({ currentCoverImage, setCurrentCoverImage }) {
  const [coverImageModalOpened, setCoverImageModalOpened] = useState(false);

  const handleCoverImageModalOpen = () => {
    setCoverImageModalOpened(true);
  };

  const handleCoverImageModalClose = () => {
    setCoverImageModalOpened(false);
  };

  return (
    <>
      <Menu shadow='md' width={200}>
        <Menu.Target>
          <Button className={styles.threeDotsButton}>
            <BsThreeDotsVertical className={styles.threeDotsSVG} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<TbPhotoEdit />}
            onClick={handleCoverImageModalOpen}
          >
            Change cover image
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <CoverImageModal
        opened={coverImageModalOpened}
        onClose={handleCoverImageModalClose}
        setCurrentCoverImage={setCurrentCoverImage}
        currentCoverImage={currentCoverImage}
      />
    </>
  );
}

export default OverflowMenu;
