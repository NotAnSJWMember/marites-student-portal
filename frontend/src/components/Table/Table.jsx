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
  TbId,
  TbLetterCase,
  TbLetterCaseLower,
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
import { FormSelect } from "components/ui/Form";

const Table = ({
  data,
  headers,
  filters,
  content,
  onEdit,
  onExport,
  onDelete,
  isPopupVisible,
  setIsPopupVisible,
  ctaText,
  ctaAction,
}) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterPopupPosition, setFilterPopupPosition] = useState({ top: 0, right: 0 });
  const [showFilterSettingsPopup, setShowFilterSettingsPopup] = useState(false);
  const [filterSettingsPopupPosition, setFilterSettingsPopupPosition] = useState({
    top: 0,
    right: 0,
  });

  const [filterOptions, setFilterOptions] = useState([]);
  const [activeFilterPopup, setActiveFilterPopup] = useState(null);

  const formattedFilterOptions = filters.map((filter) => ({
    label: filter.label,
    key: filter.label.toLowerCase().replace(" ", "-"),
    attribute: filter.attribute,
  }));

  const [filterSettings, setFilterSettings] = useState(
    formattedFilterOptions.reduce((acc, filter) => {
      acc[filter.key] = {
        name: filter.key,
        setting: { value: "contains", label: "contains" },
        value: "",
      };
      return acc;
    }, {})
  );

  const [showSortPopup, setShowSortPopup] = useState(false);
  const [sortPopupPosition, setSortPopupPosition] = useState({ top: 0, right: 0 });
  const [sortOption, setSortOption] = useState(null);

  const [showActionBarPopup, setShowActionBarPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });

  const [currentPage, setCurrentPage] = useState(1);
  const [activePopup, setActivePopup] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
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

  const filterData = (data, filterSettings) => {
    if (filterOptions.length === 0) return data;

    return data.filter((item) => {
      return filterOptions.every((filterKey) => {
        const keyLabel = filterKey.label.toLowerCase().replace(" ", "-");
        const filter = filterSettings[keyLabel];
        const setting = filter?.setting?.value;
        const filterValue = filter?.value?.toLowerCase();
        const itemValue = item[filterKey.attribute].toString().toLowerCase();

        switch (setting) {
          case "is":
            return itemValue === filterValue;
          case "is-not":
            return itemValue !== filterValue;
          case "contains":
            return itemValue?.includes(filterValue);
          case "starts-with":
            return itemValue?.startsWith(filterValue);
          case "ends-with":
            return itemValue?.endsWith(filterValue);
          default:
            return true;
        }
      });
    });
  };

  const filteredData = filterData(filteredSearch, filterSettings);

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

  const sortedData = sortData(filteredData, sortOption);

  useEffect(() => {
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    if (currentPage > totalPages && currentPage !== 1) {
      setCurrentPage((prev) => prev - 1);
    }

    selectedData.length > 0 ? setShowActionBarPopup(true) : setShowActionBarPopup(false);
  }, [currentPage, selectedData.length, sortedData.length]);

  const currentData = useMemo(
    () => sortedData.slice(indexOfFirstItem, indexOfLastItem),
    [indexOfFirstItem, indexOfLastItem, sortedData]
  );

  const toggleFilterSettingsPopup = (event, option) => {
    const opt = option.label.toLowerCase().replace(" ", "-");
    const rect = event.currentTarget.getBoundingClientRect();

    setTimeout(() => {
      setActiveFilterPopup({ name: opt, ...filterSettings[opt] });
      setFilterSettingsPopupPosition({ top: rect.bottom + 5, left: rect.left });
      setShowFilterSettingsPopup(true);
    }, 100);
  };

  const closeFilterSettingsPopup = () => {
    setActiveFilterPopup(null);
    setShowFilterSettingsPopup(false);
  };

  const toggleFilterPopup = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setFilterPopupPosition({ top: rect.bottom + 5, left: rect.left });
    setShowFilterPopup((prev) => !prev);
  };

  const closeFilterPopup = () => {
    setShowFilterPopup(false);
  };

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

  const handleSelectFilterOption = (option) => {
    setFilterOptions((prevState) =>
      prevState.includes(option)
        ? prevState.filter((item) => item !== option)
        : [...prevState, option]
    );
    closeFilterSettingsPopup();
  };

  const handleFilterSettingChange = (newSetting) => {
    setFilterSettings((prevSettings) => ({
      ...prevSettings,
      [activeFilterPopup?.name]: {
        ...prevSettings[activeFilterPopup?.name],
        setting: newSetting,
      },
    }));
    setActiveFilterPopup((prevState) => ({
      ...prevState,
      setting: newSetting,
    }));
  };

  const handleFilterInputChange = (event) => {
    setFilterSettings((prevValue) => ({
      ...prevValue,
      [activeFilterPopup?.name]: {
        ...prevValue[activeFilterPopup?.name],
        value: event.target.value,
      },
    }));
    setActiveFilterPopup((prevState) => ({
      ...prevState,
      value: event.target.value,
    }));
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
                width="25rem"
              />
              <div className={styles.toolOptions}>
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
                {filterOptions && (
                  <div className={styles.filterOptionsContainer}>
                    {filterOptions.map((option) => {
                      return (
                        <button
                          key={option.attribute}
                          className={styles.filterOption}
                          data-tooltip-id="filter-options"
                          data-tooltip-content="Change filter settings"
                          onClick={(event) => toggleFilterSettingsPopup(event, option)}
                          disabled={
                            activeFilterPopup?.name ===
                              option.label.toLowerCase().replace(" ", "-") &&
                            showFilterSettingsPopup
                          }
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}
                <Tooltip
                  id="filter-options"
                  noArrow={true}
                  offset={5}
                  className={styles.tooltip}
                />
              </div>
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
                onClick={(event) => toggleFilterPopup(event)}
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

      <Popup
        show={showFilterPopup}
        close={closeFilterPopup}
        position={filterPopupPosition}
      >
        <div className={styles.filter}>
          <div className={styles.sortOptions}>
            {filters.map((option, index) => {
              const headerIcons = [
                <TbId size={IconSizes.MEDIUM} />,
                <TbUserCircle size={IconSizes.MEDIUM} />,
                <TbLetterCase size={IconSizes.MEDIUM} />,
                <TbLetterCaseLower size={IconSizes.MEDIUM} />,
              ];

              return (
                <button
                  key={option.label}
                  type="button"
                  className={`${styles.sortItem} ${
                    filterOptions.includes(option) ? styles.selected : null
                  }`}
                  onClick={() => handleSelectFilterOption(option)}
                >
                  {headerIcons[index]}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </Popup>

      <Popup
        show={showFilterSettingsPopup}
        close={closeFilterSettingsPopup}
        position={filterSettingsPopupPosition}
      >
        <div className={styles.filterSettings}>
          <p>
            <strong>Choose a setting</strong>
          </p>
          <FormSelect
            name="filter"
            options={[
              { value: "is", label: "is" },
              { value: "is-not", label: "is not" },
              { value: "contains", label: "contains" },
              { value: "starts-with", label: "starts with" },
              { value: "ends-with", label: "ends with" },
            ]}
            defaultValue="contains"
            smallPadding={true}
            selectedData={filterSettings[activeFilterPopup?.name]?.setting}
            setSelectedData={(newSetting) => {
              handleFilterSettingChange(newSetting);
            }}
          />
          <input
            placeholder="Type a value"
            value={filterSettings[activeFilterPopup?.name]?.value}
            onChange={(e) => handleFilterInputChange(e)}
          />
        </div>
      </Popup>

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
