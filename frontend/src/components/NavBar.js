import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Icon } from '@iconify/react';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import axios from 'axios';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';


const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const {expanded, setExpanded, ref} = useClickOutsideToggle();

  const handleLogout = async () => {
    try {
      const {data} = await axios.post('dj-rest-auth/logout/');
      console.log(data);
      setCurrentUser(null);
      console.log(currentUser);
    } catch (err) {
      console.log(err.response?.data);
    }
  }

  const loggedInIcons = (
    <>
      <NavLink exact to="/friends"
        className={styles.NavLink}
        activeClassName={styles.Active}
        ><i class="fas fa-users"></i> Friends
      </NavLink>
      <NavLink exact to={`/profile/${currentUser?.profile_id}`}
        className={styles.NavLink}
        activeClassName={styles.Active}
        ><Avatar src={currentUser?.profile_image} height={20} text="Profile" />
      </NavLink>
      <NavLink to="/"
        className={styles.NavLink}
        onClick={handleLogout}
        ><i class="fas fa-sign-out-alt"></i> Logout
      </NavLink>
    </>
  )

  const loggedOutIcons = (
    <>
      <NavLink exact to="/login"
        className={styles.NavLink}
        activeClassName={styles.Active}
        ><i className="fas fa-sign-in-alt"></i> Log In
      </NavLink>
      <NavLink exact to="/register"
        className={styles.NavLink}
        activeClassName={styles.Active}
        ><i className="fas fa-user-plus"></i> Register
      </NavLink>
    </>
  )

  return (
    <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand
            className={styles.Logo}>
              BEE<Icon icon="gg:bee" className={styles.LogoIcon} />FRIEND
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
          className={styles.Toggle} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              to="/"
              className={styles.NavLink}
              activeClassName={styles.Active}
            ><i className="fas fa-home"></i> Home
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
