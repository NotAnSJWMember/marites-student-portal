import React, { useRef, useState } from "react";
import Layout from "components/Layout/Layout";
import SearchBar from "components/SearchBar/SearchBar";
import Popup from "components/Popup/Popup";
import Checkbox from "components/Checkbox/Checkbox";
import Loading from "components/Loading/Loading";
import useFetchUsers from "hooks/useFetchUsers";
import { useForm } from "react-hook-form";
import { usePopupAlert, useRegister, useTogglePassword } from "hooks";
import { format } from "date-fns";
import styles from "./UserManagement.module.scss";
import userIcon from "assets/images/profile.jpg";
import UserIcon from "components/UserIcon/UserIcon";
import {
   TbCloudDownload,
   TbDotsVertical,
   TbEdit,
   TbFileArrowRight,
   TbFilter,
   TbPlus,
   TbTrash,
} from "react-icons/tb";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import PopupAlert from "components/Popup/PopupAlert";

const POPUP_ICON_SIZE = 25;
const MEDIUM_ICON_SIZE = 22;
const SMALL_ICON_SIZE = 19;

const UserManagement = () => {
   const [showPassword, togglePasswordVisibility] = useTogglePassword();
   const [activePopup, setActivePopup] = useState(null);
   const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });
   const [isPopupVisible, setIsPopupVisible] = useState(false);
   const [isPopupCenterVisible, setIsPopupCenterVisible] = useState(false);
   const [popupCenterPosition] = useState({
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
   });
   const [currentPage, setCurrentPage] = useState(1);
   const [selectedUsers, setSelectedUsers] = useState([]);
   const { showError } = usePopupAlert();

   const token = localStorage.getItem("token");
   const usersPerPage = 8;
   const timeoutId = useRef(null);

   const { users, loading, error } = useFetchUsers(
      "http://localhost:8080/user",
      token
   );

   const { popupState, showPopup, setShowPopup, createAccount } = useRegister();

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();

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

   const togglePopupCenter = () => {
      setIsPopupCenterVisible((prev) => !prev);
   };

   const closePopupCenter = () => {
      setIsPopupCenterVisible(false);
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

   const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
   };

   const handleClosePopup = () => {
      setShowPopup(false);
   };

   const formatDate = (isoString) => {
      return format(new Date(isoString), "MMMM d, yyyy");
   };

   if (loading) {
      return <Loading />;
   }

   if (error) {
      showError("Oops! Something went wrong", error);
   }

   const onCreateSubmit = async (data) => {
      const response = await createAccount(data, reset);
      if (response.ok) {
         setShowPopup(true);
      }
   };

   return (
      <Layout role="admin" pageName="User Management">
         <main className={styles.mainContent}>
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
                           <div className={styles.userIcon}>
                              <img src={userIcon} alt="Your Profile Icon" />
                           </div>
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
         </main>
         <Popup
            show={isPopupCenterVisible}
            close={closePopupCenter}
            position={popupCenterPosition}
            handleClickOutside={false}
         >
            <div className={styles.popupCreateUserWrapper}>
               <div className={styles.popupContent}>
                  <h3>Create a new user</h3>
                  <form
                     className={styles.formContainer}
                     onSubmit={handleSubmit(onCreateSubmit)}
                     autoComplete="off"
                  >
                     <div className={styles.twoColumn}>
                        <h4>Name</h4>
                        <div className={styles.twoColumn}>
                           <div className={styles.formItem}>
                              <label>
                                 {errors.firstName && (
                                    <span className={styles.errorMsg}>
                                       ({errors.firstName.message})
                                    </span>
                                 )}
                              </label>
                              <input
                                 type="text"
                                 {...register("firstName", {
                                    required: "First name is required",
                                 })}
                              />
                           </div>
                           <div className={styles.formItem}>
                              <label>
                                 {errors.lastName && (
                                    <span className={styles.errorMsg}>
                                       ({errors.lastName.message})
                                    </span>
                                 )}
                              </label>
                              <input
                                 type="text"
                                 {...register("lastName", {
                                    required: "Last name is required",
                                 })}
                              />
                           </div>
                        </div>
                     </div>
                     <div className={styles.line}></div>
                     <div className={styles.twoColumn}>
                        <h4>Birthdate</h4>
                        <div className={styles.formItem}>
                           <label>
                              {errors.birthDate && (
                                 <span className={styles.errorMsg}>
                                    ({errors.birthDate.message})
                                 </span>
                              )}
                           </label>
                           <input
                              type="date"
                              {...register("birthDate", {
                                 required: "Birthdate is required",
                              })}
                           />
                        </div>
                     </div>
                     <div className={styles.line}></div>
                     <div className={styles.twoColumn}>
                        <h4>Gender</h4>
                        <div className={styles.formItem}>
                           <label>
                              {errors.gender && (
                                 <span className={styles.errorMsg}>
                                    ({errors.gender.message})
                                 </span>
                              )}
                           </label>
                           <select
                              {...register("gender", {
                                 required: "Gender is required",
                              })}
                           >
                              <option value="">Select gender</option>
                              <option value="Female">Female</option>
                              <option value="Male">Male</option>
                              <option value="Other">Other</option>
                           </select>
                        </div>
                     </div>
                     <div className={styles.line}></div>
                     <div className={styles.twoColumn}>
                        <h4>Program</h4>
                        <div className={styles.twoColumn}>
                           <div className={styles.formItem}>
                              <label>
                                 {errors.program && (
                                    <span className={styles.errorMsg}>
                                       ({errors.program.message})
                                    </span>
                                 )}
                              </label>
                              <input
                                 type="text"
                                 {...register("program", {
                                    required: "program is required",
                                 })}
                              />
                           </div>
                           <div className={styles.formItem}>
                              <label>
                                 {errors.year && (
                                    <span className={styles.errorMsg}>
                                       ({errors.year.message})
                                    </span>
                                 )}
                              </label>
                              <select
                                 {...register("year", {
                                    required: "Year is required",
                                 })}
                              >
                                 <option value="">Select Year</option>
                                 <option value="1">First year</option>
                                 <option value="2">Second year</option>
                                 <option value="3">Third year</option>
                                 <option value="4">Fourth year</option>
                              </select>
                           </div>
                        </div>
                     </div>
                     <div className={styles.line}></div>
                     <div className={styles.twoColumn}>
                        <h4>Login</h4>
                        <div className={styles.twoColumn}>
                           <div className={styles.formItem}>
                              <label>
                                 {errors.username && (
                                    <span className={styles.errorMsg}>
                                       ({errors.username.message})
                                    </span>
                                 )}
                              </label>
                              <input
                                 type="text"
                                 {...register("username", {
                                    required: "Username is required",
                                 })}
                              />
                           </div>
                           <div className={styles.formItem}>
                              <label>
                                 {errors.password && (
                                    <span className={styles.errorMsg}>
                                       ({errors.password.message})
                                    </span>
                                 )}
                              </label>
                              <div className={styles.inputMerge}>
                                 <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                       required: "Password is required",
                                    })}
                                 />
                                 <span
                                    className={styles.inputIcon}
                                    onClick={togglePasswordVisibility}
                                 >
                                    {showPassword ? (
                                       <IoEyeOffOutline
                                          color="gray"
                                          size={20}
                                       />
                                    ) : (
                                       <IoEyeOutline color="gray" size={20} />
                                    )}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className={styles.line}></div>
                     <div className={styles.twoColumn}>
                        <h4>Contact</h4>
                        <div className={styles.twoColumn}>
                           <div className={styles.formItem}>
                              <label>
                                 {errors.email && (
                                    <span className={styles.errorMsg}>
                                       ({errors.email.message})
                                    </span>
                                 )}
                              </label>
                              <input
                                 type="email"
                                 {...register("email", {
                                    required: "Email address is required",
                                 })}
                              />
                           </div>
                           <div className={styles.formItem}>
                              <label>
                                 {errors.phoneNum && (
                                    <span className={styles.errorMsg}>
                                       ({errors.phoneNum.message})
                                    </span>
                                 )}
                              </label>
                              <input
                                 type="tel"
                                 {...register("phoneNum", {
                                    required: "Phone number is required",
                                    pattern: {
                                       value: /^\+?\d{1,3}?\s?\d{10}$/,
                                       message:
                                          "Phone number must be 10 digits",
                                    },
                                 })}
                              />
                           </div>
                        </div>
                     </div>
                     <div className={styles.line}></div>
                     <div className={styles.twoColumn}>
                        <h4>Profile Photo</h4>
                        <div className={styles.changePhotoContainer}>
                           <UserIcon
                              image={userIcon}
                              desc="New user's profile photo"
                              size={80}
                           />
                           <div className={styles.changePhoto}>
                              <button type="button" className={styles.iconBtn}>
                                 <TbCloudDownload size={MEDIUM_ICON_SIZE} />
                              </button>
                              <p>
                                 <span>Click to upload</span> or drag and drop{" "}
                                 <br />
                                 SVG, PNG, or JPG (max. 2MB)
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className={styles.line}></div>
                     <div className={styles.buttonContainer}>
                        <button
                           onClick={closePopupCenter}
                           type="button"
                           className={`${styles.cancelBtn} ${styles.ctaBtn}`}
                        >
                           Cancel
                        </button>
                        <button
                           type="submit"
                           className={`${styles.submitBtn} ${styles.ctaBtn}`}
                        >
                           Add user
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         </Popup>
         <PopupAlert
            icon={popupState.icon}
            border={popupState.border}
            color={popupState.color}
            title={popupState.title}
            message={popupState.message}
            onClose={handleClosePopup}
            show={showPopup}
         />
      </Layout>
   );
};

export default UserManagement;
