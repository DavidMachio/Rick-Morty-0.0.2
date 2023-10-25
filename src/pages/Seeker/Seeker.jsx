import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce"
import "./Seeker.css"
import axios from "axios";


const Seeker = () => {
  const [inputValue, setInputValue] = useState("");
  const [value] = useDebounce(inputValue, 700);
  const [characters, setCharacters] = useState([])
  const [pageNum, setPageNum] = useState(1)
  const [error, setError] = useState(false);

  const getCharacters = async () => {
    try {
      setError(false)
      const pag = await axios.get(`https://rickandmortyapi.com/api/character?page=${pageNum}`)
      setCharacters(pag.data.results)
      console.log("pag", pag)
    } catch (error) {
      setError(true)
    }
  };

  const searchCharacter = async () => {
    setError(false)
    try {
      const res = await axios.get(`https://rickandmortyapi.com/api/character?name=${value}`)
      console.log(res)
      setCharacters(res.data.results);
    } catch (error) {
      setError(true)
    }

  };
  const changePage = (newPage) => {
    if (newPage >= 1) {
      setPageNum(newPage);
      setInputValue("");
    }
  };


  useEffect(() => {
    if (value) {
      searchCharacter(); // Llama a searchCharacter si value no está vacío
    } else {
      // Si el campo de entrada está vacío, muestra todos los personajes nuevamente
      getCharacters();
    }

  }, [value, pageNum])




  return (
    <main>
      <div className="search">
        <input type="text"
          placeholder="Character name..."
          value={inputValue}
          onInput={(ev) => setInputValue(ev.target.value)} />
        <div className="pages">
          <button onClick={() => changePage(1)}>1</button>
          {pageNum > 1 ? (
            <button onClick={() => changePage(pageNum - 1)}>prev</button>
          ) : (
            <button disabled>prev</button>
          )}
          {pageNum < 42 ? (
            <button onClick={() => changePage(pageNum + 1)}>next</button>
          ) : (
            <button disabled>next</button>
          )}
          <button onClick={() => changePage(42)}>42</button>
        </div>
        <h3>Pag {pageNum} of 42</h3>
      </div>
      {error ? (
        <div className="error">
          <img className="not-exist" src="https://i.redd.it/2e99wgj1lei31.jpg" alt="Paceholder Rick&Morty" />
          <h2>No existe este personaje</h2>
        </div>
      ) : (
        <section className="results">
          {characters.map((char) => (
            <div key={char.id} className="card">
              <h3>{char.name}</h3>
              <div className="dates">
                <img src={char.image} alt={char.name} />
                <h4> Origen: {char.origin.name}</h4>
                <h4>Especie: {char.species}</h4>
                <h4>Estado: {char.status}</h4>
              </div>
            </div>

          ))}


        </section>
      )}
      <div className="pages down">
        <button onClick={() => changePage(1)}>1</button>
        {pageNum > 1 ? (
          <button onClick={() => changePage(pageNum - 1)}>prev</button>
        ) : (
          <button disabled>prev</button>
        )}
        {pageNum < 42 ? (
          <button onClick={() => changePage(pageNum + 1)}>next</button>
        ) : (
          <button disabled>next</button>
        )}
        <button onClick={() => changePage(42)}>42</button>
      </div>
      <h3 className="down">Pag {pageNum} of 42</h3>
    </main>
  )
}
export default Seeker;