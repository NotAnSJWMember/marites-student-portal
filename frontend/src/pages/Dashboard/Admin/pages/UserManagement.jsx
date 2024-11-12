import React from "react";
import styles from "./UserManagement.module.scss";
import { TbEdit, TbFileArrowRight, TbTrash } from "react-icons/tb";
import IconSizes from "constants/IconSizes";

import Table from "components/Table/Table";
import Layout from "components/Layout/Layout";
import UserIcon from "components/ui/UserIcon/UserIcon";
import useFetchData from "hooks/useFetchData";
import { format, formatDistanceToNow } from "date-fns";
import useDeleteData from "hooks/useDeleteData";
import PopupAlert from "components/Popup/PopupAlert";

const UserManagement = () => {
   const { data: users } = useFetchData("user");
   const { popupState, showPopup, deleteData } = useDeleteData();

   const formatDate = (isoString) => {
      return format(new Date(isoString), "MMMM d, yyyy");
   };

   const handleDeleteUser = async (userId) => {      
      if (userId)
         await deleteData("user", userId)
   }

   const headers = ["Name", "Role", "Last Seen", "Created on"];

   const renderData = (data) => {
      return (
         <>
            <div className={styles.userContainer}>
               <UserIcon image={data.userPhoto} size={48} />
               <div className={styles.userInfo}>
                  <h4
                     className={styles.title}
                  >{`${data.firstName} ${data.lastName}`}</h4>
                  <p className={styles.desc}>{data.email}</p>
               </div>
            </div>
            <p className={styles.role}>{data.role}</p>
            <p className={styles.lastActive}>
               {formatDistanceToNow(data.lastActive, { addSuffix: true })}
            </p>
            <p className={styles.createdAt}>{formatDate(data.createdAt)}</p>
         </>
      );
   };

   const renderPopupContent = (user) => (
      <div className={styles.popupWrapper}>
         <div className={styles.popupContent}>
            <button type="button" className={styles.iconCta}>
               <TbEdit size={IconSizes.POPUP} />
               Edit details
            </button>
            <button type="button" className={styles.iconCta}>
               <TbFileArrowRight size={IconSizes.POPUP} />
               Export details
            </button>
            <button
               type="button"
               className={`${styles.deleteBtn} ${styles.iconCta}`}
               onClick={() => handleDeleteUser(user.userId)}
            >
               <TbTrash size={IconSizes.POPUP} />
               Delete user
            </button>
         </div>
      </div>
   );

   return (
      <Layout role="admin" pageName="User Management">
         <main className={styles.mainContent}>
            <section className={styles.tableWrapper}>
               <div className={styles.tableContainer}>
                  <h3 className={styles.label}>
                     All users <span>{users.length}</span>
                  </h3>
                  <Table
                     data={users}
                     headers={headers}
                     content={renderData}
                     popupContent={renderPopupContent}
                     ctaText="Create user"
                  />
               </div>
            </section>
         </main>
         <PopupAlert
            icon={popupState.icon}
            border={popupState.border}
            color={popupState.color}
            title={popupState.title}
            message={popupState.message}
            show={showPopup}
         />
      </Layout>
   );
};

export default UserManagement;
