import React, { useState } from "react";
import styles from "./UserIcon.module.scss";

export const UserIcon = ({ image, desc, size, setImage, editable = false }) => {
  const [showSpan, setShowSpan] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const triggerFileInput = () => {
    if (editable) document.getElementById("fileInput").click();
  };

  const validateAndSetFile = (file) => {
    if (!file) return;  

    const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleHoverUserIcon = () => {
    setTimeout(() => {
      setShowSpan((prev) => !prev);
    }, 100);
  };

  return editable ? (
    <>
      <div
        className={styles.userIcon}
        style={{ width: size, height: size }}
        onMouseEnter={() => handleHoverUserIcon()}
        onMouseLeave={() => handleHoverUserIcon()}
        onClick={() => triggerFileInput()}
      >
        <span className={`${styles.editableText} ${showSpan ? styles.show : ""}`}>
          Change profile photo
        </span>
        <img src={image} alt={desc} className={styles.editable} />
      </div>
      <input
        id="fileInput"
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </>
  ) : (
    <div className={styles.userIcon} style={{ width: size, height: size }}>
      <img src={image} alt={desc} />
    </div>
  );
};

export default UserIcon;
