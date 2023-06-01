import styles from "./GlowBtn.module.css";

interface Props {
  props: { func: () => Promise<void> };
}
const GlowBtn = ({ props }: Props) => {
  return <button className={styles.glowBtn} onClick={props.func}></button>;
};

export default GlowBtn;
