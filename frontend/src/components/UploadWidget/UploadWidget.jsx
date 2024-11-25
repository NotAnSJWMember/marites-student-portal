import React, { useEffect, useState } from "react";
import styles from "./UploadWidget.module.scss";
import { TbCloudDownload } from "react-icons/tb";

import IconSizes from "constants/IconSizes";

const UploadWidget = ({ fileSelect, selectedFile }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [fileInfo, setFileInfo] = useState({ name: "", size: "" });

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setFileInfo({ name: selectedFile.name, size: formatFileSize(selectedFile.size) });
    }
  }, [selectedFile]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("No file selected.");
      return;
    }
    fileSelect(file);
  };

  const handleRemoveFile = () => {
    setFileInfo({ name: "", size: "" });
    setPreview(null);
  };

  const triggerFileInput = () => {
    if (!preview) document.getElementById("fileInput").click();
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={styles.widgetWrapper}>
      {preview && (
        <div className={styles.preview}>
          <img src={preview} alt="Uploaded preview" />
        </div>
      )}

      <div
        className={styles.widgetContainer}
        onClick={triggerFileInput}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          fileSelect(file);
        }}
      >
        {!preview ? (
          <>
            <button type="button" className={styles.iconBtn}>
              <TbCloudDownload size={IconSizes.MEDIUM} />
            </button>
            <p>
              <span>Click to upload</span> or drag and drop <br />
              SVG, PNG, or JPG (max. 2MB)
              {error && <p className={styles.errorMsg}>{error}</p>}
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>Uploaded file</strong>
            </p>
            <p>{fileInfo.name}</p>
            <p>File size: {fileInfo.size}</p>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => handleRemoveFile()}
            >
              Remove Photo
            </button>
          </>
        )}
      </div>

      <input
        id="fileInput"
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadWidget;
