import React, { useState } from "react";
import styles from "./SearchBar.module.scss";

import { TbSearch } from "react-icons/tb";

const SearchBar = ({ data, onSearch, width, height }) => {
   const [searchQuery, setSearchQuery] = useState("");
   const [suggestions, setSuggestions] = useState([]);

   const handleInputChange = (event) => {
      const query = event.target.value;
      setSearchQuery(query);
      onSearch(query);

      if (query.length > 0) {
         const filteredSuggestions = data.filter((item) =>
            Object.values(item).some((value) =>
               String(value).toLowerCase().includes(query.toLowerCase())
            )
         );
         setSuggestions(filteredSuggestions);
      } else {
         setSuggestions([]);
      }
   };

   const handleSuggestionClick = (suggestion) => {
      setSearchQuery(suggestion._id); // Adjust this based on your data
      setSuggestions([]);
   };

   return (
      <div
         className={styles.searchBar}
         style={{ height: height, width: width }}
      >
         <TbSearch size={20} />
         <input
            type="text"
            value={searchQuery}
            placeholder="Search"
            onChange={handleInputChange}
         />
         {suggestions.length > 0 && (
            <div className={styles.suggestionsDropdown}>
               {suggestions.map((suggestion, index) => (
                  <div
                     key={index}
                     className={styles.suggestionItem}
                     onClick={() => handleSuggestionClick(suggestion)}
                  >
                     <p>
                        {suggestion.firstName} {suggestion.lastName}
                     </p>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default SearchBar;
