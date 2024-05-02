import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Icon } from '@iconify/react';
import styles from '../styles/NavBar.module.css';
import { NavLink } from 'react-router-dom';

import React from 'react'

const NavBar = () => {
  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand
            className={styles.Logo}>
              BEE<Icon icon="gg:bee" className={styles.LogoIcon} />FRIEND
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              to="/"
              className={styles.NavLink}
              activeClassName={styles.Active}
            ><i className="fas fa-home"></i> Home
            </NavLink>
            <NavLink
              exact
              to="/login"
              className={styles.NavLink}
              activeClassName={styles.Active}
              ><i className="fas fa-sign-in-alt"></i> Log In
            </NavLink>
            <NavLink
              exact
              to="/register"
              className={styles.NavLink}
              activeClassName={styles.Active}
            ><i className="fas fa-user-plus"></i> Register
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
