import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.scss";

import logo from "assets/images/logo.png";
import { useAuth } from "hooks";
import {
  TbBook,
  TbCalendarEvent,
  TbCertificate,
  TbChartBar,
  TbLayoutDashboardFilled,
  TbLogout,
  TbNotebook,
  TbReceipt,
  TbSettings,
  TbSpeakerphone,
  TbUser,
} from "react-icons/tb";

var ICON_SIZE = 26;

export const Sidebar = ({ role }) => {
  const [activeTab, setActiveTab] = useState("");
  const { logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const pathToTabMapping = {
      "/student/dashboard": "dashboard",
      "/student/dashboard/schedule": "schedule",
      "/student/dashboard/examboard": "examboard",
      "/student/dashboard/assignments": "assignments",
      "/student/dashboard/courses": "courses",
      "/student/dashboard/finance": "finance",
      "/student/dashboard/announcements": "announcements",

      "/admin/dashboard": "dashboard",
      "/admin/dashboard/user-management": "userManagement",
      "/admin/dashboard/academic-planner": "academicPlanner",
      "/admin/dashboard/academic-planner/courses": "academicPlanner",
      "/admin/dashboard/academic-planner/programs": "academicPlanner",
      "/admin/dashboard/academic-planner/enrollment": "academicPlanner",
      "/admin/dashboard/academic-planner/curriculums": "academicPlanner",
      "/admin/dashboard/reports": "reports",
      "/admin/dashboard/system-settings": "systemSettings",
      "/admin/dashboard/manage-notifications": "manageNotifications",
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
          <>
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
            </div>
            <div className={styles.itemContainer}>
              <h2 className={styles.itemLabel}>Academic</h2>
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
                to="/student/dashboard/assignments"
                className={styles.itemBtn}
                onClick={() => handleTabClick("assignments")}
              >
                <button
                  type="button"
                  className={activeTab === "assignments" ? styles.active : ""}
                >
                  <TbNotebook size={ICON_SIZE} />
                  Assignments
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
            <div className={styles.itemContainer}>
              <h2 className={styles.itemLabel}>Administrative</h2>
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
          </>
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
          <>
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
            </div>
            <div className={styles.itemContainer}>
              <h2 className={styles.itemLabel}>Administrative</h2>
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
                to="/admin/dashboard/academic-planner"
                className={styles.itemBtn}
                onClick={() => handleTabClick("academicPlanner")}
              >
                <button
                  type="button"
                  className={activeTab === "academicPlanner" ? styles.active : ""}
                >
                  <TbCertificate size={ICON_SIZE} />
                  Academic Planner
                </button>
              </Link>
              <Link
                to="/admin/dashboard/reports"
                className={styles.itemBtn}
                onClick={() => handleTabClick("reports")}
              >
                <button type="button" className={activeTab === "reports" ? styles.active : ""}>
                  <TbChartBar size={ICON_SIZE} />
                  Reports
                </button>
              </Link>
              <Link
                to="/admin/dashboard/system-settings"
                className={styles.itemBtn}
                onClick={() => handleTabClick("systemSettings")}
              >
                <button
                  type="button"
                  className={activeTab === "systemSettings" ? styles.active : ""}
                >
                  <TbSettings size={ICON_SIZE} />
                  System Settings
                </button>
              </Link>
              <Link
                to="/admin/dashboard/manage-notifications"
                className={styles.itemBtn}
                onClick={() => handleTabClick("manageNotifications")}
              >
                <button
                  type="button"
                  className={activeTab === "manageNotifications" ? styles.active : ""}
                >
                  <TbSpeakerphone size={ICON_SIZE} />
                  Manage Notifications
                </button>
              </Link>
            </div>
          </>
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
