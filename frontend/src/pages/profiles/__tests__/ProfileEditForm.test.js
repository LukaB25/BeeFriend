import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ProfileEditForm from "../ProfileEditForm";
import { CurrentUserProvider } from "../../../contexts/CurrentUserContext";

test('renders ProfileEditForm', () => {
  render(
    <Router>
      <CurrentUserProvider>
        <ProfileEditForm />
      </CurrentUserProvider>
    </Router>
  )

  const changeImageButton = screen.getByLabelText('Change the image');
  expect(changeImageButton).toBeInTheDocument();
});