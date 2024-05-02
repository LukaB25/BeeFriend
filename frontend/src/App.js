import './App.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Container className="Main">
        <Switch>
          <Route exact path="/" render={()=> <h1>Home page</h1>} />
          <Route exact path="/login" render={()=> <h1>Log in</h1>} />
          <Route exact path="/register" render={()=> <h1>Register</h1>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;