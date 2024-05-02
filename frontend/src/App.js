import './App.css';
import Container from 'react-bootstrap/Container';
import { Route, Switch } from 'react-router-dom';

import NavBar from './components/NavBar';
import RegisterForm from './pages/auth/RegisterForm';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Container className="Main">
        <Switch>
          <Route exact path="/" render={()=> <h1>Home page</h1>} />
          <Route exact path="/login" render={()=> <h1>Log in</h1>} />
          <Route exact path="/register" render={()=> <RegisterForm />} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;