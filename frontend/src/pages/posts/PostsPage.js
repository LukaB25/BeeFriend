import React, { useEffect, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import { useLocation, useHistory, Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import { fetchMoreData } from '../../utils/utils';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { FilterDropdown } from '../../components/FilterDropdown';

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
  const currentUser = useCurrentUser();
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const [query, setQuery] = useState("");

  const history = useHistory()

  const handleSelectFilter = (filter) => {
    if (filter === "all") {
      history.push("/")
    } else if (filter === "liked") {
      history.push("/liked")
    } else if (filter === "commented") {
      history.push("/commented")
    }
  }

  const loggedInSearchBar = (
    <>
      <Row className="align-items-center">
        <Col sm={3}>
          <Link
            to="/posts/create"
            className={`${btnStyles.Button} ${btnStyles.FormButton} ${btnStyles.NewPostButton}`}
          >
            Add Post
          </Link>
        </Col>
        <Col sm={6}>
          <Form
            className={`${styles.SearchBar}`}
            onSubmit={(event) => event.preventDefault()}
          >
            <Form.Control
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Search posts"
            />
          </Form>
        </Col>
        <Col sm={3}>
          <FilterDropdown handleSelectFilter={handleSelectFilter} />
        </Col>
      </Row>
      </>
  )

  const loggedOutSearchBar =(
    <>
    <Form
      className={`${styles.SearchBar}`}
      onSubmit={(event) => event.preventDefault()}
    >
      <Form.Control
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="ml-auto"
        type="text"
        placeholder="Search posts"
      />
    </Form>
    </>
  )

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/?${filter}&search=${query}`);
        setPosts(data);
        console.log(data);
        console.log(filter)
        setHasLoaded(true);
      } catch(err) {
        console.log(err);
      }
    }

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, query, filter])

  return (
    <Row className="h-100 justify-content-center">
      <Col lg={3} className="d-none d-lg-block">Recommended users and friends for desktop</Col>
      <Col className="justify-content-center text-center" sm={12} md={8} lg={6}>
        <div className='d-lg-none d-sm-block'>
          <p>Recommended users for mobile</p> <p>Friends for mobile</p>
        </div>
        <Container className={`${appStyles.Content} align-items-center`}>
          {currentUser ? loggedInSearchBar : loggedOutSearchBar}
        </Container>
        {hasLoaded ? (
          <>
            {posts.results.length ? (
              <InfiniteScroll
                children={
                  posts.results.map((post) => (
                    <Post key={post.id} {...post} setPosts={setPosts}/>
                  ))
                }
                dataLength={posts.results.length}
                loader={<Asset spinner />}
                hasMore={!!posts.next}
                next={() => fetchMoreData(posts, setPosts)}
              />
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
