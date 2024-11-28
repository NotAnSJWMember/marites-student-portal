import React, { useMemo, useState } from "react";
import styles from "./UserTable.module.scss";
import Pagination from "components/Navigation/Pagination";

const UserTable = ({ data, headers, content, isClickable = false, clickableAction }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 7;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = useMemo(() => {
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [data, indexOfFirstItem, indexOfLastItem]);

  return (
    <div className={styles.table}>
      <div className={styles.content}>
        <div className={styles.tableHeader}>
          {headers.map((header, index) => {
            return <h4 key={`header-${index}`}>{header}</h4>;
          })}
        </div>
        {currentData.map((data, index) => (
          <div key={data._id}>
            <div
              className={styles.tableItem}
              style={isClickable ? { cursor: "pointer" } : null}
              onClick={() => clickableAction(data)}
            >
              {content(data)}
            </div>
            {index !== currentData.length - 1 && <div className={styles.line}></div>}
          </div>
        ))}
      </div>
      <Pagination
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default UserTable;
