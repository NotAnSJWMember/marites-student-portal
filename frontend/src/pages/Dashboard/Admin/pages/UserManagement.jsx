import React, { useState } from "react";
import styles from "./UserManagement.module.scss";
import { TbEdit, TbFileArrowRight, TbTrash } from "react-icons/tb";

import IconSizes from "constants/IconSizes";
import Table from "components/Table/Table";
import Layout from "components/Layout/Layout";
import UserIcon from "components/ui/UserIcon/UserIcon";
import PopupAlert from "components/Popup/PopupAlert";
import Popup from "components/Popup/Popup";
import { FormUser } from "components/Forms/FormUser";

import useFetchData from "hooks/useFetchData";
import useDeleteData from "hooks/useDeleteData";
import { useRegister } from "hooks";
import { format, formatDistanceToNow } from "date-fns";
import { capitalize } from "lodash";

const UserManagement = () => {
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);

  const headers = ["Name", "Role", "Last Seen", "Created on"];

  const { data: users } = useFetchData("user", shouldRefetch);
  const {
    popupState: deleteState,
    showPopup: showDeletePopup,
    deleteData,
  } = useDeleteData("user");
  const {
    popupState: createState,
    showPopup: showCreatePopup,
    loading,
    createAccount,
  } = useRegister();

  const formatDate = (isoString) => {
    return format(new Date(isoString), "MMMM d, yyyy");
  };

  const handleDeleteUser = async (userId) => {
    if (userId) {
      await deleteData(userId);
      setShouldRefetch((prev) => !prev);
    }
  };

  const handleShowCreatePopup = () => {
    setShowUserPopup((prev) => !prev);
  };

  const renderData = (data) => {
    return (
      <>
        <div className={styles.userContainer}>
          <UserIcon image={data.userPhoto} size={48} />
          <div className={styles.userInfo}>
            <h4 className={styles.title}>{`${data.firstName} ${data.lastName}`}</h4>
            <p className={styles.desc}>{data.email}</p>
          </div>
        </div>
        <p>{capitalize(data.role)}</p>
        <p className={styles.lastActive}>
          {formatDistanceToNow(data.lastActive, { addSuffix: true })}
        </p>
        <p className={styles.createdAt}>{formatDate(data.createdAt)}</p>
      </>
    );
  };

  const renderPopupContent = (user) => (
    <div className={styles.popupWrapper}>
      <div className={styles.popupContent}>
        <button type="button" className={styles.iconCta}>
          <TbEdit size={IconSizes.POPUP} />
          Edit details
        </button>
        <button type="button" className={styles.iconCta}>
          <TbFileArrowRight size={IconSizes.POPUP} />
          Export details
        </button>
        <button
          type="button"
          className={`${styles.deleteBtn} ${styles.iconCta}`}
          onClick={() => handleDeleteUser(user.userId)}
        >
          <TbTrash size={IconSizes.POPUP} />
          Delete user
        </button>
      </div>
    </div>
  );

  return (
    <Layout role="admin" pageName="User Management">
      <main className={styles.mainContent}>
        <section className={styles.tableWrapper}>
          <div className={styles.tableContainer}>
            <h3 className={styles.label}>
              All users <span>{users?.length}</span>
            </h3>
            <Table
              data={users}
              headers={headers}
              content={renderData}
              popupContent={renderPopupContent}
              ctaText="Create user"
              ctaAction={() => setShowUserPopup(true)}
            />
          </div>
        </section>
      </main>

      <Popup
        show={showUserPopup}
        close={handleShowCreatePopup}
        position="center"
        handleClickOutside={false}
      >
        <div className={styles.userPopup}>
          <h2>Create a user</h2>
          <FormUser
            role="student"
            loading={loading}
            createdAction={handleShowCreatePopup}
            createAccount={createAccount}
          />
        </div>
      </Popup>

      <PopupAlert
        icon={deleteState.icon}
        border={deleteState.border}
        color={deleteState.color}
        title={deleteState.title}
        message={deleteState.message}
        show={showDeletePopup}
      />

      <PopupAlert
        icon={createState.icon}
        border={createState.border}
        color={createState.color}
        title={createState.title}
        message={createState.message}
        show={showCreatePopup}
      />
    </Layout>
  );
};

export default UserManagement;
