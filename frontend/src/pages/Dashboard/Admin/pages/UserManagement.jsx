import React, { useRef, useState } from "react";
import Layout from "components/Layout/Layout";
import SearchBar from "components/SearchBar/SearchBar";
import Popup from "components/Popup/Popup";
import Checkbox from "components/ui/Checkbox/Checkbox";
import Loading from "components/Loading/Loading";
import { format } from "date-fns";
import styles from "./UserManagement.module.scss";
import userIcon from "assets/images/profile.jpg";
import {
   TbDotsVertical,
   TbEdit,
   TbFileArrowRight,
   TbFilter,
   TbPlus,
   TbTrash,
} from "react-icons/tb";
import { usePopupAlert } from "hooks";
import { FormUser } from "components/Forms/FormUser";
import useFetchData from "hooks/useFetchData";
import { FormStudent } from "components/Forms/FormStudent";
import UserIcon from "components/ui/UserIcon/UserIcon";
import studentIcon from "assets/icons/student.svg";
import instructorIcon from "assets/icons/instructor.svg";
import adminIcon from "assets/icons/admin.svg";

const POPUP_ICON_SIZE = 25;
const LARGE_ICON_SIZE = 70;
const MEDIUM_ICON_SIZE = 22;
const SMALL_ICON_SIZE = 19;

