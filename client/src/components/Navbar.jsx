import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {

    localStorage.removeItem("user");

    alert("Logged out successfully");

    navigate("/login");

  };

  return (

    <nav>

      <h2>ShelfShare 📚</h2>

      <div>

        <Link to="/">Home</Link>

        <Link to="/books">Books</Link>

        {user ? (

          <>

            <span>Hi, {user.name} 👋</span>

            <Link to="/add-book">Add Book</Link>

            <button onClick={handleLogout}>
              Logout
            </button>

          </>

        ) : (

          <>

          <Link to="/requests">Requests</Link>

            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>

          </>

        )}


      </div>

    </nav>

  );

}

export default Navbar;