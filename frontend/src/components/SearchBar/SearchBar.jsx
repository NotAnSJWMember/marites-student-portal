import React, { useMemo, useRef, useState } from "react";
import styles from "./SearchBar.module.scss";

import { TbSearch } from "react-icons/tb";

const flattenObject = (obj, prefix = "") =>
  Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      acc[newKey] = value;
    }

    return acc;
  }, {});

const preprocessData = (data) =>
  data.map((item) => ({
    original: item,
    flattened: flattenObject(item),
  }));

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

  const processedData = useMemo(() => preprocessData(data), [data]);

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
        const filteredSuggestions = processedData.filter(({ flattened }) =>
          Object.values(flattened).some((value) =>
            String(value).toLowerCase().includes(query.toLowerCase())
          )
        );
        setFilteredSuggestions(filteredSuggestions);
        onSearch(filteredSuggestions.map(({ original }) => original));
      } else {
        setFilteredSuggestions(processedData);
        onSearch(processedData.map(({ original }) => original));
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
