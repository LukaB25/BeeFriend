import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { axiosReq } from '../../api/axiosDefaults';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import styles from '../../styles/PostCreateEditForm.module.css';
// import btnStyles from '../../styles/Button.module.css';
// import appStyles from '../../App.module.css';
import Post from './Post';

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{data: post}] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
        ])
        setPost({ results: [post] })
        console.log(post)
      } catch (err) {
        console.log(err)
      }
    }

    handleMount();
  }, [id]);
  return (
    <Row className="h-100 justify-content-center">
      <Col lg={3} className="d-none d-lg-block">Recommended users and friends for desktop</Col>
      <Col className="justify-content-center text-center" sm={12} md={8} lg={6}>
          <p>Recommended users for mobile</p> <p>Friends for mobile</p>
          <p>New post + search</p>
          <Post {...post.results[0]} setPosts={setPost} postPage />
          <Container className={styles.PostFormBody}>Comments</Container>
      </Col>
      <Col lg={3} className="d-none d-lg-block">
        <p>?!?Notification?!? and messages for desktop</p>
      </Col>
    </Row>
  )
}

export default PostPage;

