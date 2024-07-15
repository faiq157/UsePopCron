import { useEffect, useState } from "react";
import StarRating from "./StarRating"
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY='1957ff1a';
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]=useState("");
  const [selectedID,setSelectedID]=useState(null);
  function handleSelectedMovie(id){
    setSelectedID(selectedID=>id===selectedID?null:id);
  }
function handleCloseMovie(){
  setSelectedID(null)
}

function handleWatchMovie(movie){
  setWatched(watched=>[movie,...watched])
}
function handleDeleteMovie(id){
  setWatched(watched=>watched.filter(movie=>movie.imdbID!==id))
}

  useEffect(function(){
    const controller = new AbortController();
    
    setLoading(true);
        async function FetchMovie(){
          try {
            setLoading(true);
            setError("")
            const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=1957ff1a&s=${query}`,{
              signal:controller.signal
            })
            if(!res.ok) throw new Error("😩Something went wrong")
            const data = await res.json();
          if(data.Response==="False") throw new Error("Movie Not Found")
            setMovies(data.Search)
          Error("")
          } catch (error) {
            if(error.name==="AbortError") return;
            setError(error.message)
          }finally{
            setLoading(false);
          }
     
    }
    if(query.length < 1){
      setMovies([]);
      setLoading('');
      return;
    }
  
    FetchMovie()
    return function(){
      controller.abort();
    }
  }
  ,[query])
  return (
    <>
    <NavBar>
    <Search query={query} setQuery={setQuery}/>
    <NumResults movies={movies}/> 
    </NavBar>
    <Main>
    <Box >
      {/* {loading?<Loader/>: <MovieList movies={movies}/>} */}
      {!loading&&!error&&<MovieList onSelectMovie={handleSelectedMovie} movies={movies}/>}
      {error&&<ErrorMessage message={error}/>}
      {loading&&<Loader/>}
    
    </Box>
    <Box>
   {selectedID ?<SelectedMovie onCloseMovie={handleCloseMovie}  selectedID={selectedID} onAddWatched={handleWatchMovie} watched={watched}/>:
   <>
   <WatchedSummery watched={watched}  />
   <WatchedMovie watched={watched} onDeleteMovie={handleDeleteMovie} />
   </>}
    </Box>
   
    </Main>
     
    </>
  );
}

function ErrorMessage({message}){
return(
  <p className="error">{message}</p>
)
}

function Loader(){
  return(
    <div className="loader">
    <span>Loading...</span>
  </div>
  )
}

function NavBar({children}) {
 
  return (
    <nav className="nav-bar">
     <Logo/> 
     {children}
     
    </nav>
  )
}

function Search({query, setQuery}){
 
  return(
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  )
}
function Logo(){
  return(
<div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
  )
}

function NumResults({movies}){
  return(
    <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
  )
}

function Main({children}){
  return(
    <main className="main">
   {children}
  </main>
  )
}

function Box({children}){
 
  const [isOpen, setIsOpen] = useState(true);
  return(
    <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen && 
     children
    }
  </div>    
  )
}

function MovieList({movies,onSelectMovie}){
 
  return(
    <ul className="list list-movies">
        {movies?.map((movie) => (
         <Movie movie={movie} onSelectMovie={onSelectMovie} key={movie.imdbID}/>
        ))}
      </ul>
  )
}
function Movie({movie,onSelectMovie}){
  return(
    <li onClick={()=>onSelectMovie(movie.imdbID)} >
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>
  )
}

// function WatchedBox(){
 

//   const [isOpen2, setIsOpen2] = useState(true);


//   return(
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
       
//       )}
//     </div>
//   )
// }
function WatchedSummery({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return(
<div className="summary">
            <h2>Movies you watched</h2>
            <div>
              <p>
                <span>#️⃣</span>
                <span>{watched.length} movies</span>
              </p>
              <p>
                <span>⭐️</span>
                <span>{avgImdbRating.toFixed(2)}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{avgUserRating.toFixed(2)}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{avgRuntime.toFixed(2)} min</span>
              </p>
            </div>
          </div>
  )}

  function WatchedMovie({watched,onDeleteMovie}){
    return(
      <ul className="list">
            {watched.map((movie) => (
             <WatchMovieList  movie={movie} key={movie.imdbID} onDeleteMovie={onDeleteMovie}/>
            ))}
          </ul>
    )
  }

  function WatchMovieList({movie,handleSelectedMovie,onDeleteMovie}){
    return(
      <li key={movie.imdbID} onClick={handleSelectedMovie}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime}min</span>
        </p>
        <button className="btn-delete" onClick={()=>onDeleteMovie(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
    )
  }

  function SelectedMovie({selectedID,onCloseMovie,onAddWatched,watched,}){
    const [movie, setMovie] = useState({})
    const [isLoading, setIsLoading]=useState(false);
    const [userRating, setUserRating]=useState("");
    const {Title:title,Year:year,Poster:poster,Runtime:runtime,imdbRating:imdbRating,Plot:plot,Actors:actors,Director:director,Writer:writer,Released:released,Genre:genre,Language:language,Country:country,Awards:awards}=movie
    const isWatched=watched.map(movie=>movie.imdbID).includes(selectedID);
    const userRatedWarched=watched.find(movie=>movie.imdbID===selectedID)?.userRating;
    function HandleAdd(){
      const newlistMovies={
        imdbID:selectedID,
        Title:title,
        Year:year,
        Poster:poster,
        runtime:Number(runtime.split("").at(0)),
        imdbRating:Number(imdbRating),
        userRating:Number(userRating)
      }
      onAddWatched(newlistMovies)
      onCloseMovie();
    }
    useEffect(function(){
      async function getMovieDetails(){
        setIsLoading(true);
    const res = await  fetch(
        `http://www.omdbapi.com/?i=${selectedID}&apikey=${KEY}`
      )
      const data = await res.json();
      setMovie(data)
      setIsLoading(false);
      }
      getMovieDetails();
  }
  ,[selectedID]);

  useEffect(function(){
    if(!title) return;
    document.title=`Movie || ${title}`
    return function(){
      document.title=`usePopcorn`
    }
  },[title])
  useEffect(function(){
    document.addEventListener("keydown",function(e){
      if(e.code==="Escape"){
        onCloseMovie();
        console.log("Closing");
      }
    })
  },[onCloseMovie])

    return(
      <div className="details">
        {isLoading ? (
          <Loader/>
        ) : 
        <>
       
        <header>
        <button className="btn-back" onClick={onCloseMovie}>
        &larr;</button>
        <img src={poster} alt={`poster of ${movie}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            <span>{imdbRating} IMDb Rating</span>
            </p>
            </div>
        </header>
        <section>
          <div className="rating">
         { !isWatched ?
         <>
       
         <StarRating maxRating={10} size={24} onSetRating={setUserRating} /> 
          {userRating > 0 && <button onClick={HandleAdd} className="btn-add">+ add to list</button>}
          </>:
          <p >You Already Rated {userRatedWarched} 🌟</p>   }
          </div>
         
          <p>
            <em>{plot}</em>  
          </p>
          <p>
            Starring: {actors}
          </p>
          <p>
            Directed by: {director}
          </p>
          <p>
            Produced by: {writer}
          </p>
          <p>
            {released}
          </p>
        </section>
        </>
        }
      </div>
      
  
    )
  }