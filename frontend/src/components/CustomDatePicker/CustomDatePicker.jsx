import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./CustomDatePicker.module.scss";

const CustomDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const timeoutRef = useRef(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCalendarOpen = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 200);
  };

  const handleCalendarClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <DatePicker
      id="birthdate"
      showPopperArrow={false}
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="MMMM d, yyyy"
      className={styles.customInput}
      placeholderText="Select a date"
      enableTabLoop={false}
      popperClassName={`${styles.customPopper} ${isOpen ? styles.show : ""}`}
      calendarClassName={`${styles.customCalendar} ${isOpen ? styles.show : ""}`}
      showYearDropdown
      yearDropdownItemNumber={30}
      scrollableYearDropdown
      onCalendarOpen={handleCalendarOpen}
      onCalendarClose={handleCalendarClose}
    />
  );
};

export default CustomDatePicker;
