function BookCard({ book }) {

  return (

    <div className="book-card">

      <h2>{book.title}</h2>

      <p>
        Author: {book.author}
      </p>

      <p>
        Category: {book.category}
      </p>

      <p>
        Condition: {book.book_condition}
      </p>

      <p>
        Owner: {book.owner}
      </p>


      <button>
        Request Book
      </button>

    </div>

  );

}

export default BookCard;