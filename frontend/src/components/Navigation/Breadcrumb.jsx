import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Breadcrumb.module.scss";
import { TbChevronRight } from "react-icons/tb";
import IconSizes from "constants/IconSizes";

const Breadcrumb = ({ base, steps, handlePreviousStep, setCurrentStep, currentStep }) => {
   useEffect(() => {
      const handlePopState = (event) => {
         if (currentStep !== 1) {
            handlePreviousStep();
         } else {
            window.history.back();
         }
      };

      window.history.pushState({ step: currentStep }, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
      return () => {
         window.removeEventListener("popstate", handlePopState);
      };
   });

   const location = useLocation();

   const pathnames = location.pathname.split("/").filter((x) => x);
   const baseIndex = pathnames.indexOf(base);
   const baseUrl = pathnames.slice(0, baseIndex + 1).join("/") || "";
   const baseName = base
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

   return (
      <nav>
         <ul className={styles.breadcrumb}>
            <li className={styles.iconLabel}>
               <Link to={`/${baseUrl}`} className={styles.link}>
                  {baseName}
               </Link>
               <TbChevronRight size={IconSizes.SMALL} color='#8b8b8b' />
            </li>
            {steps.slice(0, currentStep).map((step, index) => {
               return (
                  <li key={index} className={styles.iconLabel}>
                     <p
                        className={`${styles.link} ${
                           currentStep === index + 1 ? styles.activeLink : ""
                        }`}
                        onClick={() => setCurrentStep(index + 1)}
                     >
                        {step}
                     </p>
                     {currentStep !== index + 1 && (
                        <TbChevronRight size={IconSizes.SMALL} color='#8b8b8b' />
                     )}
                  </li>
               );
            })}
         </ul>
      </nav>
   );
};

export default Breadcrumb;
