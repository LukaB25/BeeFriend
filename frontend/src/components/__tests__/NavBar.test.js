import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "../NavBar";
import { CurrentUserProvider } from "../../contexts/CurrentUserContext";

test('renders NavBar', () => {
  render(
    <Router>
      <NavBar />
    </Router>
  )

  // screen.debug();
  const logInLink = screen.getByRole('link', {name: 'Log In'});
  expect(logInLink).toBeInTheDocument();
});

test('renders link to the user profile for a logged in user', async () => {
  render(
    <Router>
      <CurrentUserProvider>
        <NavBar />
      </CurrentUserProvider>
    </Router>
  )

  const profileAvatar = await screen.findByText('Profile');
  const friendsLink = await screen.findByRole('link', {name: 'Friends'});
  expect(profileAvatar).toBeInTheDocument();
  expect(friendsLink).toBeInTheDocument();
});

test('renders Log In/Register links when user clicks logout link', async () => {
  render(
    <Router>
      <CurrentUserProvider>
        <NavBar />
      </CurrentUserProvider>
    </Router>
  )

  const logOutLink = await screen.findByRole('link', {name: 'Logout'});
  fireEvent.click(logOutLink);
  const logInLink = await screen.findByRole('link', {name: 'Log In'});
  const registerLink = await screen.findByRole('link', {name: 'Register'});
  expect(logInLink).toBeInTheDocument();
  expect(registerLink).toBeInTheDocument();
});