import styles from './App.module.css';
import { Route, Switch } from 'react-router-dom';
import './api/axiosDefaults';

import Container from 'react-bootstrap/Container';

import NavBar from './components/NavBar';
import RegisterForm from './pages/auth/RegisterForm';
import LoginForm from './pages/auth/LoginForm';
import PostCreateForm from './pages/posts/PostCreateForm';
import PostPage from './pages/posts/PostPage';
import PostsPage from './pages/posts/PostsPage';
import { useCurrentUser } from './contexts/CurrentUserContext';
import PostEditForm from './pages/posts/PostEditForm';
import ProfilePage from './pages/profiles/ProfilePage';
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import InboxPage from './pages/chats/InboxPage';


function App() { 
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";
  return (
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Switch>
              <Route exact path="/" render={()=> (
                <PostsPage message="There are no results. Please adjust the search keyword." />
                )}
              />
              <Route exact path="/friends" render={()=> (
                <PostsPage message="There are no results. Please adjust the search keyword or
                 connect with a user to become friends." />
                )}
              />
              <Route exact path="/liked" render={()=> (
                <PostsPage message="You have not liked any posts yet."
                  filter={`like__owner__profile=${profile_id}&`} />
                )}
              />
              <Route exact path="/commented" render={()=> (
                <PostsPage message="You have not commented on any posts yet."
                  filter={`comment__owner__profile=${profile_id}&`} />
                )}
              />
              <Route exact path="/login" render={()=> <LoginForm />} />
              <Route exact path="/register" render={()=> <RegisterForm />} />
              <Route exact path="/posts/create" render={()=> <PostCreateForm />} />
              <Route exact path="/posts/:id" render={()=> <PostPage />} />
              <Route exact path="/posts/:id/edit" render={()=> <PostEditForm />} />
              <Route exact path="/profiles/:id" render={()=> <ProfilePage />} />
              <Route exact path="/profiles/:id/edit/username" render={() => <UsernameForm />} />
              <Route exact path="/profiles/:id/edit/password" render={() => <UserPasswordForm />} />
              <Route exact path="/profiles/:id/edit" render={() => <ProfileEditForm />} />
              <Route exact path="/inbox" render={() => <InboxPage />} />
              <Route  render={()=> <p>Page not found!</p>} />
            </Switch>
          </Container>
        </div>
  );
}

export default App;