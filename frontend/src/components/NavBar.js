import React from 'react';
import axios from 'axios';
import { NavLink, useHistory } from 'react-router-dom';

import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@iconify/react';

import Avatar from './Avatar';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import styles from '../styles/NavBar.module.css';
import { removeCurrentUserFromLocalStorage, removeTokenTimestamp } from '../utils/utils';


const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const {expanded, setExpanded, ref} = useClickOutsideToggle();
  const history = useHistory()


  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const csrftoken = localStorage.getItem('csrftoken');
      await axios.post('/dj-rest-auth/logout/', {}, {
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
      setCurrentUser(null);
      removeTokenTimestamp();
      removeCurrentUserFromLocalStorage();
      toast.success('Logged out successfully!')
      const timer = setTimeout(() => {
        history.push('/');
      }, 2000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.log(err.response?.data);
      toast.error('An error occurred. Please try again.')
    }
  }

  const loggedInIcons = (
    <>
      <NavLink to="/friends"
        className={styles.NavLink}
        activeClassName={styles.Active}
        ><i className="fas fa-users"></i> Friends
      </NavLink>
      <NavLink to="/inbox"
        className={`${styles.NavLink} d-lg-none`}
        activeClassName={styles.Active}
        ><i className="fas fa-envelope"></i> Inbox
      </NavLink>
      <NavLink to={`/profiles/${currentUser?.profile_id}`}
        className={styles.NavLink}
        activeClassName={styles.Active}
        ><Avatar src={currentUser?.profile_image} height={20} width={22.5} text="Profile" />
      </NavLink>
      <NavLink to="/"
        className={styles.NavLink}
        onClick={handleLogout}
        ><i className="fas fa-sign-out-alt"></i> Logout
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
        <NavLink exact to="/">
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
      <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{marginTop: '7.5rem'}}
          />
    </Navbar>
  )
}

export default NavBar
