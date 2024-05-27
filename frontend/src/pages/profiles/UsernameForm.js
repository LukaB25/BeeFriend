import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { toast } from "react-toastify";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";


import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import profileStyles from "../../styles/ProfilePage.module.css";
import btnStyles from "../../styles/Button.module.css";

const UsernameForm = () => {
  // UsernameForm component used to render a form to edit a username for current user
  // handles form submission and updates the username if current user is logged in and profile owner
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});

  const history = useHistory();
  const { id } = useParams();

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    if (currentUser?.profile_id?.toString() === id) {
      setUsername(currentUser.username);
    } else {
      history.push("/");
    }
  }, [currentUser, history, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put("/dj-rest-auth/user/", {
        username,
      });
      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      history.goBack();
    } catch (err) {
      toast.error("Failed to update username");
      setErrors(err.response?.data);
    }
  };

  return (
    <Row className="justify-content-center text-center">
      <Col className={`${appStyles.Content} text-center`} sm={12} md={8} lg={6}>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="text-center">
              <Form.Label className={profileStyles.Username}>Change username</Form.Label>
              <Form.Control
                placeholder="username"
                className={`${styles.TextAreaWide} ${styles.Input} `}
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
              <Alert variant="warning"
                className={`${styles.Alert} mx-auto`}
                key={idx}>{message}</Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.CancelButton}`}
              onClick={() => history.goBack()}
            >
              <i className="fas fa-arrow-alt-circle-left"> Cancel</i>
            </Button>
            <Button
              className={`${btnStyles.Button} ${btnStyles.FormButton}`}
              type="submit"
            >
              Save <i className="fas fa-save"></i>
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UsernameForm;