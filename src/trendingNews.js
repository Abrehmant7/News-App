import { db } from "./firebase";
import { 
  collection, doc, addDoc, getDoc, setDoc, limit, 
  increment, updateDoc, query, orderBy, getDocs, count 
} from "firebase/firestore";

// Define collection names for searches and trending articles
const searchCollection = "searches";
const articleCollection = "trendingArticles";

/**
 * Updates the search count for a given search term in Firestore
 * @param {string} searchTerm - The term being searched
 */
export const updateNewsSearchCount = async (searchTerm) => {
    try {
        // Create a reference to the document with the search term as ID
        const refDoc = doc(db, searchCollection, searchTerm);
        // Check if the document already exists
        const docSnap = await getDoc(refDoc);

        if(docSnap.exists()){
            // If exists, increment the count by 1
            await updateDoc(refDoc, {
                count: increment(1)
            });
        }else{
            // If doesn't exist, create a new document with initial count of 1
            const uniqueNewsID = crypto.randomUUID();

            await setDoc(refDoc, {
                searchTerm,
                searchTerm: searchTerm, // Duplicate field (could be consolidated)
                count: 1,
                topicID: uniqueNewsID, // Unique identifier for the topic
            })
        }
    } catch (error) {
        console.error(`error storing search data: ${error}`);
    }
};

/**
 * Generates a unique document ID for an article based on title and source
 * @param {string} title - Article title
 * @param {string} source - Article source name
 * @returns {string} Generated document ID
 */
const getArticleDocId = (title, source) => {
  // Take first 5 words of title, make lowercase, join with hyphens
  const titlePart = title
    .toLowerCase()
    .split(" ")
    .slice(0, 5)
    .join("-")
    .replace(/[^a-z0-9\-]/g, ""); // removes special characters

  // Clean source name by removing special characters
  const sourcePart = source.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Combine to create unique ID
  return `${titlePart}-${sourcePart}`;
};

/**
 * Updates or creates a trending article document in Firestore
 * @param {object} article - The article object containing title, url, and source
 */
export const updateTrendingArticles = async (article) => {
    // Generate a consistent ID for this article
    const articleId = getArticleDocId(article.title, article.source.name)
    try {
        const docRef = doc(db, articleCollection, articleId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            // If article exists, increment its count
            await updateDoc(docRef, {
                count: increment(1)
            });
        }else{
            // If new article, create document with initial data
            await setDoc(docRef, {
                articleId,
                count:1,
                Title: article.title,
                URL: article.url,
                Source: article.source
            })
        }
    } catch (error) {
        console.error(`error while storing trending article: ${error}`)
    }
}

/**
 * Fetches the top 5 most viewed articles, ordered by view count
 * @returns {Array} Array of trending article documents
 */
export const getTrendingArticle = async () => {
    try {
        // Create query to get top 5 articles by count
        const q = query(
            collection(db, articleCollection),
            orderBy("count", "desc"),
            limit(5)
        );

        const docSnap = await getDocs(q);
        const trendingNewsArticles = [];

        // Convert Firestore documents to plain JS objects
        docSnap.forEach(article => {
            trendingNewsArticles.push({ id: article.id, ...article.data() });
        });
        
        return trendingNewsArticles;
    } catch (error) {
        console.error(`error while fetching trending article: ${error}`)
    }
}

/**
 * Fetches the top 5 most searched terms, ordered by search count
 * @returns {Array} Array of trending search documents
 */
export const getTrendingSearchData = async () => {
    try {
        // Create query to get top 5 searches by count
        const q = query(
            collection(db, searchCollection),
            orderBy("count","desc"),
            limit(5)
        );

        const docSnap = await getDocs(q);
        const trendingSearch = [];

        // Convert Firestore documents to plain JS objects
        docSnap.forEach((search) => {
            trendingSearch.push({ id: search.id, ...search.data() });
        });
        
        return trendingSearch;
    } catch (error) {
        console.error(`error fetching search data: ${error}`);
    };
}