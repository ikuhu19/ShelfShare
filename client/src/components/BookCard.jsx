import API from "../api/api";

function BookCard({ book }) {

  const user = JSON.parse(localStorage.getItem("user"));

  const handleRequest = async () => {

    if (!user) {
      alert("Please login first");
      return;
    }

    if (user.id === book.user_id) {
      alert("You cannot request your own book.");
      return;
    }

    try {

      const response = await API.post("/requests/send", {
        book_id: book.id,
        requester_id: user.id
      });

      alert(response.data.message);

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to send request"
      );

    }

  };

  return (

    <div className="book-card">

      <h2>{book.title}</h2>

      <p><strong>Author:</strong> {book.author}</p>

      <p><strong>Category:</strong> {book.category}</p>

      <p><strong>Condition:</strong> {book.book_condition}</p>

      <p><strong>Owner:</strong> {book.owner}</p>

      {user && user.id !== book.user_id && (
        <button onClick={handleRequest}>
          Request Book 📚
        </button>
      )}

    </div>

  );

}

export default BookCard;