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
        <div
          className={styles.modal}
          style={{
            height: cancelModalOn ? "25vh" : null,
            width: cancelModalOn ? "80vw" : null,
          }}
        >
          <section>{modalOn.message}</section>
          <div className={styles.btnWrapper}>
            {btnOption && (
              <>
                <button onClick={closeModal}>Confirm</button>
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
