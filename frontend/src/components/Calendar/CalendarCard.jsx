import React, { useState } from "react";
import styles from "./CalendarCard.module.scss";
import {
   format,
   startOfMonth,
   endOfMonth,
   startOfWeek,
   endOfWeek,
   eachDayOfInterval,
   addMonths,
   subMonths,
   isSameMonth,
   isToday,
} from "date-fns";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

const CalendarCard = () => {
   const [currentMonth, setCurrentMonth] = useState(new Date());

   const handlePrevMonth = () => {
      setCurrentMonth(subMonths(currentMonth, 1));
   };

   const handleNextMonth = () => {
      setCurrentMonth(addMonths(currentMonth, 1));
   };

   const startDate = startOfWeek(startOfMonth(currentMonth), {
      weekStartsOn: 1,
   });
   const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });

   const daysInMonth = eachDayOfInterval({
      start: startDate,
      end: endDate,
   });

   const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

   return (
      <div className={styles.card}>
         <div className={styles.header}>
            <button onClick={handlePrevMonth}>
               <TbChevronLeft size={18} />
            </button>
            <h2>{format(currentMonth, "MMMM")}</h2>
            <button onClick={handleNextMonth}>
               <TbChevronRight size={18} />
            </button>
         </div>
         <div className={styles.dayLabels}>
            {dayLabels.map((label, index) => (
               <div key={index} className={styles.dayLabel}>
                  {label}
               </div>
            ))}
         </div>
         <div className={styles.calendarGrid}>
            {daysInMonth.map((day, index) => (
               <div
                  key={index}
                  className={`
                  ${styles.day} 
                  ${!isSameMonth(day, currentMonth) ? styles.inactiveDay : ""}
                  ${isToday(day) ? styles.today : ""}
                  `}
               >
                  {format(day, "d")}
               </div>
            ))}
         </div>
      </div>
   );
};

export default CalendarCard;
