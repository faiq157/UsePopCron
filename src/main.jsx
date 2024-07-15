import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import './index.css'
// function Test(){
//   const [movieRating, setMovieRating] = useState(0)
//   return(
//     <div>
//       <StarRating maxRating={5} color='blue' onSetRating={setMovieRating}  />
//       <p>This movie Rating was {movieRating}</p>
//     </div>
   
//   )
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} defaultRating={3} size={20} color='red' messages={['terrible', 'bad', 'okay', 'good', 'great']} className='star-rating' />
    <Test />  */}
  </React.StrictMode>,
)
