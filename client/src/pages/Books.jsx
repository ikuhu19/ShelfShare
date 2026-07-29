import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import API from "../api/api";


function Books() {

  const [books, setBooks] = useState([]);


  useEffect(() => {

    const fetchBooks = async () => {

      try {

        const response = await API.get("/books/all");

        setBooks(response.data.books);

      } catch (error) {

        console.log(error);

      }

    };


    fetchBooks();

  }, []);



  return (

    <div className="books-page">

      <h1>Available Books 📚</h1>


      <div className="book-grid">

        {
          books.map((book) => (

            <BookCard
              key={book.id}
              book={book}
            />

          ))
        }

      </div>


    </div>

  );

}


export default Books;