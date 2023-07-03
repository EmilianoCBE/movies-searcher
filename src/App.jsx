import './App.css'
// import { useRef } from 'react' // te permite crear una referencia 
// mutable que persiste durante todo el ciclo de vida de tu componente
// y cada vez que cambia no renderiza el componente de nuevo, valor que persiste entre renders
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import { useEffect, useState, useRef, useCallback } from 'react'
import debounce from 'just-debounce-it'

function useSearch() {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if(isFirstInput.current){
      isFirstInput.current = search === ''
      return 
    }
    if(search === ''){
      setError('No se puede buscar una película vacía')
      return
    }

    setError(null)
  },[search])

  return { search, updateSearch, error }
}

function App() {
  // const inputRef = useRef()
  const [sort, setSort] = useState(false)
  const {search, updateSearch, error} = useSearch()
  const { movies, getMovies, loading } = useMovies({ search, sort })

  const debouncedGetMovies = useCallback(debounce(search => {
    getMovies({ search })
  }, 300)
  , [getMovies])

  const handleSubmit = (event) => {
    event.preventDefault()
    // const value = inputRef.current.value
    getMovies({ search })
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }

  const handleSort = () => {
    setSort(!sort)
  }

  return (
    <div className="page">
      <header>
        <h1>Movie searcher</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input /*ref={inputRef}*/ 
            value={search} 
            name="query" 
            type="text" 
            placeholder="Star Wars" 
            onChange={handleChange}
          />
          <input 
            type="checkbox"
            onChange={handleSort}
            checked={sort}
          />
          <button type="submit">Search</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading ? 
          <p>Cargando...</p> : 
          <Movies movies={movies}/>
        }
      </main>
    </div>
  )
}

export default App
