import React from "react";
import styles from "./Header.module.scss";

import SearchBar from "components/SearchBar/SearchBar";
import { TbBell, TbSettings } from "react-icons/tb";

import userIcon from "assets/images/profile.jpg"

export const Header = () => {
   return (
      <header className={styles.header}>
         <SearchBar></SearchBar>
         <div className={styles.sideBar}>
            <div className={styles.notif}>
               <TbBell size={24}/>
            </div>
            <div className={styles.settings}>
               <TbSettings size={24}/>
            </div>
            <div className={styles.userIcon}>
               <img src={userIcon} alt="Your Profile Icon" />
            </div>
         </div>
      </header>
   );
};

export default Header;
