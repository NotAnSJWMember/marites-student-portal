import React, { useEffect, useRef, useState } from "react";
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
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const searchBarRef = useRef(null);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 0) {
        const filteredSuggestions = data.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().startsWith(searchQuery.toLowerCase())
          )
        );
        setSuggestions(filteredSuggestions);
        onSearch(filteredSuggestions);
      } else {
        setSuggestions(data);
        onSearch(data);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [data, onSearch, searchQuery]);

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
      {showSuggestions && suggestions.length > 0 && (
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
              <p>{`${suggestion.firstName} ${suggestion.lastName}`}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
