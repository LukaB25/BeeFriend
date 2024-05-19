import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import styles from '../../styles/CommentCreateEditForm.module.css';

import Post from './Post';
import CommentCreateForm from '../comments/CommentCreateForm';
import Comment from '../comments/Comment';
import InfiniteScroll from 'react-infinite-scroll-component';
import Asset from '../../components/Asset';
import { fetchMoreData } from '../../utils/utils';
import FriendProfiles from '../profiles/FriendProfiles';
import RecommendedProfiles from '../profiles/RecommendedProfiles';
import Inbox from '../../components/Inbox';

function PostPage() {
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });

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
        console.log(err)
      }
    }

    handleMount();
  }, [id]);
  return (
    <Row className="h-100 justify-content-center">
      <Col lg={3} className="d-none d-lg-block">
       <RecommendedProfiles />
       <FriendProfiles />
      </Col>
      <Col className="justify-content-center text-center" sm={12} md={8} lg={6}>
        <Row className="justify-content-center">
          <Col xs={6}>
            <RecommendedProfiles mobile />
          </Col>
          <Col xs={6}>
            <FriendProfiles mobile />
          </Col>
        </Row>
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
      <Col lg={3} className="d-none d-lg-block">
        <Inbox />
      </Col>
    </Row>
  )
}

export default PostPage;

