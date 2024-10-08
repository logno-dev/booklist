import { useEffect, useState } from "react";
import Nav from "./components/Nav.jsx";
import Fuse from "fuse.js";
import { v4 as uuid } from "uuid";
import "./App.css";

const dbURL = import.meta.env.VITE_DB;

function App() {
  const [query, setQuery] = useState("");
  const [booklist, setBooklist] = useState([]);
  const [fullList, setFullList] = useState([]);

  const fuseParams = {
    keys: [
      "author",
      "title",
      "pubYear",
      "isbn",
    ],
  };

  function filterList(e) {
    e.preventDefault();
    setQuery(e.target.value);
    if (query === "") {
      setBooklist(fullList);
      return;
    }

    const fuse = new Fuse(fullList, fuseParams);

    const newList = fuse.search(query);
    const fixedList = [];

    newList.forEach((i) => {
      fixedList.push({
        author: i.item.author,
        title: i.item.title,
        pubYear: i.item.pubYear,
        isbn: i.item.isbn,
        img: i.item.img,
      });
    });

    setBooklist(fixedList);
  }

  useEffect(() => {
    fetch(dbURL)
      .then((res) => res.json())
      .then((data) => {
        setFullList(data);
        setBooklist(data);
      });
  }, []);

  return (
    <>
      <Nav />
      <form>
        <input
          className="search-box"
          name="query"
          value={query}
          onChange={(e) => filterList(e)}
          placeholder="Search..."
        />
      </form>
      <ul className="book-list">
        {booklist.map((book) => (
          <li key={uuid()}>
            <img
              src={book.img}
            />
            <p>
              Title: <span className="card-title">{book.title}</span>
            </p>
            <p>
              Author: <span className="card-title">{book.author}</span>
            </p>
            <p>
              Published: <span className="card-title">{book.pubYear}</span>
            </p>
            <p>
              ISBN: <span className="card-title">{book.isbn}</span>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
