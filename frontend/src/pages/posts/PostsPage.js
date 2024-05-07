import React, { useEffect, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import { useLocation } from 'react-router-dom';

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import styles from "../../styles/PostsPage.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import Post from './Post';
import Asset from '../../components/Asset';

import noResults from "../../assets/no_results.png";

function PostsPage({message, filter=""}) {
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/?${filter}`);
        setPosts(data);
        console.log(data);
        console.log(filter)
        setHasLoaded(true);
      } catch(err) {
        console.log(err);
      }
    }

    setHasLoaded(false);
    fetchPosts();
  }, [pathname, filter])

  return (
    <Row className="h-100 justify-content-center">
      <Col lg={3} className="d-none d-lg-block">Recommended users and friends for desktop</Col>
      <Col className="justify-content-center text-center" sm={12} md={8} lg={6}>
          <p>Recommended users for mobile</p> <p>Friends for mobile</p>
          <p>New post + search + <i class="fas fa-filter"></i></p>
          {hasLoaded ? (
            <>
              {posts.results.length ? (
                posts.results.map((post) => (
                  <Post key={post.id} {...post} setPosts={setPosts}/>
                ))
              ) : (
                <Container className={appStyles.Content}>
                  <Asset src={noResults} message={message} />
                </Container>
              )}
            </>
          ) : (
            <Container className={appStyles.Content}>
              <Asset spinner />
            </Container>
          )}
      </Col>
      <Col lg={3} className="d-none d-lg-block">
        <p>?!?Notification?!? and messages for desktop</p>
      </Col>
    </Row>
  )
}

export default PostsPage
