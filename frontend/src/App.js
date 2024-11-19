import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import PrivateRoute from "./components/PrivateRoute";
import ErrorPage from "pages/ErrorPage/ErrorPage";

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
import UserManagement from "./pages/Dashboard/Admin/pages/UserManagement";
import Courses from "pages/Dashboard/Student/pages/Courses";

import "./App.scss";

function App() {
  return (
    <HelmetProvider>
        <Router>
          <Routes>
            {/* Main Routes */}
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
                <PrivateRoute element={<InstructorDashboard />} roles={["instructor"]} />
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={<PrivateRoute element={<StudentDashboard />} roles={["student"]} />}
            />

            <Route
              path="/student/dashboard/courses"
              element={<PrivateRoute element={<Courses />} roles={["student"]} />}
            />

            {/* Error Routes */}
            <Route path="/404" element={<ErrorPage errorCode={404} />} />
            <Route path="/unauthorized" element={<ErrorPage errorCode={401} />} />
            <Route path="/forbidden" element={<ErrorPage errorCode={403} />} />
            <Route path="/500" element={<ErrorPage errorCode={500} />} />

            {/* Default fallback page */}
            <Route path="*" element={<ErrorPage errorCode={404} />} />
          </Routes>
        </Router>
    </HelmetProvider>
  );
}

export default App;
