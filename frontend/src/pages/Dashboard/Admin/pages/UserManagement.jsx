import React from "react";
import styles from "./UserManagement.module.scss";
import { TbEdit, TbFileArrowRight, TbTrash } from "react-icons/tb";
import IconSizes from "constants/IconSizes";

import Table from "components/Table/Table";
import Layout from "components/Layout/Layout";
import UserIcon from "components/ui/UserIcon/UserIcon";
import useFetchData from "hooks/useFetchData";
import { format, formatDistanceToNow } from "date-fns";

const UserManagement = () => {
   const { data: users } = useFetchData("user");

   const formatDate = (isoString) => {
      return format(new Date(isoString), "MMMM d, yyyy");
   };

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
      </Layout>
   );
};

export default UserManagement;
