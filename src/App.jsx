import { useEffect, useState } from "react";
import Nav from "./components/Nav.jsx";
import "./App.css";

const dbURL = import.meta.env.VITE_DB;

function App() {
  const [query, setQuery] = useState("");
  const [booklist, setBooklist] = useState([]);

  useEffect(() => {
    fetch(dbURL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBooklist(data);
      });
  }, []);

  return (
    <>
      <Nav />
      <form>
        <input
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button">Search</button>
      </form>
      <ul className="book-list">
        {booklist.map((book) => (
          <li key={book.isbn}>
            <img
              src={book.img}
            />
            <p>Title:{book.title}</p>
            <p>Author:{book.author}</p>
            <p>Published: {book.pubYear}</p>
            <p>ISBN:{book.isbn}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
