import React from "react";
import styles from "./Finance.module.scss";
import {
  TbAugmentedReality,
  TbCalendarDue,
  TbFirstAidKit,
  TbFlask,
  TbLibrary,
  TbNotebook,
  TbPresentation,
} from "react-icons/tb";

import IconSizes from "constants/IconSizes";
import Loading from "components/Loading/Loading";
import Layout from "components/Layout/Layout";

import useFetchData from "hooks/useFetchData";
import { useAuth } from "hooks";
import { format } from "date-fns";

const Finance = () => {
  const { user: session } = useAuth();
  const { data: student } = useFetchData(`student/${session.userId}`);
  const { data: finances, loading } = useFetchData(`finance/${session.userId}`);
  const { data: program } = useFetchData(`program/${student.programId}`);

  const outstandingBalance = finances?.outstandingBalance;
  const paymentsMade = finances?.payments || [];
  const totalFees = finances?.totalFees;
  const discounts = finances?.discounts || [];
  const paymentStatus = finances?.paymentStatus?.status;
  const paymentDate = finances?.paymentStatus?.lastUpdated;
  const schoolYear = finances?.schoolYear;
  const semester = finances?.semester === 1 ? "1st" : "2nd";

  const formatCurrency = (number) => {
    const formattedNumber = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(number);

    return formattedNumber;
  };

  const formattedBalance = formatCurrency(outstandingBalance);
  const formattedTotalFees = formatCurrency(totalFees);

  const formattedPayments = paymentsMade.map((payment) => (
    <div key={payment.id} className={styles.transactionItem}>
      <p>{new Date(payment.date).toLocaleDateString()}</p>
      <p>{formatCurrency(payment.amount)}</p>
    </div>
  ));

  const formattedDiscounts = discounts.map((discount, index) => (
    <div key={index} className={styles.discountItem}>
      <p>{discount.type}</p>
      <p>{formatCurrency(discount.amount)}</p>
    </div>
  ));

  return (
    <Layout role="student" pageName="Finance">
      {!loading ? (
        <>
          <main className={styles.mainContent}>
            <div className={styles.cardWrapper}>
              <section className={styles.balanceCard}>
                <div>
                  <h3 className={styles.title}>Outstanding Balance</h3>
                  <div className={styles.alignCenter}>
                    <p className={styles.balance}>{formattedBalance}</p>
                    <p
                      className={`${styles.badge} ${
                        paymentStatus !== "paid" ? styles.redBadge : styles.greenBadge
                      }`}
                    >
                      {paymentStatus.toUpperCase()}
                    </p>
                  </div>
                  <div className={styles.line}></div>
                </div>
                <div>
                  <div className={styles.alignCenter}>
                    <p className={styles.badge}>
                      <TbNotebook size={IconSizes.SMALL} />
                      <strong>S.Y {schoolYear}</strong>
                      {semester} Semester
                    </p>
                    <p className={styles.badge}>
                      <TbCalendarDue size={IconSizes.SMALL} />
                      <strong>Due date:</strong>
                      December 15, 2024
                    </p>
                  </div>
                  <p className={styles.desc}>
                    Note: Please pay before the semester ends. Failure to comply will result to
                    a overdue fee added to your account.
                  </p>
                </div>
              </section>
              <section className={styles.overviewCard}>
                <div className={styles.info}>
                  <h3 className={styles.title}>Overview</h3>
                  <p className={styles.desc}>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam
                    accusamus, amet adipisci dolore labore quam.
                  </p>
                </div>
                <div className={styles.wrapper}>
                  <div className={styles.fees}>
                    <p className={styles.badge}>
                      <strong>Miscellaneous Fees</strong>
                    </p>
                    <div className={styles.feeContainer}>
                      {program?.miscellaneousFees?.map((fee, index) => {
                        const icons = [
                          <TbLibrary size={IconSizes.SMALL} />,
                          <TbFlask size={IconSizes.SMALL} />,
                          <TbPresentation size={IconSizes.SMALL} />,
                          <TbAugmentedReality size={IconSizes.SMALL} />,
                          <TbFirstAidKit size={IconSizes.SMALL} />,
                        ];

                        return (
                          fee && (
                            <React.Fragment key={`${fee}-${index}`}>
                              <div className={styles.spaceBetween}>
                                <div>
                                  <div className={styles.iconLabel}>
                                    {icons[index]}
                                    <p className={styles.title}>
                                      <strong>{fee.feeType}</strong>
                                    </p>
                                  </div>
                                  <p className={styles.desc}>{fee.description}</p>
                                </div>
                                <p>{formatCurrency(fee.amount)}</p>
                              </div>
                              {index !== program?.miscellaneousFees?.length - 1 && (
                                <div className={styles.line}></div>
                              )}
                            </React.Fragment>
                          )
                        );
                      })}
                    </div>
                  </div>
                  <div className={styles.discounts}>
                    <p className={styles.badge}>
                      <strong>Discounts</strong>
                    </p>
                    {formattedDiscounts.length > 0 ? (
                      <div>{formattedDiscounts}</div>
                    ) : (
                      <p>No discounts applied</p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <section className={styles.ledgerCard}>
              <h3>Transaction History</h3>
              <div className={styles.tableWrapper}>
                <div className={styles.tableHeader}>
                  <p><strong>Ref No.</strong></p>
                  <p><strong>Debit</strong></p>
                  <p><strong>Credit</strong></p>
                  <p><strong>Balance</strong></p>
                  <p><strong>Payment Method</strong></p>
                  <p><strong>Transaction Date</strong></p>
                </div>
                <div className={styles.tableContent}></div>
              </div>

              {formattedPayments.length > 0 ? (
                <div className={styles.transactionList}>{formattedPayments}</div>
              ) : (
                <p>No transactions found</p>
              )}
            </section>
          </main>
        </>
      ) : (
        <Loading />
      )}
    </Layout>
  );
};

export default Finance;
