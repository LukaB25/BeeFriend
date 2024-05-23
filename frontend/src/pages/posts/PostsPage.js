import React, { useEffect, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { useRedirect } from '../../hooks/useRedirect';
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
import RecommendedProfiles from '../profiles/RecommendedProfiles';
import FriendProfiles from '../profiles/FriendProfiles';
import Asset from '../../components/Asset';

import noResults from "../../assets/no_results.png";
import { useFriendData } from '../../contexts/FriendDataContext';
import Inbox from '../../components/Inbox';
import { useSelectedChat } from '../../contexts/SelectChatContext';
import Messenger from '../../components/Messenger';
import { toast } from 'react-toastify';

function PostsPage({ message, filter = "" }) {
  const currentUser = useCurrentUser();
  const { friendsData } = useFriendData();
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const selectedChat = useSelectedChat();

  const [query, setQuery] = useState("");

  const history = useHistory()
  useRedirect('loggedOut');

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
        <Col xs={3}>
          <Link
            to="/posts/create"
            className={`${btnStyles.Button} ${btnStyles.FormButton} ${btnStyles.NewPostButton}`}
          >
            Add Post
          </Link>
        </Col>
        <Col xs={6}>
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
        <Col xs={3}>
          <FilterDropdown handleSelectFilter={handleSelectFilter} />
        </Col>
      </Row>
    </>
  )

  const loggedOutSearchBar = (
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
        if (pathname === '/friends') {
          const friend = friendsData.friends.results
            .filter(friend =>
              friend.friend === currentUser?.profile_id ||
              friend.owner_profile_id === currentUser?.profile_id
            ).map(friend =>
              friend.friend === currentUser?.profile_id ? friend.owner_profile_id : friend.friend
            );
          const filteredPosts = data?.results.filter(
            post => friend.includes(post?.profile_id)
          );
          setPosts({ ...data, results: filteredPosts });
        } else {
          setPosts(data);
        }
        setHasLoaded(true);
      } catch (err) {
        toast.error('Failed to fetch posts');
      }
    }

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, query, filter, currentUser, friendsData]);

  return (
    <Row className="h-100 justify-content-center">
      {currentUser ? (
        <Col lg={3} className="d-none d-lg-block" >
          <RecommendedProfiles />
          <FriendProfiles />
        </Col>) : null}
      <Col className="justify-content-center text-center" sm={12} lg={currentUser ? 6 : 8}>
        {currentUser ? (
          <Row className="justify-content-center">
            <Col xs={6}>
              <RecommendedProfiles mobile />
            </Col>
            <Col xs={6}>
              <FriendProfiles mobile />
            </Col>
          </Row>) : null}
        <Container className={`${appStyles.Content} align-items-center`}>
          {currentUser ? loggedInSearchBar : loggedOutSearchBar}
        </Container>
        {hasLoaded ? (
          <>
            {posts.results.length ? (
              <InfiniteScroll
                children={
                  posts.results.map((post) => (
                    <Post key={post.id} {...post} setPosts={setPosts} />
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
      {currentUser ? (
        <Col lg={3} className="d-none d-lg-block">
          <Inbox />
          {selectedChat ? <Messenger /> : null}
        </Col>) : null}
    </Row>
  )
}

export default PostsPage
