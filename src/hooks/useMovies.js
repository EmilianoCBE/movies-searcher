import { useRef, useState, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'

export function useMovies ({ search, sort }) {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const previousSearch = useRef(search)

    const getMovies = useCallback(async({ search }) => {
        if(search === previousSearch.current) return
        try{
          setLoading(true)
          setError(null)
          previousSearch.current = search
          const newMovies = await searchMovies({ search })
          setMovies(newMovies)
        } catch (e) {
          setError(e)
        } finally {
          setLoading(false)
        }
      }, [search])

    const sortedMovies = useMemo(() => {
      return sort ?
      [...movies].sort((a, b) => a.title.localeCompare(b.title)) :
      movies
    }, [sort, movies]) // si no cambia el sort o las movies, el valor de sortedMovies se mantiene igual
  
    return { movies: sortedMovies, getMovies, loading }
  }