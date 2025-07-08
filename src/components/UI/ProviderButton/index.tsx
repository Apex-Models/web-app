import Link from 'next/link';
import styles from './index.module.scss'

interface InputProps {
  title: string;
  style?: string;
  href?: string;
  icon?: string;
}

const Index: React.FC<InputProps> = ({ title, style, href, icon }) => {
  return (
    <Link type='button' className={`${styles.providerButton} ${ style && styles[style]}`} href={`http://localhost:3030${href}`} >
        <img className={styles.providerIcon} src={icon} width="20" height="20" alt={title}/>
        {title}
    </Link>
  );
}
  
export default Index;