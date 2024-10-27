import React, { useState } from "react";
import styles from "./Header.module.scss";

import Popup from "components/Popup/Popup";
import { useAuth } from "hooks";
import SearchBar from "components/SearchBar/SearchBar";

import userIcon from "assets/images/profile.jpg";
import { TbBell, TbLogout, TbSettings, TbUser } from "react-icons/tb";

export const Header = () => {
   const [isPopupVisibleUser, setPopupVisibleUser] = useState(false);
   const [isPopupVisibleNotif, setPopupVisibleNotif] = useState(false);

   const togglePopupUser = () => {
      setPopupVisibleUser((prev) => !prev);
   };

   const togglePopupNotif = () => {
      setPopupVisibleNotif((prev) => !prev);
   };

   const closePopupUser = () => {
      setPopupVisibleUser(false);
   };

   const closePopupNotif = () => {
      setPopupVisibleNotif(false);
   };

   const { logout } = useAuth();

   return (
      <header className={styles.header}>
         <SearchBar />
         <div className={styles.sideBar}>
            <div className={styles.notif} onClick={togglePopupNotif}>
               <TbBell size={24} />
            </div>
            <div className={styles.verticalLine}></div>
            <div className={styles.userIcon} onClick={togglePopupUser}>
               <img src={userIcon} alt="Your Profile Icon" />
            </div>
         </div>
         <Popup
            show={isPopupVisibleUser}
            close={closePopupUser}
            position="user"
         >
            <div className={styles.popupWrapperUser}>
               <div className={styles.userContainer}>
                  <div className={styles.userIcon}>
                     <img src={userIcon} alt="Your Profile Icon" />
                  </div>
                  <div className={styles.userName}>
                     <h3 className={styles.name}>Caenar Arteta</h3>
                     <p className={styles.course}>BSIT - 2ND YEAR</p>
                  </div>
               </div>
               <div className={styles.popupContent}>
                  <div className={styles.line}></div>
                  <a href="a" className={styles.iconCta}>
                     <TbUser size={25} />
                     My Profile
                  </a>
                  <a href="a" className={styles.iconCta}>
                     <TbSettings size={25} />
                     Account Settings
                  </a>
                  <div className={styles.line}></div>
                  <button onClick={logout} className={styles.iconCta}>
                     <TbLogout size={25} />
                     Sign out
                  </button>
               </div>
            </div>
         </Popup>
         <Popup
            show={isPopupVisibleNotif}
            close={closePopupNotif}
            position="notif"
         >
            <div className={styles.popupWrapperNotif}>
               <div className={styles.titleContainer}>
                  <h2>Notifications</h2>
                  <p className={styles.cta}>Mark all as read</p>
               </div>
               <div className={styles.line}></div>
               <div className={styles.popupContent}>
                  <div className={styles.notifItem}>
                     <div className={styles.notifUser}>
                        <div className={styles.notifCircle}></div>
                        <p>IA</p>
                     </div>
                     <div className={styles.notifContent}>
                        <p>
                           <strong>Ivan Agripa</strong> wants to send you{" "}
                           <strong>bold</strong> for you to pass the exam.
                        </p>
                        <p className={styles.status}>Just now</p>
                     </div>
                  </div>
                  <div className={styles.notifItem}>
                     <div className={styles.notifUser}>
                        <div className={styles.notifCircle}></div>

                        <p>SB</p>
                     </div>
                     <div className={styles.notifContent}>
                        <p>
                           <strong>Sean Bronosa</strong> wanted to message you.
                        </p>
                        <p className={styles.status}>5 mins ago</p>
                     </div>
                  </div>
                  <div className={styles.notifItem}>
                     <div className={styles.notifUser}>
                        <p>JS</p>
                     </div>
                     <div className={styles.notifContent}>
                        <p>
                           <strong>Jhobby Sorsogon</strong> created a{" "}
                           <strong>pokingina</strong> for you to look at!
                        </p>
                        <p className={styles.status}>8 mins ago</p>
                     </div>
                  </div>
               </div>
            </div>
         </Popup>
      </header>
   );
};

export default Header;
