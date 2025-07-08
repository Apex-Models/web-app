import styles from './index.module.scss'

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  title: string;
  name?: string;
  value?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: string;
};

const Index: React.FC<ButtonProps> = ({ type = "button", title, name, value, onClick, style }) => {
  return (
    <button className={`${styles.btn} ${style ? styles[style] : ''}`} type={type} name={name} value={value} onClick={onClick}>{title}</button>
  );
}

export default Index;