import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { HelmetProvider } from "react-helmet-async";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard/AdminDashboard";
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard/StudentDashboard";
import InstructorDashboard from "pages/Dashboard/Instructor/InstructorDashboard/InstructorDashboard";

function App() {
   return (
      <HelmetProvider>
         <Router>
            <Routes>
               <Route path="/register" element={<Register />} />
               <Route path="/login" element={<Login />} />
               <Route path="/forgot-password" element={<ForgotPassword />} />
               <Route path="/reset-password" element={<ResetPassword />} />
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
                  path="/instructor/dashboard"
                  element={
                     <PrivateRoute
                        element={<InstructorDashboard />}
                        roles={["instructor"]}
                     />
                  }
               />
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
