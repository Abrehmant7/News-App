import { useContext } from "react";
import { themeContext } from "../context";

export default function SearchBar({ searchTerm, setSearchTerm, category }){
  return(
    <>
      <div className='search'>
        <img className='searchSVG' src="search.svg" alt="search" />
        <input className='border-2 border-gray-300' type="text"
              placeholder={`Search ${category? category: "any"} news`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </>
  )
}