import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Icon } from '@iconify/react';
import styles from '../styles/NavBar.module.css';

import React from 'react'

const NavBar = () => {
  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <Navbar.Brand href="#" className={styles.Logo}>BEE<Icon icon="gg:bee" className={styles.LogoIcon} />FRIEND</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <Nav.Link
              exact
              href="#"
              className={styles.NavLink}
              activeClassName={styles.Active}
            ><i className="fas fa-home"></i> Home</Nav.Link>
            <Nav.Link
              exact
              href="#"
              className={styles.NavLink}
              activeClassName={styles.Active}
              ><i className="fas fa-sign-in-alt"></i> Log In</Nav.Link>
            <Nav.Link
              exact
              href="#"
              className={styles.NavLink}
              activeClassName={styles.Active}
            ><i className="fas fa-user-plus"></i> Sign Up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
