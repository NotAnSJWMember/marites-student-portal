import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/src/stylesheets/datepicker.scss";

import styles from "./CustomDatePicker.module.scss";

const CustomDatePicker = ({ selectedDate, setSelectedDate, errors }) => {
  const hasError = errors;
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
    }, 150);
  };

  const handleCalendarClose = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeoutRef]);

  return (
    <div className={styles.formItem}>
      <DatePicker
        id="birthdate"
        showPopperArrow={false}
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MMMM d, yyyy"
        className={styles.customInput}
        placeholderText="Select a date"
        enableTabLoop={false}
        wrapperClassName={styles.customWrapper}
        popperClassName={`${styles.customPopper} ${isOpen ? styles.show : ""}`}
        calendarClassName={`${styles.customCalendar} ${isOpen ? styles.show : ""}`}
        showYearDropdown
        yearDropdownItemNumber={30}
        scrollableYearDropdown
        onCalendarOpen={handleCalendarOpen}
        onCalendarClose={handleCalendarClose}
        open={true}
      />
      {hasError && <span className={styles.errorMsg}>{errors.message}</span>}
    </div>
  );
};

export default CustomDatePicker;
