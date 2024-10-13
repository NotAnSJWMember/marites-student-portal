import React, { useState } from "react";
import styles from "./SearchBar.module.scss";

import { TbSearch } from "react-icons/tb";

const SearchBar = () => {
   const [searchTerm, setSearchTerm] = useState("");

   const handleSearch = () => {
      console.log(searchTerm);
   };

   return (
      <div className={styles.searchBar}>
         <TbSearch size={20} />
         <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
               if (e.key === "Enter") {
                  handleSearch();
               }
            }}
         />
      </div>
   );
};

export default SearchBar;
