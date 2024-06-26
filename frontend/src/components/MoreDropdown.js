import React from 'react';
import { useHistory } from "react-router";

import Dropdown from 'react-bootstrap/Dropdown'
;
import styles from '../styles/MoreDropdown.module.css';

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className={`fas fa-ellipsis-v ${styles.DropdownToggle}`}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

export const MoreDropdown = ({handleEdit, handleDelete}) => {
  //  MoreDropdown component used to edit and delete posts
  return (
    <Dropdown className="ml-auto" drop="left">
    <Dropdown.Toggle as={ThreeDots} />

    <Dropdown.Menu
      className="text-center"
      popperConfig={{ strategy: "fixed" }}>
      <Dropdown.Item
        className={styles.DropdownItem}
        onClick={handleEdit}
        aria-label="edit"
      >
        <i className="fas fa-edit" />
      </Dropdown.Item>
      <Dropdown.Item
        className={styles.DropdownItem}
        onClick={handleDelete}
        aria-label="delete"
      >
        <i className="fas fa-trash" />
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
  )
};

export function ProfileEditDropdown({ id }) {
  // ProfileEditDropdown component used to edit profile(image or bio), username, and password
  const history = useHistory();
  return (
    <Dropdown className={` px-3 ${styles.Absolute}`} drop="left">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu className={styles.ProfileDropdownMenu}>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit`)}
          aria-label="edit-profile"
          className={styles.ProfileDropdownItem}
        >
          <i className="fas fa-edit" /> edit profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/username`)}
          aria-label="edit-username"
          className={styles.ProfileDropdownItem}
        >
          <i className="far fa-id-card" />
          change username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/password`)}
          aria-label="edit-password"
          className={styles.ProfileDropdownItem}
        >
          <i className="fas fa-key" />
          change password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}


export const MessageDropdown = ({handleDelete}) => {
  return (
    <Dropdown className="ml-auto" drop="left">
    <Dropdown.Toggle as={ThreeDots} />

    <Dropdown.Menu
      className="text-center"
      popperConfig={{ strategy: "fixed" }}>
      <Dropdown.Item
        className={styles.DropdownItem}
        onClick={handleDelete}
        aria-label="delete"
      >
        <i className="fas fa-trash" />
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
  )
};