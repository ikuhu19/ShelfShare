import { useState } from "react";
import API from "../api/api";


function Login() {


  const [user, setUser] = useState({
    email: "",
    password: ""
  });



  const handleChange = (e)=>{

    setUser({
      ...user,
      [e.target.name]: e.target.value
    });

  };



  const handleSubmit = async(e)=>{

    e.preventDefault();


    try {

      const response = await API.post(
        "/users/login",
        user
      );


      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );


      alert("Login Successful 🎉");


    } catch(error){

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    }

  };



  return (

    <div className="auth-page">

      <div className="auth-box">


        <h1>Welcome Back 👋</h1>


        <form onSubmit={handleSubmit}>


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


          <button type="submit">
            Login
          </button>


        </form>


      </div>

    </div>

  );

}


export default Login;