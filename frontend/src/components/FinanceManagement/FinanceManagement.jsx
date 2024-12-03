import React, { useEffect, useState } from "react";
import styles from "./FinanceManagement.module.scss";
import Layout from "components/Layout/Layout";
import TabMenu from "components/TabMenu/TabMenu";
import useFetchData from "hooks/useFetchData";
import Table from "components/Table/Table";
import useDeleteData from "hooks/useDeleteData";
import { exportToCSV } from "utils/exportToCSV";
import { exportToJSON } from "utils/exportToJSON";
import { UserContainer } from "components/ui/UserContainer/UserContainer";
import { findDataByUserId } from "utils/findDataByUserId";
import { useDataContext } from "hooks/contexts/DataContext";
import { formatDate } from "utils/formatDate";
import { formatCurrency } from "utils/formatCurrency";

const FinanceManagement = () => {
  const { dataState: students } = useDataContext("student");
  const { data: finances, loading, fetchData } = useFetchData("finance");

  const {
    popupState: deleteState,
    showPopup: showDeletePopup,
    deleteData,
  } = useDeleteData("finances");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper to determine the payment status
  const getStatus = (status) => {
    return status === "unpaid" ? (
      <p className={`${styles.badge} ${styles.redBadge}`}>UNPAID</p>
    ) : (
      <p className={`${styles.badge} ${styles.greenBadge}`}>PAID</p>
    );
  };

  const studentFinances = finances
    .map((finance) => ({
      student: findDataByUserId(students ? students : [], finance.studentId),
      finance: finance,
    }))
    .filter((finance) => finance.student !== null);

  const Overview = () => {
    return "Overview.. I don't know what to put in here yet.";
  };

  const Payments = () => {
    const [showCreateUserPopup, setShowCreateUserPopup] = useState(false);
    const [showEditUserPopup, setShowEditUserPopup] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showExportPopup, setShowExportPopup] = useState(false);
    const [selectFileType, setSelectFileType] = useState("csv");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const renderData = (data) => {
      const student = data.student;
      const finance = data.finance;

      return (
        <>
          <p>{finance.paymentStatus._id}</p>
          <UserContainer user={student ? student : []} size={48} />
          <p>{formatCurrency(finance.outstandingBalance)}</p>
          <p>{formatDate(finance.paymentStatus.lastUpdated)}</p>
          {getStatus(finance.paymentStatus.status)}
        </>
      );
    };

    const handleAddPayment = () => {};

    const handleShowDeleteConfirmation = (data) => {
      if (data) {
        setSelectedUser(data);
        setIsPopupVisible(false);
      }
      setShowDeleteConfirmation(true);
    };

    const handleDelete = async () => {
      if (selectedUser?.userId) {
        await deleteData(selectedUser?.userId, fetchData);
      } else {
        await deleteData(selectedUser, fetchData);
      }

      setShowDeleteConfirmation(false);
    };

    const handleExport = (user) => {
      const filename = user?.userId
        ? `${user?.userId}-data-export.${selectFileType}`
        : `data-export.${selectFileType}`;

      if (selectFileType === "csv") {
        exportToCSV(
          filename,
          !Array.isArray(selectedUser) ? [selectedUser] : selectedUser
        );
      } else if (selectFileType === "json") {
        exportToJSON(filename, selectedUser);
      }

      setSelectFileType(null);
    };

    const handleShowEditPopup = (user) => {
      setShowEditUserPopup((prev) => !prev);
      setIsPopupVisible(false);
    };

    const handleShowExportPopup = (user) => {
      setSelectedUser(user);
      setIsPopupVisible(false);
      setShowExportPopup((prev) => !prev);
    };

    return (
      <Table
        data={studentFinances}
        headers={[
          { label: "Payment ID", attribute: "firstName" },
          { label: "Name", attribute: "role" },
          { label: "Amount", attribute: "lastActive" },
          { label: "Paid On", attribute: "createdAt" },
          { label: "Status", attribute: "createdAt" },
        ]}
        filters={[
          { label: "User ID", attribute: "userId" },
          { label: "Amount", attribute: "outstandingBalance" },
          { label: "First Name", attribute: "firstName" },
        ]}
        gridTemplateColumns={"40px 1fr 30% 1fr 1fr 1fr 40px"}
        content={renderData}
        onEdit={handleShowEditPopup}
        onExport={handleShowExportPopup}
        onDelete={handleShowDeleteConfirmation}
        isSingleObject={false}
        isPopupVisible={isPopupVisible}
        setIsPopupVisible={setIsPopupVisible}
        ctaText="Add payment"
        ctaAction={() => handleAddPayment()}
      />
    );
  };

  const tabs = [
    { label: "Overview", content: <Overview /> },
    { label: "Payments", content: <Payments /> },
    { label: "Invoices", content: "" },
    { label: "History", content: "" },
    { label: "Fee structure", content: "" },
    { label: "Reports", content: "" },
  ];

  return (
    <Layout role="admin" pageName="Finance Management">
      <main className={styles.mainContent}>
        <section className={styles.financeContainer}>
          <h2 className={styles.title}>Finance Management</h2>
          <div className={styles.headers}>
            <TabMenu tabs={tabs} />
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default FinanceManagement;
