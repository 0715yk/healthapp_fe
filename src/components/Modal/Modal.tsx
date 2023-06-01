import styles from "./Modal.module.css";
import { ModalData } from "./types";

interface Props {
  modalOn: ModalData;
  closeModal: () => void;
  cancelModalOn?: boolean;
  cancelModal?: () => void;
  btnOption?: boolean;
}

const Modal = ({
  modalOn,
  closeModal,
  cancelModalOn = false,
  cancelModal = () => {},
  btnOption = true,
}: Props) => {
  return modalOn.on ? (
    <div className={styles.safetyArea}>
      <div
        className={styles.modal}
        style={
          cancelModalOn
            ? {
                height: "22vh",
                width: "80vw",
              }
            : {}
        }
      >
        <section>{modalOn.message}</section>
        <div className={styles.btnWrapper}>
          {btnOption && (
            <>
              <button
                onClick={closeModal}
                style={
                  !cancelModalOn
                    ? {
                        marginTop: "1vh",
                      }
                    : {}
                }
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
  ) : (
    <></>
  );
};

export default Modal;
