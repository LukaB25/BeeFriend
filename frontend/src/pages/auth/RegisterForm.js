import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from '../../styles/LoginRegisterForm.module.css';
import btnStyles from '../../styles/Button.module.css';
// import appStyles from '../../App.css';

import { Form, Button, Col, Row, Container } from 'react-bootstrap';

const RegisterForm = () => {
  return (
    <Container className={styles.FormContainer}>
        <Row className="justify-content-center">
            <Col className={`${styles.FormCol} text-center`} sm={12} md={8} lg={6}>
                <Container className={`d-flex justify-content-around ${styles.FormLinks}`}>
                    <NavLink exact to="/login" className={`${styles.FormSelector}`} activeClassName={styles.FormSelectorActive}>
                        Log In
                    </NavLink>
                    <NavLink exact to="/register" className={styles.FormSelector} activeClassName={styles.FormSelectorActive}>
                        Register
                    </NavLink>
                </Container>
                <Container className={styles.FormMessage}>
                    <p><i class="fas fa-arrow-up"></i> Already have an account? Log in instead.</p>
                </Container>
                <Form className={styles.Form}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Username" className={`mx-auto ${styles.Input}`} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" className={`mx-auto ${styles.Input}`} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" className={`mx-auto ${styles.Input}`} />
                    </Form.Group>

                    <Button className={btnStyles.Button} type="submit">
                        Register
                    </Button>
                </Form>
            </Col>
        </Row>
    </Container>
  )
}

export default RegisterForm