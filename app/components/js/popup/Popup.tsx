import styles from "./Popup.module.scss";

const Popup: React.FC<{ action: (accept: boolean) => void }> = ({
  action,
}): JSX.Element => {
  return (
    <div className={styles.popup}>
      <p>
        Our website uses cookies to be able to deliver quality user experience
        and enhance performance. By continuing to our website, you have given us
        permission to store cookies in your browser.
      </p>
      <div>
        <button onClick={() => action(true)}>Accept</button>
        <button onClick={() => action(false)}>Reject</button>
      </div>
    </div>
  );
};

export default Popup;
