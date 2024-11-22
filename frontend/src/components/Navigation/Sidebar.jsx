import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.scss";

import logo from "assets/images/logo.png";
import { useAuth } from "hooks";
import {
  TbAddressBook,
  TbBook,
  TbCalendarEvent,
  TbCertificate,
  TbCoins,
  TbLayoutDashboardFilled,
  TbLogout,
  TbReceipt,
  TbSchool,
  TbSpeakerphone,
  TbUser,
} from "react-icons/tb";
import IconSizes from "constants/IconSizes";

const ICON_SIZE = IconSizes.LARGE;

export const Sidebar = ({ role }) => {
  const [activeTab, setActiveTab] = useState("");
  const { logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const pathToTabMapping = {
      "/student/dashboard": "dashboard",
      "/student/dashboard/schedule": "schedule",
      "/student/dashboard/examboard": "examboard",
      "/student/dashboard/courses": "courses",
      "/student/dashboard/finance": "finance",
      "/student/dashboard/announcements": "announcements",

      "/admin/dashboard": "dashboard",
      "/admin/dashboard/user-management": "userManagement",
      "/admin/dashboard/grade-management": "gradeManagement",
      "/admin/dashboard/finance-management": "financeManagement",
      "/admin/dashboard/academic-planner": "academicPlanner",
      "/admin/dashboard/academic-planner/courses": "academicPlanner",
      "/admin/dashboard/academic-planner/programs": "academicPlanner",
      "/admin/dashboard/academic-planner/enrollment": "academicPlanner",
      "/admin/dashboard/academic-planner/curriculums": "academicPlanner",
    };

    const activeRoute = pathToTabMapping[location.pathname];
    if (activeRoute) {
      setActiveTab(activeRoute);
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getNavItems = () => {
    switch (role) {
      case "student":
        return (
          <div className={styles.itemWrapper}>
            <div className={styles.sealContainer}>
              <img src={logo} alt="Dr. AMMC Seal" />
              <div className={styles.sealContainerText}>
                <h1>Aurelio Mendoza Memorial College</h1>
                <p>Student Portal</p>
              </div>
            </div>
            <div className={styles.itemContainer}>
              <Link
                to="/student/dashboard"
                className={styles.itemBtn}
                onClick={() => handleTabClick("dashboard")}
              >
                <button
                  type="button"
                  className={activeTab === "dashboard" ? styles.active : ""}
                >
                  <TbLayoutDashboardFilled size={ICON_SIZE} />
                  Dashboard
                </button>
              </Link>
              <Link
                to="/student/dashboard/schedule"
                className={styles.itemBtn}
                onClick={() => handleTabClick("schedule")}
              >
                <button
                  type="button"
                  className={activeTab === "schedule" ? styles.active : ""}
                >
                  <TbCalendarEvent size={ICON_SIZE} />
                  Schedule
                </button>
              </Link>
              <Link
                to="/student/dashboard/examboard"
                className={styles.itemBtn}
                onClick={() => handleTabClick("examboard")}
              >
                <button
                  type="button"
                  className={activeTab === "examboard" ? styles.active : ""}
                >
                  <TbBook size={ICON_SIZE} />
                  Examboard
                </button>
              </Link>
              <Link
                to="/student/dashboard/courses"
                className={styles.itemBtn}
                onClick={() => handleTabClick("courses")}
              >
                <button type="button" className={activeTab === "courses" ? styles.active : ""}>
                  <TbCertificate size={ICON_SIZE} />
                  Courses
                </button>
              </Link>
            </div>
            <div className={styles.line}></div>
            <div className={styles.itemContainer}>
              <Link
                to="/student/dashboard/finance"
                className={styles.itemBtn}
                onClick={() => handleTabClick("finance")}
              >
                <button type="button" className={activeTab === "finance" ? styles.active : ""}>
                  <TbReceipt size={ICON_SIZE} />
                  Finance
                </button>
              </Link>
              <Link
                to="/student/dashboard/announcements"
                className={styles.itemBtn}
                onClick={() => handleTabClick("announcements")}
              >
                <button
                  type="button"
                  className={activeTab === "announcements" ? styles.active : ""}
                >
                  <TbSpeakerphone size={ICON_SIZE} />
                  Announcements
                </button>
              </Link>
            </div>
          </div>
        );
      case "instructor":
        return (
          <>
            <Link to="/instructor-dashboard">Instructor Dashboard</Link>
            {/* Add more teacher nav items here */}
          </>
        );
      case "admin":
        return (
          <div className={styles.itemWrapper}>
            <div className={styles.sealContainer}>
              <img src={logo} alt="Dr. AMMC Seal" />
              <div className={styles.sealContainerText}>
                <h1>Aurelio Mendoza Memorial College</h1>
                <p>Admin Portal</p>
              </div>
            </div>
            <div className={styles.itemContainer}>
              <Link
                to="/admin/dashboard"
                className={styles.itemBtn}
                onClick={() => handleTabClick("dashboard")}
              >
                <button
                  type="button"
                  className={activeTab === "dashboard" ? styles.active : ""}
                >
                  <TbLayoutDashboardFilled size={ICON_SIZE} />
                  Dashboard
                </button>
              </Link>
              <Link
                to="/admin/dashboard/academic-planner"
                className={styles.itemBtn}
                onClick={() => handleTabClick("academicPlanner")}
              >
                <button
                  type="button"
                  className={activeTab === "academicPlanner" ? styles.active : ""}
                >
                  <TbSchool size={ICON_SIZE} />
                  Academic Planner
                </button>
              </Link>
              <Link
                to="/admin/dashboard/user-management"
                className={styles.itemBtn}
                onClick={() => handleTabClick("userManagement")}
              >
                <button
                  type="button"
                  className={activeTab === "userManagement" ? styles.active : ""}
                >
                  <TbUser size={ICON_SIZE} />
                  User Management
                </button>
              </Link>
              <Link
                to="/admin/dashboard/grade-management"
                className={styles.itemBtn}
                onClick={() => handleTabClick("gradeManagement")}
              >
                <button
                  type="button"
                  className={activeTab === "gradeManagement" ? styles.active : ""}
                >
                  <TbAddressBook size={ICON_SIZE} />
                  Grade Management
                </button>
              </Link>
              <Link
                to="/admin/dashboard/finance-management"
                className={styles.itemBtn}
                onClick={() => handleTabClick("financeManagement")}
              >
                <button
                  type="button"
                  className={activeTab === "financeManagement" ? styles.active : ""}
                >
                  <TbCoins size={ICON_SIZE} />
                  Finance Management
                </button>
              </Link>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <nav className={styles.sidebar}>
      {getNavItems()}
      <div className={styles.itemContainer}>
        <div className={styles.itemBtn}>
          <button onClick={logout} type="button">
            <TbLogout size={ICON_SIZE} />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};
