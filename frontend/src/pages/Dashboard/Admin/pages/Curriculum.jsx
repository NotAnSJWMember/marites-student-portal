import React, { useState } from "react";
import styles from "./Curriculum.module.scss";
import { TbCircleCheckFilled, TbEdit, TbPlus } from "react-icons/tb";

import Layout from "components/Layout/Layout";
import Loading from "components/Loading/Loading";
import CourseTable from "./components/CourseTable/CourseTable";
import ManageCurriculum from "./components/ManageCurriculum/ManageCurriculum";
import PopupAlert from "components/Popup/PopupAlert";
import Breadcrumb from "components/Navigation/Breadcrumb";
import { MessageWarning } from "components/ui/Message/MessageWarning";

import { usePopupAlert } from "hooks";
import useFetchData from "hooks/useFetchData";

const Curriculum = () => {
  const [state, setState] = useState({
    currentStep: 1,
    successType: null,
    selectedProgram: null,
    programData: null,
    curriculumData: [],
  });

  const updateState = (key, value) => setState((prev) => ({ ...prev, [key]: value }));

  const { data: programs } = useFetchData("program");
  const { data: curriculums } = useFetchData("curriculum");
  const { data: courses } = useFetchData("course");
  const { data: users } = useFetchData("user");

  const { popupState, showPopup, setShowPopup, showError } = usePopupAlert();

  const pageLabels = {
    create: "Create Curriculum",
    edit: "Edit Curriculum",
  };

  const steps = [
    "Select a Program",
    state.programData?.description || "",
    pageLabels[state.currentMode],
    "Success",
  ];

  const handleSelectProgram = (program) => {
    const programCurriculums = curriculums.filter(
      (curriculum) => curriculum.programId === program._id
    );

    const isSameProgram = state.selectedProgram === program;
    updateState("selectedProgram", isSameProgram ? null : program);
    updateState("programData", isSameProgram ? null : program);
    updateState("curriculumData", isSameProgram ? [] : programCurriculums);
    updateState("currentMode", programCurriculums.length ? "base" : "create");
  };

  const handleNextStep = () => {
    if (!state.selectedProgram) {
      setShowPopup(true);
      showError("No program selected", "Please select a program from the list.");
      return;
    }
    updateState(
      "currentStep",
      state.currentStep === 1 && state.currentMode === "create" ? 3 : state.currentStep + 1
    );
  };

  const handlePreviousStep = () => {
    if (state.curriculumData?.length !== 0) {
      updateState("currentMode", "base");
      updateState("currentStep", state.currentStep - 1);
    } else {
      updateState("currentStep", 1);
    }
  };

  const handleSuccess = (type) => {
    updateState("successType", type);
    handleNextStep();
  };

  const handleSuccessBack = () => {
    updateState("currentMode", "base");
    updateState("currentStep", 2);
  };

  const handleSetMode = (mode) => {
    updateState("currentMode", mode);
    handleNextStep();
  };

  const YearCard = ({ yearIndex }) => (
    <div className={styles.curriculumCard}>
      <div className={styles.yearInfo}>
        <p className={styles.badge}>
          {["First Year", "Second Year", "Third Year", "Fourth Year", "Fifth Year"][yearIndex]}
        </p>
        <p className={styles.yearDescription}>
          {
            [
              "Introduction to foundational subjects and core principles.",
              "Building on fundamentals with intermediate coursework.",
              "Advanced topics and specialized courses.",
              "Practical experience, research, and capstone projects.",
              "Finalizing expertise and preparing for graduation.",
            ][yearIndex]
          }
        </p>
      </div>
    </div>
  );

  const CurriculumSection = ({ title, desc, data }) => (
    <>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.desc}>{desc}</p>
      <CourseTable curriculumData={data} courses={courses} users={users} />
    </>
  );

  return (
    <Layout role="admin" pageName="Curriculum">
      <main className={styles.mainContent}>
        <Breadcrumb
          base="academic-planner"
          steps={steps}
          handlePreviousStep={handlePreviousStep}
          setCurrentStep={(step) => updateState("currentStep", step)}
          currentStep={state.currentStep}
        />
        <h1>{steps[state.currentStep - 1]}</h1>
        <section className={styles.wrapper}>
          {state.currentStep === 1 && (
            <>
              <div className={styles.selectProgram}>
                <div className={styles.programsList}>
                  {programs.map((program) => (
                    <div
                      className={`${styles.programCard} ${
                        state.selectedProgram?.code === program?.code ? styles.active : ""
                      }`}
                      onClick={() => handleSelectProgram(program)}
                      key={program.code}
                    >
                      <h3>{program.description}</h3>
                      <p className={styles.badge}>{program.code}</p>
                    </div>
                  ))}
                </div>
              </div>
              {!state.curriculumData.length && state.selectedProgram && (
                <MessageWarning
                  title="This program does not have a curriculum!"
                  message="Create one by proceeding to the next step."
                />
              )}
              <button
                onClick={handleNextStep}
                className={`${styles.primaryBtn} ${styles.ctaBtn}`}
              >
                Next step
              </button>
            </>
          )}
          {state.currentStep === 2 && state.currentMode === "base" && (
            <div className={styles.editWrapper}>
              <div className={styles.spaceBetween}>
                <h2 className={styles.title}>Overview</h2>
                <div className={styles.buttonContainer}>
                  <button
                    onClick={() => handleSetMode("create")}
                    className={`${styles.iconBtn} ${styles.primaryBtn}`}
                  >
                    <TbPlus size={20} /> Create curriculum
                  </button>
                  <button
                    onClick={() => handleSetMode("edit")}
                    className={`${styles.iconBtn} ${styles.secondaryBtn}`}
                  >
                    <TbEdit size={20} /> Edit curriculum
                  </button>
                </div>
              </div>
              <div className={styles.summaryContainer}>
                {Array.from({ length: state.programData.duration }, (_, index) => (
                  <YearCard key={index} yearIndex={index} />
                ))}
              </div>
              <div className={styles.editContainer}>
                {state.curriculumData.map((curriculum) =>
                  [
                    {
                      title: "Core courses",
                      desc: "Mandatory courses essential to the field.",
                      data: curriculum.coreCourses,
                    },
                    {
                      title: "Elective courses",
                      desc: "Courses for exploring additional interests.",
                      data: curriculum.electiveCourses,
                    },
                  ].map((section, index) => <CurriculumSection key={index} {...section} />)
                )}
              </div>
            </div>
          )}
          {state.currentStep === 3 && (
            <ManageCurriculum
              courses={courses}
              programData={state.programData}
              curriculumData={state.curriculumData}
              selectedProgram={state.selectedProgram}
              handlePreviousStep={handlePreviousStep}
              handleSuccess={handleSuccess}
              currentMode={state.currentMode}
            />
          )}
          {state.currentStep === 4 && (
            <div className={styles.success}>
              <div className={styles.content}>
                <TbCircleCheckFilled color="green" size={100} />
                <h2 className={styles.title}>
                  {state.successType === "create"
                    ? "Curriculum created successfully!"
                    : "Curriculum edited successfully!"}
                </h2>
                <p className={styles.desc}>
                  {state.successType === "create"
                    ? "Head back to the initial page to create or edit another program’s curriculum."
                    : "Head back to the initial page to make further edits or create new curriculums."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSuccessBack()}
                className={styles.primaryBtn}
              >
                Back to Overview
              </button>
            </div>
          )}
        </section>
      </main>
      <PopupAlert
        icon={popupState.icon}
        border={popupState.border}
        color={popupState.color}
        title={popupState.title}
        message={popupState.message}
        show={showPopup}
      />
    </Layout>
  );
};

export default Curriculum;
