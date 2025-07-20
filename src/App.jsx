import { useContext, useEffect, useState } from 'react'
import { updateNewsSearchCount, getTrendingSearchData, updateTrendingArticles, getTrendingArticle } from './trendingNews';
import { useDebounce } from 'react-use'
import { themeContext, ThemeProvider } from './context'
import './App.css'
import Category from './components/categories';
import SearchBar from './components/searchBar';
import Loader from './components/loader';
import Pagination from './components/pagination';

function App() {
  return(
    <ThemeProvider>
    <NewsApp />
  </ThemeProvider>
  )
}

function NewsApp() {

  // ######################################### Body start ####################################################


  const [newsList, setNewsList] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);

  const [category, setCategory] = useState("");
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);

  // theme state (made global through useContext)
  const {dark, toggle} = useContext(themeContext);
  const theme = dark? "dark" : "light";
  
  // API fetching
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const BASE_API_URL = "https://gnews.io/api/v4";

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm] )

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      let endpoint = debouncedSearchTerm
        ? `${BASE_API_URL}/search?q=${debouncedSearchTerm}&in=title&country=pk&token=${API_KEY}&page=${pageNo}`
        : `${BASE_API_URL}/top-headlines?country=pk&token=${API_KEY}&page=${pageNo}`;

      if (category) {
        endpoint += `&category=${category}`;
      }

      const responce = await fetch(endpoint);

      if(!responce.ok){
        throw new Error("Can't fetch the news.")
      }

      const data = await responce.json();

      if(!data.articles || data.articles.length == 0){
        setError("No articles found")
        setNewsList([]);
        return;
      }

      setTotalArticles(data.totalArticles);
      setNewsList(data.articles);

      if(data.articles.length > 0 && searchTerm){
        await updateNewsSearchCount(searchTerm, data.articles[0]);
      }
    } catch (e) {
      console.error("error fetching news " + e);
      setError("Error fetching news! Try again later.")
    } finally{
      setLoading(false);
    }
  }

  // Trending searches pulled from firebase
  const getTrendingSearches = async () => {
    try {
      const searches = await getTrendingSearchData();
      setTrendingSearches(searches);
    } catch (error) {
      console.error(error);
    }
  }

  // this function runs when user clicks on an article to update the trending articles
  function handleClick(article){
    updateTrendingArticles(article);
  }

  // Trending articles pulled from firebase
  const getTrendingArticles = async () => {
    try {
      const articles = await getTrendingArticle();
      setTrendingArticles(articles);
    } catch (error) {
      console.error(error);
    }
  }

  const searchClick = (value) => {
    setSearchTerm(value);
  }

   useEffect(() => {
    getTrendingSearches();
   }, []);

   useEffect(() => {
    getTrendingArticles();
   }, []);

   useEffect(() => {
      fetchData();
    }, [debouncedSearchTerm, category, pageNo])

    // ############################################ Body End #####################################################

  return (
    <div className={`${theme}body`}>
 
    {/********************************************** NAVBAR start ******************************************************/}
      <div className='flex justify-between bg-gray-200 top-0 left-0 sticky w-full'>
        <Category category={ category } setCategory={ setCategory } />
        <button onClick={toggle} className = {`${theme}btn button`}>{dark? "Dark Mode": "Light Mode"}</button>
        <SearchBar searchTerm = { searchTerm }  setSearchTerm = { setSearchTerm } category = { category } />
      </div>
    {/*********************************************** NAVBAR end *******************************************************/}


    {/**************************************  TOP SEARCH BUTTONs start   **********************************************/}
      <section className="my-10">
        <p className='text-3xl font-black text-gray-900'>Top Serches</p>
      <ul className='flex justify-center'>
        {trendingSearches.length > 0 && trendingSearches.map((search) => (
       <li key={search.id} 
       className = {`flex justify-center m-3 p-2 rounded-b-lg hover:bg-stone-300 hover:rounded-none ${theme}btn`}

       onClick={() => searchClick(search.searchTerm)}>
          <img className='w-6' src="trending-arrow.svg" alt="trending arrow" />
          <p  className='text-xl font-black underline'>{search.searchTerm}</p>
        </li>
      ))}
      </ul>
      </section>
    {/**************************************  TOP SEARCH BUTTONs end     **********************************************/}

    
    {/****************************************   TOP ARTICLEs start    ************************************************/}
      <section className=" p-5 my-5">
        <p className='text-3xl font-black text-gray-900'>Top 5 Articles</p>
      <ul className='flex gap-5 m-5'>
        {trendingArticles.length > 0 && trendingArticles.map((article) => (
        <li key={article.id} 
        className='cardHover p-4 rounded-b-2xl border-neutral-400 border-4 bg-gradient-to-b from-neutral-400 to-white
         w-1/5 h-auto flex flex-col justify-between hover:rounded-none'>
          <p>{article.Title}</p>
          <p className='underline text-blue-500 hover:text-blue-800 wrap-anywhere'>{article.URL}</p>
          <p className='text-lg font-bold'>{article.Source.name}</p>
        </li>
      ))}
      </ul>
      </section>
    {/****************************************   TOP ARTICLEs end    ************************************************/}


    {/****************************************   MAIN ARTICLEs start    ************************************************/}
      <section className='mt-10'>
        <p className='text-3xl font-black text-gray-900 my-6'>Top Headlines for Today</p>
        {loading? (<Loader />) : (
        error? (<p className='text-red-500 text-xl font-bold'>{error}</p>) : (
          <ul className="newsGrid">
              {newsList.map((news, index) => (
                <li key={index}>
                  <div className="newsDiv bg-gradient-to-r from-white to-neutral-400 border-4
                   border-neutral-400 rounded-r-2xl hover:rounded-none">

                    <div className="imgDiv">
                      <img src={news.image}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/no-movie.png';
                            }}
                          alt={news.title}
                      />
                    </div>
                    <div className="content">
                      <h2>{news.title}</h2>
      
                      <a  className='underline text-blue-500 hover:text-blue-800 wrap-anywhere'
                          onClick={() => handleClick(news)}
                          href={news.url} target="_blank" rel="noopener noreferrer">
                          {news.url}</a>
                      <h4 className='text-lg font-bold'>{news.source.name}</h4>
                    </div>
                  </div>
                </li>
  ))}
      </ul>
        )
      )}
      </section>
    {/****************************************   MAIN ARTICLEs end    ************************************************/}

      <Pagination currentPage={pageNo} totalArticles={totalArticles} onPageChange={setPageNo}/>
    </div>
  )
}


export default App;
