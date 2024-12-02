import React, { useEffect, useRef, useState } from "react";
import styles from "./FormSelect.module.scss";
import SearchBar from "components/SearchBar/SearchBar";

export const FormSelect = ({
  name,
  options,
  hasError,
  width,
  smallPadding = false,
  defaultValue,
  selectedData,
  setSelectedData,
  required = true,
  disabled = false,
  searchBar = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAbove, setIsAbove] = useState(false);
  const [searchedOptions, setSearchOptions] = useState([]);
  const [selectOptions, setSelectOptions] = useState(options);

  const selectRef = useRef(null);
  const optionsRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (defaultValue && !selectedData) {
      const defaultOption = options.find((option) => option.value === defaultValue);
      if (defaultOption) {
        setSelectedData(defaultOption);
      }
    }
  }, [defaultValue, selectedData, setSelectedData, options]);

  const handleShowOptions = () => {
    if (disabled) return; // Prevent opening the dropdown when disabled

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const rect = selectRef.current.getBoundingClientRect();
      const screenHeight = window.innerHeight;

      const spaceBelow = screenHeight - rect.bottom;

      if (spaceBelow < 200) {
        setIsAbove(true);
      } else {
        setIsAbove(false);
      }

      setIsOpen((prev) => !prev);
    }, 150);
  };

  const handleOptionClick = (option) => {
    if (disabled) return;
    setSelectedData(option);
    setIsOpen(false);
  };

  const handleOptionHover = (index) => {
    setHoveredIndex(index);
  };

  const handleClickOutside = (event) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target) &&
      optionsRef.current &&
      !optionsRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchBar) setSelectOptions(searchedOptions);
  }, [searchBar, searchedOptions]);

  return (
    <div className={styles.formItem} style={{ width: width }}>
      <div className={styles.selectContainer}>
        <div
          className={`${styles.selectBox} ${disabled ? styles.disabled : ""}`}
          onClick={handleShowOptions}
          style={{
            ...(selectedData ? { color: "black" } : { color: "gray" }),
            ...(smallPadding ? { padding: "5px 10px" } : { padding: "0.7rem 1rem" }),
            ...(disabled ? { backgroundColor: "#f0f0f0", cursor: "not-allowed" } : {}),
          }}
          ref={selectRef}
        >
          {selectedData ? selectedData.label : `Select ${name}`}
        </div>
        <div
          className={`${styles.optionsContainer} ${isOpen ? styles.show : ""}`}
          style={{
            bottom: isAbove ? "110%" : "auto",
            top: isAbove ? "auto" : "110%",
          }}
          ref={optionsRef}
        >
          {searchBar && (
            <SearchBar
              data={options}
              height={35}
              margin={10}
              onSearch={setSearchOptions}
              showIcon={false}
            />
          )}
          {selectOptions.map((option, index) => (
            <div
              key={`${option.value}-${index}`}
              style={smallPadding ? { padding: "5px 10px" } : { padding: "0.75rem 1rem" }}
              className={`${styles.option} ${
                hoveredIndex === index ? styles.optionHover : ""
              } ${selectedData?.value === option.value ? styles.selected : ""} ${
                isOpen ? styles.show : ""
              }`}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => handleOptionHover(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
