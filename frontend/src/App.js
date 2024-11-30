import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import PrivateRoute from "./components/PrivateRoute";
import ErrorPage from "pages/ErrorPage/ErrorPage";

import Home from "pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";
import InstructorDashboard from "./pages/Dashboard/Instructor/InstructorDashboard";

import Enrollment from "pages/Dashboard/Admin/pages/Enrollment";
import Curriculum from "pages/Dashboard/Admin/pages/Curriculum";
import AcademicPlanner from "pages/Dashboard/Admin/pages/AcademicPlanner";
import GradeManagement from "components/GradeManagement/GradeManagement";
import UserManagement from "./pages/Dashboard/Admin/pages/UserManagement";
import Courses from "pages/Dashboard/Student/pages/Courses";
import Schedule from "pages/Dashboard/Student/pages/Schedule";
import Finance from "pages/Dashboard/Student/pages/Finance";
import Examboard from "pages/Dashboard/Student/pages/Examboard";
import Announcements from "pages/Dashboard/Student/pages/Announcements";

import "./App.scss";


function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={<PrivateRoute element={<AdminDashboard />} roles={["admin"]} />}
          />
          <Route
            path="/admin/dashboard/grade-management"
            element={<PrivateRoute element={<GradeManagement />} roles={["admin"]} />}
          />
          <Route
            path="/admin/dashboard/user-management"
            element={<PrivateRoute element={<UserManagement />} roles={["admin"]} />}
          />
          <Route
            path="/admin/dashboard/academic-planner"
            element={<PrivateRoute element={<AcademicPlanner />} roles={["admin"]} />}
          />
          <Route
            path="/admin/dashboard/academic-planner/enrollment"
            element={<PrivateRoute element={<Enrollment />} roles={["admin"]} />}
          />
          <Route
            path="/admin/dashboard/academic-planner/curriculums"
            element={<PrivateRoute element={<Curriculum />} roles={["admin"]} />}
          />

          {/* Instructor Routes */}
          <Route
            path="/instructor/dashboard"
            element={
              <PrivateRoute
                element={<InstructorDashboard />}
                roles={["instructor", "admin"]}
              />
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute element={<StudentDashboard />} roles={["student", "admin"]} />
            }
          />
          <Route
            path="/student/dashboard/announcements"
            element={<PrivateRoute element={<Announcements />} roles={["student", "admin"]} />}
          />
          <Route
            path="/student/dashboard/examboard"
            element={<PrivateRoute element={<Examboard />} roles={["student", "admin"]} />}
          />
          <Route
            path="/student/dashboard/schedule"
            element={<PrivateRoute element={<Schedule />} roles={["student", "admin"]} />}
          />
          <Route
            path="/student/dashboard/finance"
            element={<PrivateRoute element={<Finance />} roles={["student", "admin"]} />}
          />
          <Route
            path="/student/dashboard/courses"
            element={<PrivateRoute element={<Courses />} roles={["student", "admin"]} />}
          />

          {/* Error Routes */}
          <Route path="/not-found" element={<ErrorPage errorCode={404} />} />
          <Route path="/unauthorized" element={<ErrorPage errorCode={401} />} />
          <Route path="/forbidden" element={<ErrorPage errorCode={403} />} />
          <Route path="/server-error" element={<ErrorPage errorCode={500} />} />

          {/* Default fallback page */}
          <Route path="*" element={<ErrorPage errorCode={404} />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
