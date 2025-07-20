import { useContext,useState } from "react";
import { themeContext } from "../context";

export default function Pagination({ currentPage, totalArticles, onPageChange }) {
  const totalPages = Math.ceil(totalArticles / 10); // assuming 10 articles per page
  const maxVisiblePages = 5;

  const {dark, toggle} = useContext(themeContext);
  const theme = dark? "dark" : "light";

  // Determine start and end of visible page range
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return (
    <div className="flex gap-2 justify-center mt-4">
      <button
        className = {`${theme}btn button`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`button ${theme}btn ${page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          {page}
        </button>
      ))}

      <button
        className = {`${theme}btn button`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}