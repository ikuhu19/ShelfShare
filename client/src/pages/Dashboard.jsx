function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (

    <div className="dashboard">

      <h1>Welcome, {user?.name} 👋</h1>

      <p><strong>Email:</strong> {user?.email}</p>

      <p><strong>Phone:</strong> {user?.phone}</p>

      <p><strong>College:</strong> {user?.college}</p>

      <br />

      <h2>📚 My Books</h2>

      <p>Coming next...</p>

      <h2>📩 My Requests</h2>

      <p>Coming next...</p>

    </div>

  );

}

export default Dashboard;