import './App.scss'; 
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import routes from './routes/Routes';

const AppRoutes =() => {
  const element = useRoutes(routes);
  return element;
}
function App() { 
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
