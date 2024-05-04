import './App.css';
import { Route, Switch } from 'react-router-dom';
import './api/axiosDefaults';

import Container from 'react-bootstrap/Container';

import NavBar from './components/NavBar';
import RegisterForm from './pages/auth/RegisterForm';
import LoginForm from './pages/auth/LoginForm';
import PostCreateForm from './pages/posts/PostCreateForm';


function App() {
  return (
        <div className="App">
          <NavBar />
          <Container className="Main">
            <Switch>
              <Route exact path="/" render={()=> <h1>Home page</h1>} />
              <Route exact path="/login" render={()=> <LoginForm />} />
              <Route exact path="/register" render={()=> <RegisterForm />} />
              <Route exact path="/posts/create" render={()=> <PostCreateForm />} />
            </Switch>
          </Container>
        </div>
  );
}

export default App;