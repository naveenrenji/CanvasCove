import './App.css';
import Routes from "./routes"
import { AuthProvider } from "./components";
import { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
          <Routes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
