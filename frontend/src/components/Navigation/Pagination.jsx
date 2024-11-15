import React from "react";
import styles from "./Pagination.module.scss";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";
import IconSizes from "constants/IconSizes";

const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
   const totalPages = Math.ceil(totalItems / itemsPerPage);

   const handlePageClick = (page) => {
      if (page > 0 && page <= totalPages) {
         setCurrentPage(page);
      }
   };

   return (
      <div className={styles.pagination}>
         <TbArrowLeft
            className={styles.iconBtn}
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            size={IconSizes.SMALL}
         />
         {[...Array(totalPages)].map((_, index) => (
            <button
               key={`button-${index}`}
               type='button'
               className={currentPage === index + 1 ? styles.active : ""}
               onClick={() => handlePageClick(index + 1)}
            >
               {index + 1}
            </button>
         ))}
         <TbArrowRight
            className={styles.iconBtn}
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            size={IconSizes.SMALL}
         />
      </div>
   );
};

export default Pagination;
