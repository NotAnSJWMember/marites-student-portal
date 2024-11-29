import React, { useEffect, useMemo, useState } from "react";
import styles from "./Table.module.scss";
import {
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
import Pagination from "components/Navigation/Pagination";

const Table = ({
  data,
  headers,
  content,
  isPopupVisible,
  setIsPopupVisible,
  popupContent,
  ctaText,
  ctaAction,
}) => {
  const [activePopup, setActivePopup] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });
  const [selectedData, setSelectedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = useMemo(() => {
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [data, indexOfFirstItem, indexOfLastItem]);

  const togglePopupAction = (userId, event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setIsPopupVisible(true);

    setTimeout(() => {
      setActivePopup(userId);
      setPopupPosition({ top: rect.bottom - 40, left: rect.left - 150 });
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

  useEffect(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage > totalPages && currentPage !== 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [data, currentPage, itemsPerPage]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.table}>
        <div className={styles.toolsContainer}>
          <SearchBar height="100%" width="30rem" />
          <div className={styles.buttonContainer}>
            <button type="button" className={`${styles.iconBtn} ${styles.secondaryBtn}`}>
              <TbFileArrowRight size={IconSizes.SMALL} />
              Export
            </button>
            <button type="button" className={`${styles.iconBtn} ${styles.secondaryBtn}`}>
              <TbFilter size={IconSizes.SMALL} />
              Filter
            </button>
            <button type="button" className={`${styles.iconBtn} ${styles.secondaryBtn}`}>
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
        <div className={styles.tableWrapper}>
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
              {index !== currentData.length - 1 && <div className={styles.line}></div>}
            </div>
          ))}
        </div>
      </div>
      {data.length > itemsPerPage && (
        <Pagination
          totalItems={data.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Table;
