import React from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from '../styles/FilterDropdown.module.css';

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const Filter = React.forwardRef(({ onClick }, ref) => (
  <i
    className={`fas fa-filter ${styles.FilterDropdownToggle}`}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));


export const FilterDropdown = ({ handleSelectFilter }) => {
  return (
    <Dropdown className="ml-auto" drop="left">
    <Dropdown.Toggle as={Filter} />

    <Dropdown.Menu
      className="text-center"
      popperConfig={{ strategy: "fixed" }}>
        <Dropdown.Item
        className={styles.DropdownItem}
        onClick={() => handleSelectFilter('all')}
        aria-label="All posts"
      >All posts</Dropdown.Item>
      <Dropdown.Item
        className={styles.DropdownItem}
        onClick={() => handleSelectFilter('liked')}
        aria-label="posts user liked"
      >
        Liked posts
      </Dropdown.Item>
      <Dropdown.Item
        className={styles.DropdownItem}
        onClick={() => handleSelectFilter('commented')}
        aria-label="posts user commented on"
      >
        Commented posts
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
  )
};
