import { useState } from "react";
import Nav from "./components/Nav.jsx";
import "./App.css";

const dbURL = import.meta.env.VITE_DB;

function App() {
  const [query, setQuery] = useState("");
  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(false);

  function getBookList(e) {
    e.preventDefault();
    setBookList([]);
    setLoading(true);
    const url = "https://openlibrary.org/search.json?q=" +
      query.replace(" ", "-");
    fetch(url).then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setBookList(data.docs);
      });
  }

  return (
    <>
      <Nav />
      <h1>Add Books</h1>
      <form onSubmit={(e) => getBookList(e)}>
        <input
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ul className="book-list">
        {loading ? <h3>loading...</h3> : null}

        {bookList
          ? bookList.map((book) => (
            <li key={book.key}>
              {book.isbn
                ? (
                  <>
                    <img
                      src={"https://covers.openlibrary.org/b/id/" +
                        book.cover_i + "-M.jpg"}
                    />
                    <p>
                      Title: <span className="card-title">{book.title}</span>
                    </p>
                    <p>
                      Author:{" "}
                      <span className="card-title">{book.author_name}</span>
                    </p>
                    {book.publish_year && (
                      <p>
                        Published:{" "}
                        <span className="card-title">
                          {book.publish_year[0]}
                        </span>
                      </p>
                    )}
                    <p>
                      ISBN: <span className="card-title">{book.isbn[0]}</span>
                    </p>
                    <br />
                    <AddBook book={book} />
                  </>
                )
                : null}
            </li>
          ))
          : <li>no results</li>}
      </ul>
    </>
  );
}

function AddBook({ book }) {
  function addBook() {
    const newBook = {
      title: book.title,
      author: book.author_name.join(", "),
      pubYear: book.publish_year && book.publish_year[0],
      isbn: book.isbn[0],
      img: "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg",
    };
    console.log(newBook);
    try {
      fetch(dbURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "mode": "cors",
        },
        body: JSON.stringify(newBook),
      }).then((res) => {
        if (res.status === 569) {
          alert("entry already exists");
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
  return <button type="button" onClick={addBook}>Add</button>;
}

export default App;