const UserManagement = () => {
   const timeoutId = useRef(null);

   const [activePopup, setActivePopup] = useState(null);
   const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });

   const [isPopupVisible, setIsPopupVisible] = useState(false);
   const [isPopupCenterVisible, setIsPopupCenterVisible] = useState(false);

   const [selectedUsers, setSelectedUsers] = useState([]);
   const [selectedRole, setSelectedRole] = useState(null);
   
   const [currentPage, setCurrentPage] = useState(1);
   const [currentStep, setCurrentStep] = useState(1);

   const token = localStorage.getItem("token");
   const usersPerPage = 8;

   const { showError } = usePopupAlert();
   const { data: users, loading, error } = useFetchData("user", token);

   const totalPages = Math.ceil(users.length / usersPerPage);
   const indexOfLastUser = currentPage * usersPerPage;
   const indexOfFirstUser = indexOfLastUser - usersPerPage;
   const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

   const togglePopupAction = (userId, event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      setPopupPosition({ top: rect.bottom + 10, left: rect.left - 210 });
      if (activePopup === userId) {
         closePopupAction();
      } else {
         setActivePopup(userId);
         setIsPopupVisible(true);
      }
   };
   const closePopupAction = () => {
      clearTimeout(timeoutId.current);
      setIsPopupVisible(false);

      timeoutId.current = setTimeout(() => {
         setActivePopup(null);
      }, 300);
   };

   const togglePopupCenter = () => setIsPopupCenterVisible((prev) => !prev);
   const closePopupCenter = () => {
      setIsPopupCenterVisible(false);
      setCurrentStep(1);
   };

   const handleCheckboxChange = (userId) => {
      if (selectedUsers.includes(userId)) {
         setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      } else {
         setSelectedUsers([...selectedUsers, userId]);
      }
   };
   const handleSelectAll = () => {
      if (selectedUsers.length === currentUsers.length) {
         setSelectedUsers([]);
      } else {
         setSelectedUsers(currentUsers.map((user) => user.userId));
      }
   };
   const handleRoleSelect = (event) => {
      const role = event.currentTarget.getAttribute("data-role");
      setSelectedRole(role);
   };

   const handleNextStep = () => setCurrentStep((prevStep) => prevStep + 1);
   const handlePreviousStep = () => setCurrentStep((prevStep) => prevStep - 1);
   const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

   const formatDate = (isoString) => {
      return format(new Date(isoString), "MMMM d, yyyy");
   };

   if (error) showError("Oops! Something went wrong", error);

   return (
      <Layout role="admin" pageName="User Management">
         <main className={styles.mainContent}>
            {loading ? (
               <Loading />
            ) : (
               <section className={styles.table}>
                  <div className={styles.toolHeader}>
                     <div className={styles.labelContainer}>
                        <h3>
                           All users <span>{users.length}</span>
                        </h3>
                     </div>
                     <div className={styles.toolContainer}>
                        <SearchBar />
                        <button
                           type="button"
                           className={`${styles.filterBtn} ${styles.iconBtn}`}
                        >
                           <TbFilter size={SMALL_ICON_SIZE} />
                           Filters
                        </button>
                        <button
                           type="button"
                           onClick={togglePopupCenter}
                           className={`${styles.filterBtn} ${styles.iconBtn}`}
                        >
                           <TbPlus size={SMALL_ICON_SIZE} />
                           Add user
                        </button>
                     </div>
                  </div>
                  <div className={styles.tableHeader}>
                     <Checkbox
                        id="select-all"
                        isChecked={selectedUsers.length === currentUsers.length}
                        onChange={handleSelectAll}
                     />
                     <h4>Name</h4>
                     <h4>Role</h4>
                     <h4>Last Active</h4>
                     <h4>Date Added</h4>
                  </div>
                  <div className={styles.tableContent}>
                     {currentUsers.map((user) => (
                        <div className={styles.tableItem} key={user.userId}>
                           <Checkbox
                              id={`checkbox-${user.userId}`}
                              isChecked={selectedUsers.includes(user.userId)}
                              onChange={() => handleCheckboxChange(user.userId)}
                           />
                           <div className={styles.userContainer}>
                              <UserIcon image={userIcon} size={48} />
                              <div className={styles.userInfo}>
                                 <h4>{`${user.firstName} ${user.lastName}`}</h4>
                                 <p>{user.email}</p>
                              </div>
                           </div>
                           <p className={styles.role}>{user.role}</p>
                           <p className={styles.lastActive}>
                              {formatDate(user.lastActive)}
                           </p>
                           <p className={styles.createdAt}>
                              {formatDate(user.createdAt)}
                           </p>
                           <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.iconBtn}`}
                              onClick={(event) =>
                                 togglePopupAction(user.userId, event)
                              }
                           >
                              <TbDotsVertical size={MEDIUM_ICON_SIZE} />
                           </button>
                           {activePopup === user.userId && (
                              <Popup
                                 show={isPopupVisible}
                                 close={closePopupAction}
                                 position={popupPosition}
                              >
                                 <div className={styles.popupWrapper}>
                                    <div className={styles.popupContent}>
                                       <button
                                          type="button"
                                          className={styles.iconCta}
                                       >
                                          <TbEdit size={POPUP_ICON_SIZE} />
                                          Edit details
                                       </button>
                                       <button
                                          type="button"
                                          className={styles.iconCta}
                                       >
                                          <TbFileArrowRight
                                             size={POPUP_ICON_SIZE}
                                          />
                                          Export details
                                       </button>
                                       <button
                                          type="button"
                                          className={`${styles.deleteBtn} ${styles.iconCta}`}
                                       >
                                          <TbTrash size={POPUP_ICON_SIZE} />
                                          Delete user
                                       </button>
                                    </div>
                                 </div>
                              </Popup>
                           )}
                        </div>
                     ))}
                  </div>
                  <div className={styles.pagination}>
                     {[...Array(totalPages)].map((_, index) => (
                        <button
                           key={index}
                           type="button"
                           className={
                              currentPage === index + 1 ? styles.active : ""
                           }
                           onClick={() => handlePageChange(index + 1)}
                        >
                           {index + 1}
                        </button>
                     ))}
                  </div>
               </section>
            )}
         </main>
         <Popup
            show={isPopupCenterVisible}
            close={closePopupCenter}
            position={{
               top: "50%",
               left: "50%",
               transform: "translate(-50%, -50%)",
            }}
            handleClickOutside={false}
         >
            <div className={styles.popupCreateUserWrapper}>
               <div className={styles.popupContent}>
                  <h2>Create a new user</h2>
                  {currentStep === 1 && (
                     <>
                        <FormUser
                           closePopup={closePopupCenter}
                           onNext={handleNextStep}
                        />
                     </>
                  )}
                  {currentStep === 2 && (
                     <>
                        <div className={styles.roleWrapper}>
                           <h3>What role is this user?</h3>
                           <div className={styles.roleContainer}>
                              <div
                                 className={`${styles.roleItem} ${
                                    selectedRole === "student"
                                       ? styles.active
                                       : ""
                                 }`}
                                 data-role="student"
                                 onClick={handleRoleSelect}
                              >
                                 <img
                                    src={studentIcon}
                                    width={LARGE_ICON_SIZE}
                                    alt="Student Icon"
                                 />
                                 <h4>Student</h4>
                              </div>

                              <div
                                 className={`${styles.roleItem} ${
                                    selectedRole === "instructor"
                                       ? styles.active
                                       : ""
                                 }`}
                                 data-role="instructor"
                                 onClick={handleRoleSelect}
                              >
                                 <img
                                    src={instructorIcon}
                                    width={LARGE_ICON_SIZE}
                                    alt="Instructor Icon"
                                 />
                                 <h4>Instructor</h4>
                              </div>

                              <div
                                 className={`${styles.roleItem} ${
                                    selectedRole === "admin"
                                       ? styles.active
                                       : ""
                                 }`}
                                 data-role="admin"
                                 onClick={handleRoleSelect}
                              >
                                 <img
                                    src={adminIcon}
                                    width={LARGE_ICON_SIZE}
                                    alt="Admin Icon"
                                 />
                                 <h4>Admin</h4>
                              </div>
                           </div>
                           <div className={styles.buttonContainer}>
                              <button
                                 type="button"
                                 onClick={handlePreviousStep}
                                 className={`${styles.cancelBtn} ${styles.ctaBtn}`}
                              >
                                 Previous step
                              </button>
                              <button
                                 type="submit"
                                 onClick={handleNextStep}
                                 className={`${styles.submitBtn} ${styles.ctaBtn}`}
                              >
                                 Next step
                              </button>
                           </div>
                        </div>
                     </>
                  )}
                  {currentStep === 3 && (
                     <>
                        {selectedRole === "student" && (
                           <FormStudent onBack={handlePreviousStep} />
                        )}
                     </>
                  )}
               </div>
            </div>
         </Popup>
      </Layout>
   );
};

export default UserManagement;
