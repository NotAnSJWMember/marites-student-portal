import React, { useEffect, useRef, useState } from "react";
import { capitalize } from "lodash";
import styles from "./FormSelect.module.scss";

export const FormSelect = ({ name, value, options, register, errors, ...props }) => {
  const hasError = errors?.[value];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isAbove, setIsAbove] = useState(false);

  const selectRef = useRef(null);
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
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleOptionHover = (index) => {
    setHoveredIndex(index);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.formItem}>
      <div className={styles.selectContainer}>
        <div
          className={`${styles.selectBox} ${hasError ? styles.error : ""}`}
          onClick={handleShowOptions}
          {...props}
          ref={selectRef}
          style={selectedOption ? { color: "black" } : { color: "gray" }}
        >
          {selectedOption ? selectedOption.label : `Select ${capitalize(name)}`}
        </div>
        <div
          className={`${styles.optionsContainer} ${isOpen ? styles.show : ""}`}
          style={{
            bottom: isAbove ? "110%" : "auto",
            top: isAbove ? "auto" : "110%",
          }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`${styles.option} ${
                hoveredIndex === index ? styles.optionHover : ""
              } ${selectedOption?.value === option.value ? styles.selected : ""} ${
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

        {hasError && <span className={styles.errorMsg}>{errors[value]?.message}</span>}
      </div>
    </div>
  );
};
