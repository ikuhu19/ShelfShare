import { useState } from "react";
import API from "../api/api";


function Register() {

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    college: ""
  });


  const handleChange = (e) => {

    setUser({
      ...user,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post("/users/register", user);

      alert(response.data.message);


    } catch(error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Registration failed"
      );

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-box">

        <h1>Create Account 📚</h1>


        <form onSubmit={handleSubmit}>


          <input
            name="name"
            placeholder="Full Name"
            value={user.name}
            onChange={handleChange}
            required
          />


          <input
            name="email"
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
          />


          <input
            name="password"
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
          />


          <input
            name="phone"
            placeholder="Phone Number"
            value={user.phone}
            onChange={handleChange}
          />


          <input
            name="college"
            placeholder="College Name"
            value={user.college}
            onChange={handleChange}
          />


          <button type="submit">
            Register
          </button>


        </form>

      </div>

    </div>

  );

}


export default Register;