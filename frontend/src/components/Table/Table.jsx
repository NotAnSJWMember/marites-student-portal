import React, { useEffect, useMemo, useState } from "react";
import styles from "./Table.module.scss";
import {
  TbArrowsUpDown,
  TbDotsVertical,
  TbEdit,
  TbFileArrowRight,
  TbFilter,
  TbPlus,
  TbTrash,
  TbX,
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
  onEdit,
  onExport,
  onDelete,
  isPopupVisible,
  setIsPopupVisible,
  ctaText,
  ctaAction,
}) => {
  const [selectedData, setSelectedData] = useState([]);
  const [showActionBarPopup, setShowActionBarPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });
  const [activePopup, setActivePopup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentData = useMemo(
    () => data.slice(indexOfFirstItem, indexOfLastItem),
    [data, indexOfFirstItem, indexOfLastItem]
  );

  const togglePopup = (userId, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setIsPopupVisible(true);
    setTimeout(() => {
      setActivePopup(userId);
      setPopupPosition({ top: rect.bottom - 40, left: rect.left - 145 });
    }, 100);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setTimeout(() => {
      setActivePopup(null);
    }, 100);
  };

  const handleCheckboxChange = (dataId) => {
    setSelectedData((prev) =>
      prev.includes(dataId) ? prev.filter((id) => id !== dataId) : [...prev, dataId]
    );
  };

  const handleSelectAll = () => {
    const allIds = currentData.map((item) => item._id);
    setSelectedData((prev) => (prev.length === currentData.length ? [] : allIds));
  };

  const handleBulkAction = (action) => {
    const selectedItems = selectedData.map((id) => data.find((item) => item._id === id));
    action(selectedItems);
    setSelectedData([]);
  };

  useEffect(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage > totalPages && currentPage !== 1) {
      setCurrentPage((prev) => prev - 1);
    }

    selectedData.length > 0 ? setShowActionBarPopup(true) : setShowActionBarPopup(false);
  }, [data, currentPage, itemsPerPage, selectedData]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.table}>
          <div className={styles.toolsContainer}>
            <SearchBar height="100%" width="30rem" />
            <div className={styles.buttonContainer}>
              <button
                type="button"
                className={`${styles.iconBtn} ${styles.secondaryBtn}`}
                onClick={() => onExport(data)}
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
                    onClick={(event) => togglePopup(data._id, event)}
                  >
                    <TbDotsVertical size={IconSizes.MEDIUM} />
                  </button>
                  {activePopup === data._id && (
                    <Popup
                      show={isPopupVisible}
                      close={closePopup}
                      position={popupPosition}
                    >
                      <div className={styles.popupWrapper}>
                        <div className={styles.popupContent}>
                          <button
                            type="button"
                            className={styles.iconCta}
                            onClick={() => onEdit(data)}
                          >
                            <TbEdit size={IconSizes.MEDIUM} />
                            Edit details
                          </button>
                          <button
                            type="button"
                            className={styles.iconCta}
                            onClick={() => onExport(data)}
                          >
                            <TbFileArrowRight size={IconSizes.MEDIUM} />
                            Export details
                          </button>
                          <button
                            type="button"
                            className={`${styles.deleteBtn} ${styles.iconCta}`}
                            onClick={() => onDelete(data)}
                          >
                            <TbTrash size={IconSizes.MEDIUM} />
                            Delete user
                          </button>
                        </div>
                      </div>
                    </Popup>
                  )}
                </div>
                {index !== currentData.length - 1 && <div className={styles.line}></div>}
              </div>
            ))}
          </div>
        </div>
        {data.length > itemsPerPage ? (
          <Pagination
            totalItems={data.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <span style={{ margin: "auto", opacity: "0.5" }}>You've reached the end..</span>
        )}
      </div>
      <Popup show={showActionBarPopup} position="bottom" handleClickOutside={false}>
        <div className={styles.actionBar}>
          <div className={`${styles.supportContent} ${styles.alignCenter}`}>
            <TbX
              size={IconSizes.SMALL}
              color="gray"
              onClick={() => setSelectedData([])}
            />
            {selectedData?.length} selected
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.ctaBtn}`}
              onClick={() => handleBulkAction(onExport)}
            >
              <TbFileArrowRight size={IconSizes.SMALL} />
              Export
            </button>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.deleteBtn}`}
              onClick={() => handleBulkAction(onDelete)}
            >
              <TbTrash size={IconSizes.SMALL} />
              Delete
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default Table;
