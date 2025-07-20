import { useContext } from "react";
import { themeContext } from "../context";

export default function Category({ category, setCategory }) {
    
  const {dark, toggle} = useContext(themeContext);
  const theme = dark? "dark" : "light";

  const categories = [
    'busines',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology'
  ]
  return(
    <>
    <div>
      {categories.map((cat, index) => (
        <button 
        key={index}
        className={`button ${theme}btn ${cat == category? 'active':''} `}
  
        onClick={() => setCategory(cat)}
        >
           {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
    </>
  )
}