import React, { useMemo, useState } from "react";
import styles from "./UserManagement.module.scss";
import {
   TbArrowLeft,
   TbArrowRight,
   TbFilter,
   TbPlus,
   TbEdit,
   TbFileArrowRight,
   TbTrash,
} from "react-icons/tb";

import Table from "components/Table/Table";
import Layout from "components/Layout/Layout";
import SearchBar from "components/SearchBar/SearchBar";
import useFetchData from "hooks/useFetchData";

const POPUP_ICON_SIZE = 25;
const SMALL_ICON_SIZE = 19;

const UserManagement = () => {
   const [activePopup, setActivePopup] = useState(null);
   const [isPopupVisible, setIsPopupVisible] = useState(false);
   const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });
   const [selectedUsers, setSelectedUsers] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);

   const { data: users } = useFetchData("user");

   const usersPerPage = 8;
   const totalPages = Math.ceil(users.length / usersPerPage);
   const indexOfLastUser = currentPage * usersPerPage;
   const indexOfFirstUser = indexOfLastUser - usersPerPage;
   const currentUsers = useMemo(() => {
      return users.slice(indexOfFirstUser, indexOfLastUser);
   }, [users, indexOfFirstUser, indexOfLastUser]);

   const renderPopupContent = (user) => (
      <div className={styles.popupWrapper}>
         <div className={styles.popupContent}>
            <button type="button" className={styles.iconCta}>
               <TbEdit size={POPUP_ICON_SIZE} />
               Edit details
            </button>
            <button type="button" className={styles.iconCta}>
               <TbFileArrowRight size={POPUP_ICON_SIZE} />
               Export details
            </button>
            <button
               type="button"
               className={`${styles.deleteBtn} ${styles.iconCta}`}
            >
               <TbTrash size={POPUP_ICON_SIZE} />
               Delete user
            </button>
         </div>
      </div>
   );

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

   const handlePreviousPage = () => {
      if (currentPage !== 1) setCurrentPage(currentPage - 1);
   };

   const handleNextPage = () => {
      if (currentPage !== totalPages) setCurrentPage(currentPage + 1);
   };

   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

   return (
      <Layout role="admin" pageName="User Management">
         <main className={styles.mainContent}>
            <section className={styles.tableWrapper}>
               <div className={styles.tableContainer}>
                  <div className={styles.header}>
                     <h3 className={styles.label}>
                        All users <span>{users.length}</span>
                     </h3>
                     <div className={styles.tools}>
                        <SearchBar width="30rem" />
                        <button
                           type="button"
                           className={`${styles.secondaryBtn} ${styles.iconBtn}`}
                        >
                           <TbFilter size={SMALL_ICON_SIZE} />
                           Filters
                        </button>
                        <button
                           type="button"
                           className={`${styles.primaryBtn} ${styles.iconBtn}`}
                        >
                           <TbPlus size={SMALL_ICON_SIZE} />
                           Add user
                        </button>
                     </div>
                  </div>
                  <Table
                     data={users}
                     popupContent={renderPopupContent}
                     selectedUsers={selectedUsers}
                     setSelectedUsers={setSelectedUsers}
                     currentUsers={currentUsers}
                     togglePopupAction={togglePopupAction}
                     activePopup={activePopup}
                     closePopupAction={closePopupAction}
                     popupPosition={popupPosition}
                     isPopupVisible={isPopupVisible}
                  />
               </div>
               <div className={styles.pagination}>
                  <TbArrowLeft
                     className={styles.iconBtn}
                     onClick={handlePreviousPage}
                     size={16}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                     <button
                        key={index}
                        type="button"
                        className={
                           currentPage === index + 1 ? styles.active : ""
                        }
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
            </section>
         </main>
      </Layout>
   );
};

export default UserManagement;
