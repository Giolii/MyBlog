import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlogList from "./components/BlogList";
import BlogPost from "./components/BlogPost";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import AuthProvider from "./contexts/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="container mx-auto px-4 py-8">
          <NavBar />
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/posts/:id" element={<BlogPost />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
