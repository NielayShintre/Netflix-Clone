/* 
🌟 APP: Make Netflix

Create a fetchMovies() function that will make a dynamic API call to what you need 👇
========================================

- fetchMovies()

** fetchMovies takes in an URL, a div id or class from the HTML, and a path (poster or backdrop)



These are the 3 main functions you must create 👇
========================================

- getOriginals()

- getTrendingNow()

- getTopRated()


** These functions will provide the URL you need to fetch movies of that genere **

These are all the DIV ID's you're gonna need access to 👇
========================================================
#1 CLASS 👉 'original__movies' = Div that holds Netflix Originals
#2 ID 👉 'trending' = Div that holds trending Movies
#3 ID 👉 'top_rated' = Div that holds top rated Movies
*/

// Call the main functions the page is loaded
window.onload = () => {
  getOriginals()
  getTrendingNow()
  getTopRated()
}

// ** Helper function that makes dynamic API calls **
// path_type 👉 (backdrop, poster)
// dom_element 👉 (trending, top rated)
// fetchMovies('https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1', 'top_rated', 'backdrop_path')
function fetchMovies(url, dom_element, path_type) {
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('something went wrong')
      }
    })
    .then(data => {
      showMovies(data, dom_element, path_type)
    })
    .catch(error_data => {
      console.log(error_data)
    })
}

//  ** Function that displays the movies to the DOM **
showMovies = (movies, dom_element, path_type) => {

  // Create a variable that grabs id or class
  var moviesEl = document.querySelector(dom_element)

  // Loop through object
  for (var movie of movies.results) {

    // Within loop create an img element
    var imageElement = document.createElement('img')

    // Set attribute
    imageElement.setAttribute('data-id', movie.id)

    // Set source
    imageElement.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`

    // Add event listener to handleMovieSelection() onClick
    imageElement.addEventListener('click', e => {
      handleMovieSelection(e)
    })
    // Append the imageElement to the dom_element selected
    moviesEl.appendChild(imageElement)
  }
}

// ** Function that fetches Netflix Originals **
function getOriginals() {
  var url =
    'https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213'
  fetchMovies(url, '.original__movies', 'poster_path')
}
// ** Function that fetches Trending Movies **
function getTrendingNow() {
  var url =
    'https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045'
  fetchMovies(url, '#trending', 'backdrop_path')
}
// ** Function that fetches Top Rated Movies **
function getTopRated() {
  var url =
    'https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1'
  fetchMovies(url, '#top_rated', 'backdrop_path')
}

// ** BONUS **

async function getMovieTrailer(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.results || [];
    } else {
      throw new Error('Something went wrong');
    }
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

const setTrailer = trailers => {
  const iframe = document.getElementById('movieTrailer');
  const movieNotFound = document.querySelector('.movieNotFound');
  if (trailers.length > 0) {
    movieNotFound.classList.add('d-none');
    iframe.classList.remove('d-none');
    iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`;
  } else {
    iframe.classList.add('d-none');
    movieNotFound.classList.remove('d-none');
  }
};

const handleMovieSelection = async e => {
  try {
    // Find the closest parent 'div' element with a 'data-id' attribute
    const movieElement = e.target.closest('[data-id]');
    if (!movieElement) return; // If no 'div' element with 'data-id' attribute found, do nothing

    // Get the movie ID from the 'data-id' attribute of the 'div' element
    const id = movieElement.dataset.id;

    const youtubeTrailers = (await getMovieTrailer(id)).filter(
      result => result.site === 'YouTube' && result.type === 'Trailer'
    );

    if (youtubeTrailers.length > 0) {
      setTrailer(youtubeTrailers);
      $('#trailerModal').modal('show');
    } else {
      console.log('No trailers found.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};




