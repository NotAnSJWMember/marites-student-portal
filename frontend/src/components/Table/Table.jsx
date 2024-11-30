import React, { useEffect, useMemo, useState } from "react";
import styles from "./Table.module.scss";
import {
  TbArrowDown,
  TbArrowsUpDown,
  TbArrowUp,
  TbClockCheck,
  TbClockQuestion,
  TbDotsVertical,
  TbEdit,
  TbFileArrowRight,
  TbFilter,
  TbLetterCase,
  TbPlus,
  TbTrash,
  TbUserCircle,
  TbX,
} from "react-icons/tb";
import IconSizes from "constants/IconSizes";

import Checkbox from "components/ui/Checkbox/Checkbox";
import Popup from "components/Popup/Popup";
import SearchBar from "components/SearchBar/SearchBar";
import Pagination from "components/Navigation/Pagination";
import { Tooltip } from "react-tooltip";

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
  const [showSortPopup, setShowSortPopup] = useState(false);
  const [sortPopupPosition, setSortPopupPosition] = useState({ top: 0, right: 0 });
  const [showActionBarPopup, setShowActionBarPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });
  const [selectedData, setSelectedData] = useState([]);
  const [activePopup, setActivePopup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState(null);
  const [filteredSearch, setFilteredSearch] = useState(data);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortOptionLabels = headers.flatMap((header) => [
    {
      option: header.label.toLowerCase().replace(" ", "-") + "-asc",
      icon: <TbArrowUp size={IconSizes.SMALL} />,
      label: `Sort by ${header.label}`,
    },
    {
      option: header.label.toLowerCase().replace(" ", "-") + "-desc",
      icon: <TbArrowDown size={IconSizes.SMALL} />,
      label: `Sort by ${header.label}`,
    },
  ]);

  const icon = sortOptionLabels.find((item) => item.option === sortOption)?.icon;
  const label = sortOptionLabels.find((item) => item.option === sortOption)?.label;

  const sortData = (data, option) => {
    if (!option) return data;

    const sorted = [...data];

    const [label, direction] = option.split(/-(?=[^-]+$)/);
    const header = headers.find((h) => h.label.toLowerCase().replace(" ", "-") === label);

    if (!header) return data;

    const { attribute } = header;

    sorted.sort((a, b) => {
      if (attribute === "lastActive" || attribute === "createdAt") {
        return direction === "asc"
          ? new Date(b[attribute]) - new Date(a[attribute])
          : new Date(a[attribute]) - new Date(b[attribute]);
      } else {
        return direction === "asc"
          ? a[attribute].localeCompare(b[attribute])
          : b[attribute].localeCompare(a[attribute]);
      }
    });

    return sorted;
  };

  const sortedData = sortData(filteredSearch, sortOption);

  useEffect(() => {
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    if (currentPage > totalPages && currentPage !== 1) {
      setCurrentPage((prev) => prev - 1);
    }

    selectedData.length > 0 ? setShowActionBarPopup(true) : setShowActionBarPopup(false);
  }, [data, currentPage, itemsPerPage, selectedData, sortedData.length]);

  const currentData = useMemo(
    () => sortedData.slice(indexOfFirstItem, indexOfLastItem),
    [indexOfFirstItem, indexOfLastItem, sortedData]
  );

  const toggleSortPopup = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSortPopupPosition({ top: rect.bottom + 5, left: rect.left });
    setShowSortPopup((prev) => !prev);
  };

  const closeSortPopup = () => {
    setShowSortPopup(false);
  };

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

  const handleSelectSortOption = (option) => {
    setSortOption((prevOption) => (prevOption === option ? null : option));
  };

  const handleChangeSortDirection = (option) => {
    let [label, direction] = option.split(/-(?=[^-]+$)/);
    direction = direction === "asc" ? "desc" : "asc";
    const changedOption = `${label}-${direction}`;
    setSortOption(changedOption);
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

  const handleExportBulkAction = () => {
    const selectedItems = selectedData.map((id) => data.find((item) => item._id === id));
    onExport(selectedItems);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.table}>
          <div className={styles.toolsContainer}>
            <div className={styles.searchContainer}>
              <SearchBar
                data={data}
                onSearch={setFilteredSearch}
                height="100%"
                width="30rem"
              />
              {sortOption && (
                <button
                  type="button"
                  data-tooltip-id="sort-option"
                  data-tooltip-content="Change direction"
                  className={styles.sortOption}
                  onClick={() => handleChangeSortDirection(sortOption)}
                >
                  {icon}
                  {label}
                </button>
              )}
            </div>
            <Tooltip
              id="sort-option"
              noArrow={true}
              offset={5}
              className={styles.tooltip}
            />
            <div className={styles.buttonContainer}>
              <button
                type="button"
                data-tooltip-id="export-button"
                data-tooltip-content="Export all table data"
                className={`${styles.iconBtn} ${styles.secondaryBtn}`}
                onClick={() => onExport(data)}
              >
                <TbFileArrowRight size={IconSizes.SMALL} />
                Export
              </button>
              <Tooltip
                id="export-button"
                noArrow={true}
                offset={5}
                className={styles.tooltip}
              />
              <button
                type="button"
                data-tooltip-id="filter-button"
                data-tooltip-content="Filter keywords"
                className={`${styles.iconBtn} ${styles.secondaryBtn}`}
              >
                <TbFilter size={IconSizes.SMALL} />
                Filter
              </button>
              <Tooltip
                id="filter-button"
                noArrow={true}
                offset={5}
                className={styles.tooltip}
              />
              <button
                type="button"
                data-tooltip-id="sort-by-button"
                data-tooltip-content="Sort by headers"
                className={`${styles.iconBtn} ${styles.secondaryBtn}`}
                onClick={(event) => toggleSortPopup(event)}
              >
                <TbArrowsUpDown size={IconSizes.SMALL} />
                Sort
              </button>
              <Tooltip
                id="sort-by-button"
                noArrow={true}
                offset={5}
                className={styles.tooltip}
              />
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
                isChecked={
                  selectedData.length === currentData.length && selectedData.length !== 0
                }
                onChange={handleSelectAll}
              />
              {headers.map((header, index) => {
                return <h4 key={`header-${index}`}>{header.label}</h4>;
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

      <Popup show={showSortPopup} close={closeSortPopup} position={sortPopupPosition}>
        <div className={styles.sortBy}>
          <div className={styles.sortOptions}>
            {headers.map((header, index) => {
              const headerIcons = [
                <TbLetterCase size={IconSizes.MEDIUM} />,
                <TbUserCircle size={IconSizes.MEDIUM} />,
                <TbClockQuestion size={IconSizes.MEDIUM} />,
                <TbClockCheck size={IconSizes.MEDIUM} />,
              ];

              const headerOption = header.label.toLowerCase().replace(" ", "-");

              return (
                <button
                  key={header.label}
                  type="button"
                  className={`${styles.sortItem} ${
                    sortOption === `${headerOption}-asc` ||
                    sortOption === `${headerOption}-desc`
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => handleSelectSortOption(`${headerOption}-asc`)}
                >
                  {headerIcons[index]}
                  {header.label}
                </button>
              );
            })}
          </div>
        </div>
      </Popup>

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
              onClick={() => handleExportBulkAction()}
            >
              <TbFileArrowRight size={IconSizes.SMALL} />
              Export
            </button>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.deleteBtn}`}
              onClick={() => onDelete(selectedData)}
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
