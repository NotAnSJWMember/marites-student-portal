import React from "react";

import Layout from "components/Layout/Layout";

import styles from "./AdminDashboard.module.scss";

const AdminDashboard = () => {
   return (
      <Layout role="admin" pageName="Dashboard">
         <main>This is the admin dashboard</main>
         <aside></aside>
      </Layout>
   );
};

export default AdminDashboard;
