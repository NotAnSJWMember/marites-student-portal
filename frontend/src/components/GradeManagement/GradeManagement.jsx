import React, { useEffect, useMemo, useState } from "react";
import styles from "./GradeManagement.module.scss";
import useFetchData from "hooks/useFetchData";
import { useDataContext } from "hooks/contexts/DataContext";
import { usePopupAlert } from "hooks";
import useUpdateData from "hooks/useUpdateData";
import Loading from "components/Loading/Loading";
import Layout from "components/Layout/Layout";
import PopupAlert from "components/Popup/PopupAlert";
import { FormSelect } from "components/ui/Form";
import SearchBar from "components/SearchBar/SearchBar";
import Table from "./components/Table";
import Popup from "components/Popup/Popup";
import { UserContainer } from "components/ui/UserContainer/UserContainer";
import IconSizes from "constants/IconSizes";
import { TbId } from "react-icons/tb";
import TabMenu from "components/TabMenu/TabMenu";
import EditGrade from "./components/EditGrade";

const GradeManagement = () => {
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState({ edit: false });
  const [activePopup, setActivePopup] = useState(null);

  const [initialData, setInitialData] = useState([]);
  const [searchedFilteredData, setSearchFilteredData] = useState([]);
  const [categoryFilteredData, setCategoryFilteredData] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOption, setSelectedOption] = useState({
    course: null,
    program: null,
  });

  const { dataState: students } = useDataContext("student");
  const { dataState: courses } = useDataContext("course");
  const { dataState: programs } = useDataContext("program");
  const { data: enrollments, fetchData } = useFetchData("enrollment");

  const {
    popupState: alertState,
    showPopup: showAlertPopup,
    showError,
  } = usePopupAlert();

  const {
    popupState: updateState,
    showPopup: showUpdatePopup,
    setShowPopup: setShowUpdatePopup,
    loading: updateLoading,
    updateData,
  } = useUpdateData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (students && courses && programs && enrollments) {
      setLoading(false);
    }
  }, [students, courses, programs, enrollments]);

  const programOptions = useMemo(
    () =>
      programs.map((p) => ({
        value: p._id,
        label: p.description.replace(/Bachelor of (Science|Arts) in /, ""),
      })),
    [programs]
  );

  const courseOptions = useMemo(
    () =>
      courses.map((c) => ({
        value: c._id,
        label: c.description,
      })),
    [courses]
  );

  const getOptions = () => {
    if (selectedCategory === "all") return [];
    return selectedCategory === "course" ? courseOptions : programOptions;
  };

  useEffect(() => {
    const enrollmentsByStudentId = enrollments.reduce((acc, enrollment) => {
      if (!acc[enrollment.studentId]) {
        acc[enrollment.studentId] = [];
      }
      acc[enrollment.studentId].push(enrollment);
      return acc;
    }, {});

    const enrolledStudents = students
      .map((student) => ({
        student,
        enrollments: enrollmentsByStudentId[student.userId] || [],
      }))
      .filter((item) => item.enrollments.length > 0);

    setInitialData(enrolledStudents);

    if (selectedCategory === "all") {
      setCategoryFilteredData(enrolledStudents);
      setSearchFilteredData(enrolledStudents);
    }
  }, [enrollments, selectedCategory, students]);

  useEffect(() => {
    if (selectedCategory === "course") {
      const option = selectedOption[selectedCategory]?.value;

      const filteredData = initialData
        .map((data) => ({
          student: data.student,
          enrollments: data.enrollments.filter((e) => e.courseId === option),
        }))
        .filter((item) => item.enrollments.length > 0);

      setCategoryFilteredData(filteredData);
      setSearchFilteredData(filteredData);
    }
  }, [initialData, selectedCategory, selectedOption]);

  useEffect(() => {
    if (selectedCategory === "program") {
      const option = selectedOption[selectedCategory]?.value;

      const filteredData = initialData.filter(
        (item) => item.student.programId === option
      );

      setCategoryFilteredData(filteredData);
      setSearchFilteredData(filteredData);
    }
  }, [initialData, selectedCategory, selectedOption]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleOptionChange = (optionId) => {
    setSelectedOption((prevState) => ({
      ...prevState,
      [selectedCategory]: optionId,
    }));
  };

  const handleOnSearch = (searchQuery) => {
    const filteredData = searchQuery.map((item) => {
      const enrollments = categoryFilteredData
        .flatMap((data) => data.enrollments)
        .filter((enrollment) => enrollment.studentId === item.userId);

      return {
        student: item,
        enrollments,
      };
    });

    setSearchFilteredData(filteredData);
  };

  const handleShowEditPopup = (studentId) => {
    const student = searchedFilteredData.find(
      (item) => item.student.userId === studentId
    );
    setTimeout(() => {
      setShowPopup({ edit: true });
      if (student) {
        setActivePopup(student);
      }
    }, 150);
  };

  const closeEditPopup = () => {
    setShowPopup({ edit: false });
    setTimeout(() => {
      setActivePopup(null);
    }, 150);
  };

  const handleSavedGrades = async (data) => {
    const enrollmentsToUpdate = data.map((e) => ({
      _id: e._id,
      grades: {
        prelim: e.prelim,
        midterm: e.midterm,
        prefinal: e.prefinal,
        final: e.final,
      },
    }));

    const body = { enrollments: enrollmentsToUpdate };
    const response = await updateData(body, `enrollment/update-grades`, null, fetchData);
    closeEditPopup();
    if (response.ok) {
      setShowUpdatePopup(true);
    }
  };

  return (
    <Layout role="admin" pageName="Grade Management">
      {!loading ? (
        <div className={styles.contentDivider}>
          <main className={styles.mainContent}>
            <section className={styles.editContainer}>
              <div className={styles.spaceBetween}>
                <h2>Grade Management</h2>
                <div className={styles.buttonContainer}>
                  <p>
                    <strong>Category:</strong>
                  </p>
                  {["all", "course", "program"].map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`${styles.secondaryBtn} ${
                        selectedCategory === category ? styles.active : ""
                      }`}
                      onClick={() => handleSelectCategory(category)}
                      disabled={selectedCategory === category}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                  <FormSelect
                    name={selectedCategory}
                    options={getOptions()}
                    height="20rem"
                    width="17rem"
                    selectedData={
                      selectedCategory === "all"
                        ? null
                        : selectedCategory === "course"
                        ? selectedOption.course
                        : selectedOption.program
                    }
                    setSelectedData={handleOptionChange}
                    disabled={selectedCategory === "all"}
                    searchBar={true}
                  />
                </div>
              </div>
              <SearchBar
                data={categoryFilteredData.map((d) => d.student)}
                onSearch={handleOnSearch}
                height={45}
                placeholder="Search for students"
              />
              <Table
                data={searchedFilteredData}
                programs={programs}
                handleOpenPopup={handleShowEditPopup}
                selectedCategory={selectedCategory}
                selectedOption={selectedOption}
                showError={showError}
              />
            </section>
          </main>
          <aside className={styles.sideContent}>
            <section className={styles.requestsContainer}>
              <div>
                <h3 className={styles.title}>Requests</h3>
                <p className={styles.desc}>
                  Manage requests for grade changes submitted by instructors.
                </p>
              </div>
              <ul>
                <li>Request #1: Change grade for John Doe in Course A (Pending)</li>
              </ul>
            </section>
            <section className={styles.guidelinesContainer}>
              <h3 className={styles.title}>Guidelines</h3>
              <ol>
                <li>Always double-check the student ID before making changes.</li>
                <li>Ensure grades are updated within the allowed timeframe.</li>
                <li>Submit grade changes for approval when required.</li>
              </ol>
            </section>
          </aside>
        </div>
      ) : (
        <Loading />
      )}

      <Popup show={showPopup.edit} close={closeEditPopup} position="center">
        {activePopup && (
          <div className={styles.popupWrapper}>
            <div className={styles.studentInfo}>
              <UserContainer user={activePopup.student} size={70} />
              <div className={styles.iconBadge}>
                <TbId size={IconSizes.SMALL} />
                <p>{activePopup.student.userId}</p>
              </div>
            </div>
            <div className={styles.contentContainer}>
              <TabMenu
                tabs={[
                  {
                    label: "1st Semester",
                    content: (
                      <EditGrade
                        data={activePopup.enrollments.filter((e) => e.semester === 1)}
                        courses={courses}
                        updateLoading={updateLoading}
                        handleSavedGrades={handleSavedGrades}
                        handleClosePopup={closeEditPopup}
                        showError={showError}
                      />
                    ),
                  },
                  {
                    label: "2nd Semester",
                    content: (
                      <EditGrade
                        data={activePopup.enrollments.filter((e) => e.semester === 2)}
                        courses={courses}
                        updateLoading={updateLoading}
                        handleSavedGrades={handleSavedGrades}
                        handleClosePopup={closeEditPopup}
                        showError={showError}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </div>
        )}
      </Popup>

      <PopupAlert
        icon={updateState.icon}
        title={updateState.title}
        message={updateState.message}
        color={updateState.color}
        border={updateState.border}
        show={showUpdatePopup}
      />

      <PopupAlert
        icon={alertState.icon}
        title={alertState.title}
        message={alertState.message}
        color={alertState.color}
        border={alertState.border}
        show={showAlertPopup}
      />
    </Layout>
  );
};

export default GradeManagement;
