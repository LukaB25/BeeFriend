import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { toast } from "react-toastify";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/PostCreateEditForm.module.css";
import profileStyles from "../../styles/ProfilePage.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import assetStyles from "../../styles/Asset.module.css";

const ProfileEditForm = () => {
  // ProfileEditForm component used to render a form to edit a profile
  // handles form submission and updates the profile with the new data if user is logged in
  // and is the owner of the profile
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageFile = useRef();

  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    image: "",
  });
  const { name, bio, image } = profileData;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const { name, bio, image } = data;
          setProfileData({ name, bio, image });
        } catch (err) {
          toast.error("Failed to fetch profile data");
          history.push("/");
        }
      } else {
        history.push("/");
      }
    };

    handleMount();
  }, [currentUser, history, id]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);

    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      history.goBack();
    } catch (err) {
      toast.error("Failed to update profile");
      setErrors(err.response?.data);
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label className={profileStyles.UpdateProfileInfo}>Bio</Form.Label>
        <Form.Control
          as="textarea"
          className={`${styles.TextAreaWide} ${styles.Input} `}
          placeholder="Add your bio here..."
          value={bio}
          onChange={handleChange}
          name="bio"
          rows={7}
        />
      </Form.Group>

      {errors?.bio?.map((message, idx) => (
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
      <Button className={`${btnStyles.Button} ${btnStyles.FormButton}`} type="submit">
         Save <i className="fas fa-save"></i>
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="justify-content-center">
        <Col className={`${styles.PostFormBody} text-center`} sm={12} md={8} lg={6}>
            <Form.Group>
              {image && (
                <figure>
                  <Image className={assetStyles.Image} src={image} fluid />
                </figure>
              )}
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning"
                  className={`${styles.Alert} mx-auto`}
                  key={idx}>{message}</Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.FormButton} ${btnStyles.ButtonWide} btn`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <Form.File
                id="image-upload"
                className="d-none"
                ref={imageFile}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length) {
                    setProfileData({
                      ...profileData,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileEditForm;