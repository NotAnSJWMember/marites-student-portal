import React, { useMemo, useRef, useState } from "react";
import styles from "./SearchBar.module.scss";

import { TbSearch } from "react-icons/tb";

const SearchBar = ({
  data,
  width,
  height,
  margin,
  onSearch,
  placeholder = "Search",
  showSuggestions = false,
  showIcon = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState(data);

  const searchBarRef = useRef(null);
  const timeoutRef = useRef(null);

  const dropdownStyle = useMemo(() => {
    if (searchBarRef.current) {
      const rect = searchBarRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + 10,
        left: rect.left,
        width: rect.width,
        position: "absolute",
        zIndex: 10,
      };
    }
    return {};
  }, []);

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (query.length > 0) {
        const filteredSuggestions = data.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().startsWith(query.toLowerCase())
          )
        );
        setFilteredSuggestions(filteredSuggestions);
        onSearch(filteredSuggestions);
      } else {
        setFilteredSuggestions(data);
        onSearch(data);
      }
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery("");
    setFilteredSuggestions([]);
    onSearch(suggestion);
  };

  return (
    <div
      ref={searchBarRef}
      className={styles.searchBar}
      style={{ height: height, width: width, margin: margin }}
    >
      {showIcon && <TbSearch style={{ marginLeft: 13 }} size={20} />}
      <input
        type="text"
        value={searchQuery}
        placeholder={placeholder}
        onChange={handleInputChange}
        style={{ ...(!showIcon && { padding: "0 13px" }) }}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          className={styles.filteredSuggestionsDropdown}
          style={{
            ...dropdownStyle,
            position: "absolute",
            zIndex: 10,
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={styles.suggestionItem}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <p>{`${suggestion.firstName} ${suggestion.lastName}`}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
