import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const buttonClass =
    "text-white bg-blue-500 hover:bg-blue-700 rounded-full text-sm text-center px-5 py-2.5 me-2 mb-2 cursor-pointer";

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/guest`
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login Failed");
      }
      const data = await response.json();
      login(data.token, data.user);
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex justify-between">
      <Link to={"/"}>
        <h1 className="text-4xl font-bold mb-8 text-center cursor-pointer hover:text-gray-700 inline">
          Blog Posts
        </h1>
      </Link>
      <div className="flex gap-2 flex-wrap">
        {user ? (
          <>
            <Link className="text-white bg-blue-900 hover:bg-blue-950 rounded-full text-sm text-center px-5 py-2.5 me-2 mb-2 cursor-pointer">
              User: {user.username}
            </Link>
            <Link
              onClick={logout}
              className="text-white bg-blue-900 hover:bg-blue-950 rounded-full text-sm text-center px-5 py-2.5 me-2 mb-2 cursor-pointer"
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to={"/register"} className={buttonClass}>
              Register
            </Link>
            <Link to={"/login"} className={buttonClass}>
              Login
            </Link>
            <Link onClick={() => handleSubmit()} className={buttonClass}>
              Guest mode
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default NavBar;
