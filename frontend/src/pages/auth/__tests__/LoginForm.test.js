import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import LoginForm from "../LoginForm";

test('renders login form', () => {
  render(
    <Router>
        <LoginForm />
    </Router>
  )

  const usernameInput = screen.getByRole('textbox', {name: 'Username'});
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', {name: 'Log In'});
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('renders username and password input fields', () => {
  render(
    <Router>
        <LoginForm />
    </Router>
  )

  const usernameInput = screen.getByRole('textbox', {name: 'Username'});
  const passwordInput = screen.getByLabelText('Password');
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
});

test('renders submit button', () => {
  render(
    <Router>
        <LoginForm />
    </Router>
  )

  const submitButton = screen.getByRole('button', {name: 'Log In'});
  expect(submitButton).toBeInTheDocument();
});