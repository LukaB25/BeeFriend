import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { axiosRes } from '../../api/axiosDefaults';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { MoreDropdown } from '../../components/MoreDropdown';

import Media from 'react-bootstrap/Media';
import Container from 'react-bootstrap/Container';

import styles from '../../styles/Comment.module.css';
import Avatar from '../../components/Avatar';

import CommentEditForm from "./CommentEditForm";

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    body,
    created_at,
    id,
    setPost,
    setComments,
  } = props;

  const [showEditForm, setShowEditForm] = useState(false);

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`);
      toast.success('Comment deleted successfully!');
      setPost(prevPost => ({
        results: [{
          ...prevPost.results[0],
          comment_count: prevPost.results[0].comment_count - 1
        }]
      }))
      setComments(prevComments => ({
        ...prevComments,
        results: prevComments.results.filter(comment => comment.id !== id)
      }))
    } catch (err) {
      toast.error('An error occurred. Please try again later.');
    }
  }
  return (
    <>
      <hr />
      <Media className={styles.Comment}>
        <Link to={`/profiles/${profile_id}`} className="mt-3">
          <Avatar src={profile_image} height={30} width={35} />
        </Link>
        <Media.Body>
          <Container className="d-flex justify-content-between">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{created_at} <i className="fas fa-calendar-alt"></i></span>
          </Container>
          {showEditForm ? (
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              body={body}
              profileImage={profile_image}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
          <p className={`${styles.CommentBody} text-justify`}>{body}</p>
          )}
        </Media.Body>
        {is_owner && !showEditForm && (
            <MoreDropdown handleEdit={() => setShowEditForm(true)} handleDelete={handleDelete}/>
        )}
      </Media>
    </>
  )
}

export default Comment
