import { useState } from "react";
import API from "../api/api";

function AddBook() {

  const user = JSON.parse(localStorage.getItem("user"));


  const [book, setBook] = useState({

    title: "",
    author: "",
    category: "",
    book_condition: "",
    description: "",
    image: ""

  });



  const handleChange = (e) => {

    setBook({

      ...book,
      [e.target.name]: e.target.value

    });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!user) {

      alert("Please login first");

      return;

    }



    try {


      const response = await API.post("/books/add", {

        ...book,
        user_id: user.id

      });



      console.log(response.data);


      alert("Book Added Successfully 📚");



      setBook({

        title: "",
        author: "",
        category: "",
        book_condition: "",
        description: "",
        image: ""

      });



    } catch (error) {


      console.log(error);


      alert(
        error.response?.data?.message ||
        "Failed to add book"
      );


    }


  };



  return (

    <div className="add-page">


      <div className="add-box">


        <h1>Add Your Book 📚</h1>


        <p>Share your book with ShelfShare.</p>



        <form onSubmit={handleSubmit}>



          <input

            type="text"

            name="title"

            placeholder="Book Title"

            value={book.title}

            onChange={handleChange}

            required

          />



          <input

            type="text"

            name="author"

            placeholder="Author Name"

            value={book.author}

            onChange={handleChange}

            required

          />



          <input

            type="text"

            name="category"

            placeholder="Category"

            value={book.category}

            onChange={handleChange}

            required

          />



          <input

            type="text"

            name="book_condition"

            placeholder="Book Condition"

            value={book.book_condition}

            onChange={handleChange}

            required

          />



          <textarea

            name="description"

            placeholder="Description"

            value={book.description}

            onChange={handleChange}

          />



          <input

            type="text"

            name="image"

            placeholder="Image URL (optional)"

            value={book.image}

            onChange={handleChange}

          />



          <button type="submit">

            Add Book

          </button>



        </form>



      </div>


    </div>

  );

}


export default AddBook;