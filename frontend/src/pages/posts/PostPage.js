import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosReq } from '../../api/axiosDefaults';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useSelectedChat } from '../../contexts/SelectChatContext';
import { fetchMoreData } from '../../utils/utils';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import styles from '../../styles/CommentCreateEditForm.module.css';

import Post from './Post';
import CommentCreateForm from '../comments/CommentCreateForm';
import Comment from '../comments/Comment';
import Asset from '../../components/Asset';
import FriendProfiles from '../profiles/FriendProfiles';
import RecommendedProfiles from '../profiles/RecommendedProfiles';
import Inbox from '../../components/Inbox';
import Messenger from '../../components/Messenger';

function PostPage() {
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });
  const selectedChat = useSelectedChat();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{data: post}, {data: comments}] = await Promise.all([
          axiosReq.get(`/posts/${id}`),
          axiosReq.get(`/comments/?post=${id}`)
        ])
        setPost({ results: [post] })
        setComments(comments)
      } catch (err) {
        toast.error('Failed to fetch post data');
      }
    }

    handleMount();
  }, [id]);
  return (
    <Row className="h-100 justify-content-center">
      {currentUser ? (
      <Col lg={3} className="d-none d-lg-block">
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
        <Post {...post.results[0]} setPosts={setPost} postPage />
        <Container className={styles.CommentFormBody}>
          {currentUser ? (
            <CommentCreateForm
            profile_id={currentUser.profile_id}
            profileImage={profile_image}
            post={id}
            setPost={setPost}
            setComments={setComments}
          />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length ? (
            <InfiniteScroll
            children={
              comments.results.map(comment => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setPost={setPost}
                  setComments={setComments}
                />
              ))
            }
            dataLength={comments.results.length}
            loader={<Asset spinner />}
            hasMore={!!comments.next}
            next={() => fetchMoreData(comments, setComments)}
          />
            
          ) : currentUser ? (
            <span>There are no comments yet, be the first to comment on this post!</span>
          ) : (
            <span>There are no comments... yet.</span>
          )}
        </Container>
      </Col>
      {currentUser ? (
      <Col lg={3} className="d-none d-lg-block">
        <Inbox />
        {selectedChat ? <Messenger /> : null}
      </Col> ) : null}
    </Row>
  )
}

export default PostPage;

