import { Menu, Button } from '@mantine/core';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdOutlineEdit } from 'react-icons/md';
import styles from './OverflowMenu.module.css';

function OverflowMenu({ onEditClick }) {
  return (
    <>
      <Menu shadow='md'>
        <Menu.Target>
          <Button className={styles.threeDotsButton}>
            <BsThreeDotsVertical className={styles.threeDotsSVG} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<MdOutlineEdit />} onClick={onEditClick}>
            Edit
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}

export default OverflowMenu;
