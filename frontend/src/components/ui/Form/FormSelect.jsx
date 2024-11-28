import React, { useEffect, useRef, useState } from "react";
import { capitalize } from "lodash";
import styles from "./FormSelect.module.scss";

export const FormSelect = ({ selectedData, setSelectedData, name, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAbove, setIsAbove] = useState(false);

  const selectRef = useRef(null);
  const optionsRef = useRef(null);
  const timeoutRef = useRef(null);

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
          style={selectedData ? { color: "black" } : { color: "gray" }}
          ref={selectRef}
        >
          {selectedData ? selectedData.label : `Select ${capitalize(name)}`}
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
              key={option.value}
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
