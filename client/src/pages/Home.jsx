function Home() {
  return (
    <div className="home">

      <section className="hero">

        <div className="hero-content">
          <h1>
            Share Books.<br />
            Share Knowledge. 📚
          </h1>

          <p>
            A community platform where students can exchange
            books, notes, and learning resources easily.
          </p>

          <div className="hero-buttons">
            <button>Explore Books</button>
            <button className="secondary">
              Share a Book
            </button>
          </div>

        </div>

      </section>


      <section className="features">

        <h2>Why ShelfShare?</h2>

        <div className="cards">

          <div className="card">
            <h3>📚 Exchange Books</h3>
            <p>
              Give your unused books a new home.
            </p>
          </div>


          <div className="card">
            <h3>📝 Share Notes</h3>
            <p>
              Help others learn with your resources.
            </p>
          </div>


          <div className="card">
            <h3>🤝 Connect Students</h3>
            <p>
              Build a learning community.
            </p>
          </div>

        </div>

      </section>


    </div>
  );
}

export default Home;