import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./App.scss";

import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import UserManagement from "./pages/Dashboard/Admin/pages/UserManagement";
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";
import InstructorDashboard from "./pages/Dashboard/Instructor/InstructorDashboard";
import AcademicPlanner from "pages/Dashboard/Admin/pages/AcademicPlanner";
import Curriculum from "pages/Dashboard/Admin/pages/Curriculum";
import Enrollment from "pages/Dashboard/Admin/pages/Enrollment";

function App() {
   return (
      <HelmetProvider>
         <Router>
            <Routes>
               <Route path="/register" element={<Register />} />
               <Route path="/login" element={<Login />} />
               <Route path="/forgot-password" element={<ForgotPassword />} />
               <Route path="/reset-password" element={<ResetPassword />} />

               {/* Admin Routes */}
               <Route
                  path="/admin/dashboard"
                  element={
                     <PrivateRoute
                        element={<AdminDashboard />}
                        roles={["admin"]}
                     />
                  }
               />
               <Route
                  path="/admin/dashboard/user-management"
                  element={
                     <PrivateRoute
                        element={<UserManagement />}
                        roles={["admin"]}
                     />
                  }
               />
               <Route
                  path="/admin/dashboard/academic-planner"
                  element={
                     <PrivateRoute
                        element={<AcademicPlanner />}
                        roles={["admin"]}
                     />
                  }
               />

               <Route
                  path="/admin/dashboard/academic-planner/enrollment"
                  element={
                     <PrivateRoute element={<Enrollment />} roles={["admin"]} />
                  }
               />

               <Route
                  path="/admin/dashboard/academic-planner/curriculums"
                  element={
                     <PrivateRoute element={<Curriculum />} roles={["admin"]} />
                  }
               />

               {/* Instructor Routes */}
               <Route
                  path="/instructor/dashboard"
                  element={
                     <PrivateRoute
                        element={<InstructorDashboard />}
                        roles={["instructor"]}
                     />
                  }
               />

               {/* Student Routes */}
               <Route
                  path="/student/dashboard"
                  element={
                     <PrivateRoute
                        element={<StudentDashboard />}
                        roles={["student"]}
                     />
                  }
               />
            </Routes>
         </Router>
      </HelmetProvider>
   );
}

export default App;
