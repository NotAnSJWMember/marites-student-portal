import React, { useMemo, useState } from "react";
import styles from "./UserTable.module.scss";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";

const UserTable = ({ data, headers, content }) => {
   const [currentPage, setCurrentPage] = useState(1);

   const itemsPerPage = 7;
   const totalPages = Math.ceil(data.length / itemsPerPage);
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentData = useMemo(() => {
      return data.slice(indexOfFirstItem, indexOfLastItem);
   }, [data, indexOfFirstItem, indexOfLastItem]);

   const handlePreviousPage = () => {
      if (currentPage !== 1) setCurrentPage(currentPage - 1);
   };
   const handleNextPage = () => {
      if (currentPage !== totalPages) setCurrentPage(currentPage + 1);
   };
   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

   return (
      <>
         <div>
            <div className={styles.tableHeader}>
               {headers.map((header, index) => {
                  return <h4 key={`header-${index}`}>{header}</h4>;
               })}
            </div>
            {currentData.map((data, index) => (
               <div key={data._id}>
                  <div className={styles.tableItem}>{content(data)}</div>
                  {index !== currentData.length - 1 && (
                     <div className={styles.line}></div>
                  )}
               </div>
            ))}
         </div>
         <div className={styles.pagination}>
            <TbArrowLeft
               className={styles.iconBtn}
               onClick={handlePreviousPage}
               size={16}
            />
            {[...Array(totalPages)].map((_, index) => (
               <button
                  key={`button-${index}`}
                  type="button"
                  className={currentPage === index + 1 ? styles.active : ""}
                  onClick={() => handlePageChange(index + 1)}
               >
                  {index + 1}
               </button>
            ))}
            <TbArrowRight
               className={styles.iconBtn}
               onClick={handleNextPage}
               size={16}
            />
         </div>
      </>
   );
};

export default UserTable;
