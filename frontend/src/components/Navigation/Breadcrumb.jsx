import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Breadcrumb.module.scss";
import { TbChevronRight } from "react-icons/tb";
import IconSizes from "constants/IconSizes";

const Breadcrumb = ({ base, steps, setCurrentStep, currentStep }) => {
   const [isStepNavigated, setIsStepNavigated] = useState({});
   const lastStep = steps.length;
   const stepCounts = {};

   const goToPreviousStep = () => {
      setCurrentStep((prev) => {
         const newStep = prev === 1 ? lastStep : prev - 1;
         return newStep;
      });
      stepCounts[`step${currentStep}`] = true;
      setIsStepNavigated(stepCounts);
   };

   const goToNextStep = () => {
      setCurrentStep((prev) => {
         const newStep = prev === lastStep ? 1 : prev + 1;
         return newStep;
      });

      // window.history.pushState(null, "", window.location.href);
   };

   useEffect(() => {
      const handlePopState = (event) => {
         if (currentStep !== 1) {
            goToPreviousStep();
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
         <ul>
            <li className={styles.iconLabel}>
               <Link to={`/${baseUrl}`} className={styles.link}>
                  {baseName}
               </Link>
               <TbChevronRight size={IconSizes.SMALL} color="#8b8b8b" />
            </li>
            {steps.slice(0, currentStep).map((step, index) => {
               return (
                  <li className={styles.iconLabel}>
                     <p
                        className={`${styles.link} ${
                           currentStep === index + 1 ? styles.activeLink : ""
                        }`}
                        onClick={() => setCurrentStep(index + 1)}
                     >
                        {step}
                     </p>
                     {currentStep !== index + 1 && (
                        <TbChevronRight
                           size={IconSizes.SMALL}
                           color="#8b8b8b"
                        />
                     )}
                  </li>
               );
            })}
         </ul>
      </nav>
   );
};

export default Breadcrumb;
