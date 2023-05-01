import React, { useRef } from "react";
import styles from "./List.module.css";

const List = ({ list, checkList, setCheckList, workoutName, color }) => {
  const deleteSet = (idx) => {
    const copyObj = { ...checkList };
    copyObj[workoutName].splice(idx, 1);
    setCheckList(copyObj);
  };
  const weightRef = useRef(null);
  const repsRef = useRef(null);

  const updateSet = (idx) => {
    const copyObj = { ...checkList };
    let weight = weightRef.current.value;
    let reps = repsRef.current.value;
    if (weight.replace(/ /g, "").length === 0) {
      alert("you must enter weight");
      return;
    } else if (reps.replace(/ /g, "").length === 0) {
      alert("you must enter reps");
      return;
    }
    copyObj[workoutName][idx] = [weight, reps];
    setCheckList(copyObj);
  };

  return list.map((setInform, key) => {
    return (
      <div
        key={key}
        className={styles.detail}
        style={{ backgroundColor: color }}
      >
        <div className={styles.setInform}>{key + 1 + " set"}</div>

        {setInform.length === 0 ? (
          <>
            kg :
            <input
              style={{ outlineColor: color }}
              className={styles.weightInput}
              ref={weightRef}
              type="text"
            />
            {/* type= number로하면 current.value 안먹힘 */}
            reps :
            <input
              style={{ outlineColor: color }}
              className={styles.repsInput}
              ref={repsRef}
              type="text"
            />
            <div className={styles.clearbtn} onClick={() => updateSet(key)}>
              clear!
            </div>
          </>
        ) : (
          <>
            <div
              className={styles.weightInform}
            >{`${setInform[0]}kg 😵 ${setInform[1]}reps`}</div>
            <span className={styles.deleteBtn} onClick={() => deleteSet(key)}>
              X
            </span>
          </>
        )}
      </div>
    );
  });
};

export default List;
