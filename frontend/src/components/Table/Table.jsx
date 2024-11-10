import React, { useMemo, useState } from "react";
import styles from "./Table.module.scss";
import {
   TbArrowLeft,
   TbArrowRight,
   TbArrowsUpDown,
   TbDotsVertical,
   TbFileArrowRight,
   TbFilter,
   TbPlus,
} from "react-icons/tb";
import IconSizes from "constants/IconSizes";

import Checkbox from "components/ui/Checkbox/Checkbox";
import Popup from "components/Popup/Popup";
import SearchBar from "components/SearchBar/SearchBar";

const Table = ({ data, headers, content, popupContent, ctaText, ctaAction }) => {
   const [activePopup, setActivePopup] = useState(null);
   const [isPopupVisible, setIsPopupVisible] = useState(false);
   const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });
   const [selectedData, setSelectedData] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);

   const itemsPerPage = 7;
   const totalPages = Math.ceil(data.length / itemsPerPage);
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentData = useMemo(() => {
      return data.slice(indexOfFirstItem, indexOfLastItem);
   }, [data, indexOfFirstItem, indexOfLastItem]);

   const togglePopupAction = (userId, event) => {
      const rect = event.currentTarget.getBoundingClientRect();

      setTimeout(() => {
         if (activePopup === userId) {
            closePopupAction();
         } else {
            setActivePopup(userId);
            setIsPopupVisible(true);
            setPopupPosition({ top: rect.bottom - 40, left: rect.left - 150 });
         }
      }, 100);
   };

   const closePopupAction = () => {
      setIsPopupVisible(false);
      setTimeout(() => {
         setActivePopup(null);
      }, 100);
   };

   const handleCheckboxChange = (dataId) => {
      if (selectedData.includes(dataId)) {
         setSelectedData(selectedData.filter((id) => id !== dataId));
      } else {
         setSelectedData([...selectedData, dataId]);
      }
   };

   const handleSelectAll = () => {
      if (selectedData.length === currentData.length) {
         setSelectedData([]);
      } else {
         setSelectedData(currentData.map((data) => data._id));
      }
   };

   const handlePreviousPage = () => {
      if (currentPage !== 1) setCurrentPage(currentPage - 1);
   };
   const handleNextPage = () => {
      if (currentPage !== totalPages) setCurrentPage(currentPage + 1);
   };
   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

   return (
      <div className={styles.tableWrapper}>
         <div className={styles.table}>
            <div className={styles.toolsContainer}>
               <SearchBar height="100%" width="30rem" />
               <div className={styles.buttonContainer}>
                  <button
                     type="button"
                     className={`${styles.iconBtn} ${styles.secondaryBtn}`}
                  >
                     <TbFileArrowRight size={IconSizes.SMALL} />
                     Export
                  </button>
                  <button
                     type="button"
                     className={`${styles.iconBtn} ${styles.secondaryBtn}`}
                  >
                     <TbFilter size={IconSizes.SMALL} />
                     Filter
                  </button>
                  <button
                     type="button"
                     className={`${styles.iconBtn} ${styles.secondaryBtn}`}
                  >
                     <TbArrowsUpDown size={IconSizes.SMALL} />
                     Sort
                  </button>
                  <button
                     type="button"
                     className={`${styles.iconBtn} ${styles.primaryBtn}`}
                     onClick={ctaAction}
                  >
                     <TbPlus size={IconSizes.SMALL} />
                     {ctaText}
                  </button>
               </div>
            </div>
            <div className={styles.tableHeader}>
               <Checkbox
                  id="select-all"
                  isChecked={selectedData.length === currentData.length}
                  onChange={handleSelectAll}
               />
               {headers.map((header, index) => {
                  return <h4 key={`header-${index}`}>{header}</h4>;
               })}
            </div>
            {currentData.map((data, index) => (
               <div key={data._id}>
                  <div className={styles.tableItem}>
                     <Checkbox
                        id={`checkbox-${data._id}`}
                        isChecked={selectedData.includes(data._id)}
                        onChange={() => handleCheckboxChange(data._id)}
                     />
                     {content(data)}
                     <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.iconBtn}`}
                        onClick={(event) => togglePopupAction(data._id, event)}
                     >
                        <TbDotsVertical size={IconSizes.MEDIUM} />
                     </button>
                     {activePopup === data._id && (
                        <Popup
                           show={isPopupVisible}
                           close={closePopupAction}
                           position={popupPosition}
                        >
                           {popupContent(data)}
                        </Popup>
                     )}
                  </div>
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
      </div>
   );
};

export default Table;
