import React, { useEffect, useRef, useState } from "react";
import styles from "./FormSelect.module.scss";

export const FormSelect = ({
  name,
  options,
  required = true,
  hasError,
  defaultValue,
  smallPadding = false,
  selectedData,
  setSelectedData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAbove, setIsAbove] = useState(false);

  const selectRef = useRef(null);
  const optionsRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Only set selectedData if it hasn't been set yet and there's a defaultValue
    if (defaultValue && !selectedData) {
      const defaultOption = options.find((option) => option.value === defaultValue);
      if (defaultOption) {
        setSelectedData(defaultOption);
      }
    }
  }, [defaultValue, selectedData, setSelectedData, options]);

  const handleShowOptions = () => {
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

  return (
    <div className={styles.formItem}>
      <div className={styles.selectContainer}>
        <div
          className={`${styles.selectBox}`}
          onClick={handleShowOptions}
          style={{
            ...(selectedData ? { color: "black" } : { color: "gray" }),
            ...(smallPadding ? { padding: "5px 10px" } : { padding: "0.7rem 1rem" }),
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
          {options.map((option, index) => (
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
