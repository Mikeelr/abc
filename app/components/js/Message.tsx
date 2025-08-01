import styles from "../../styles/Message.module.scss";

interface MessageProp {
  message: string;
}
const Message: React.FC<MessageProp> = ({ message }) => {
  return (
    <div>
      {message && (
        <div className={styles.message}>
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};
export default Message;
