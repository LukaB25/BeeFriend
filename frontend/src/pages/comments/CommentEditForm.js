import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";
import { toast } from "react-toastify";

import styles from "../../styles/CommentCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";

function CommentEditForm(props) {
  // CommentEditForm component used to render a form to edit a comment on a post
  // handles form submission and updates the comment with the new body
  const { id, body, setShowEditForm, setComments } = props;

  const [formBody, setFormBody] = useState(body);

  const handleChange = (event) => {
    setFormBody(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, {
        body: formBody.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                body: formBody.trim(),
                updated_at: "now",
              }
            : comment;
        }),
      }));
      setShowEditForm(false);
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          className={styles.Input}
          as="textarea"
          value={formBody}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <button
          className={`${btnStyles.Button} ${btnStyles.CancelButton} btn mr-3`}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          <i className="fas fa-arrow-alt-circle-left">Cancel</i>
        </button>
        <button
          className={`${btnStyles.Button} ${btnStyles.FormButton} btn mr-3`}
          disabled={!body.trim()}
          type="submit"
        >
          Edit<i className="fas fa-edit"></i>
        </button>
      </div>
    </Form>
  );
}

export default CommentEditForm;