import React from "react";
import styles from "./Modal.module.css";

const Modal = ({
  modalOn,
  closeModal,
  cancelModalOn = false,
  cancelModal = () => {},
  btnOption = true,
}) => {
  return (
    modalOn.on && (
      <div className={styles.safetyArea}>
        <div className={styles.modal}>
          <section>{modalOn.message}</section>
          <div className={styles.btnWrapper}>
            {btnOption && (
              <>
                <button
                  onClick={closeModal}
                  style={{
                    marginTop: !cancelModalOn ? "5vh" : null,
                  }}
                >
                  Confirm
                </button>
                {cancelModalOn && (
                  <button className={styles.bottomBtn} onClick={cancelModal}>
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
