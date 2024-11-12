import React, { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.scss";

import { TbSearch } from "react-icons/tb";

const SearchBar = ({
   data,
   onSearch,
   width,
   height,
   placeholder = "Search",
}) => {
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedQuery, setSelectedQuery] = useState("");
   const [suggestions, setSuggestions] = useState([]);
   const [dropdownStyle, setDropdownStyle] = useState({});

   const searchBarRef = useRef(null);

   const handleInputChange = (event) => {
      const query = event.target.value;
      setSearchQuery(query);

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
      setSearchQuery("");
      setSuggestions([]);
      onSearch(suggestion);
   };

   useEffect(() => {
      if (searchBarRef.current) {
         const rect = searchBarRef.current.getBoundingClientRect();
         setDropdownStyle({
            top: rect.bottom + 10,
            left: rect.left,
            width: rect.width,
         });
      }
   }, [searchQuery]);

   return (
      <div
         ref={searchBarRef}
         className={styles.searchBar}
         style={{ height: height, width: width }}
      >
         <TbSearch style={{ marginLeft: 20 }} size={20} />
         <input
            type="text"
            value={searchQuery}
            placeholder={placeholder}
            onChange={handleInputChange}
         />
         {suggestions.length > 0 && (
            <div
               className={styles.suggestionsDropdown}
               style={{
                  ...dropdownStyle,
                  position: "absolute",
                  zIndex: 10,
               }}
            >
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
