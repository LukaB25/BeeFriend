import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { CurrentUserProvider } from "../../../contexts/CurrentUserContext";
import PostCreateForm from "../PostCreateForm";

test('renders PostCreateForm', () => {
  render(
    <Router>
      <CurrentUserProvider>
        <PostCreateForm />
      </CurrentUserProvider>
    </Router>
  )

  const imageField = screen.getByAltText('Click or tap to upload an image')
  expect(imageField).toBeInTheDocument();
  const titleField = screen.getByText('Title');
  expect(titleField).toBeInTheDocument();
  const contentField = screen.getByText('Content');
  expect(contentField).toBeInTheDocument();
});

test('renders cancel and post buttons', () => {
  render(
    <Router>
      <CurrentUserProvider>
        <PostCreateForm />
      </CurrentUserProvider>
    </Router>
  )

  const cancelButton = screen.getByRole('button', {name: 'Cancel'});
  const postButton = screen.getByRole('button', {name: 'Post'});
  expect(cancelButton).toBeInTheDocument();
  expect(postButton).toBeInTheDocument();
});