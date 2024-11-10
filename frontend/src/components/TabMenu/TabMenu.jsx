import React, { useState, useRef, useEffect } from "react";
import styles from "./TabMenu.module.scss";

const TabMenu = ({ tabs }) => {
   const [activeTab, setActiveTab] = useState(0);
   const tabRefs = useRef([]);
   const [indicatorStyle, setIndicatorStyle] = useState({});

   useEffect(() => {
      const tab = tabRefs.current[activeTab];
      if (tab) {
         const { offsetLeft, offsetWidth } = tab;
         setIndicatorStyle({
            left: `${(offsetLeft / tab.offsetParent.offsetWidth) * 100}%`,
            width: `${(offsetWidth / tab.offsetParent.offsetWidth) * 100}%`,
         });
      }
   }, [activeTab]);

   return (
      <div className={styles.tabMenu}>
         <div className={styles.tabList}>
            {tabs.map((tab, index) => (
               <button
                  key={index}
                  ref={(el) => (tabRefs.current[index] = el)}
                  className={`${styles.tab} ${
                     activeTab === index ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab(index)}
               >
                  {tab.label}
               </button>
            ))}
         </div>
         <div className={styles.activeIndicator} style={indicatorStyle} />
         <div className={styles.tabContent}>{tabs[activeTab]?.content}</div>
      </div>
   );
};

export default TabMenu;
