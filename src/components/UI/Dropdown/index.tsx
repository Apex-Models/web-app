import styles from './index.module.scss'

interface DrodownProps {
    name?: string;
}

const Index: React.FC<DrodownProps> = ({  }) => {
  return (
    <>
        <div className={styles.input_cont}>
            <input className={styles.text_input}/>
        </div>
    </>
  );
}
  
export default Index;