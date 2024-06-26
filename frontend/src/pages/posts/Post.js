import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { axiosRes } from '../../api/axiosDefaults';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import styles from '../../styles/Post.module.css';

import Avatar from '../../components/Avatar';
import { MoreDropdown } from '../../components/MoreDropdown';


const Post = (props) => {
  // Post component used to render a single post on the page
  // handles edit and delete post for the owner and like, unlike functionality for other users
  // displays like and comment count and allows users to navigate to the post detail page
  const {
    id,
    owner,
    profile_id,
    profile_image,
    title,
    content,
    image,
    like_id,
    like_count,
    comment_id,
    comment_count,
    updated_at,
    postPage,
    setPosts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner

  const history = useHistory();

  const handleEdit = () => {
    history.push(`/posts/${id}/edit`);
  }

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/posts/${id}/`);
      toast.success('Post deleted successfully!');
      const timer = setTimeout(() => {
        history.goBack();
      }, 2000);
      return () => clearTimeout(timer);
    } catch (err) {
      toast.error('An error occurred trying to delete a post.');
    }
  }

  const handleLike = async () => {
    try {
      const {data} = await axiosRes.post(`/likes/`, {post: id});
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
          ? {...post, like_count: post.like_count + 1, like_id: data.id} : post;
        }),
      }));
    } catch (err) {
      toast.error('Error liking post, please try again.')
    }
  }

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}`);
      setPosts((prevPosts) => ({
        ...prevPosts,
        results: prevPosts.results.map((post) => {
          return post.id === id
          ? {...post, like_count: post.like_count - 1, like_id: null} : post;
        }),
      }));
    } catch (err) {
      toast.error('Error unliking post, please try again.')
    }
  }
  return (
    <Card className={styles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`} className="d-flex align-items-center">
            <Avatar src={profile_image} height={40} width={45}/> <span className={`mx-2 ${styles.PostDetails}`}>{owner}</span>
          </Link>
          <div className={`${styles.Date} d-flex align-items-center`}>
            <span className={styles.PostDetails}>{updated_at}</span>
            <i className="fas fa-calendar-alt"></i>
            {is_owner && postPage && <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        {image && <Card.Img src={image} alt={title} className={`${styles.Image} align-self-center`} />}
      </Link>
      <Card.Body>
        {title && <Card.Title className={`${styles.Title} text-center`}>{title}</Card.Title>}
        {content && <Card.Text className={styles.Content}>{content}</Card.Text>}
        <div className={styles.PostBar}>
          {like_count > 0 ? (<span className={styles.LikeCount}>{like_count}</span>) : 0}
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className={`far fa-heart ${styles.Like}`} />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-heart ${styles.Like} ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-heart ${styles.Like} ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger placement="top" overlay={<Tooltip>Log in to like posts!</Tooltip>}>
              <i className={`far fa-heart ${styles.Like}`} />
            </OverlayTrigger>
          )}
          <Link to={`/posts/${id}`} className={styles.Comment} aria-label={`comment ${comment_id}`}>
            <i className="far fa-comment" />
          </Link>
          {comment_count > 0 ? (<span className={styles.CommentCount}>{comment_count}</span>) : 0}
        </div>
      </Card.Body>
    </Card>
  )
}

export default Post
