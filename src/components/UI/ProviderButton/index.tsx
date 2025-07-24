import Link from 'next/link';
import styles from './index.module.scss'

interface InputProps {
  title: string;
  provider?: string;
  href?: string;
}

const Index: React.FC<InputProps> = ({ title, provider, href }) => {

  const icon = {
    apple: '/icons/apple.svg',
    google: '/icons/google.svg',
  };

  return (
    <Link type='button' className={`${styles.providerButton} ${ provider && styles[provider]}`} href={`http://localhost:3030${href}`} >
        <img className={styles.providerIcon} src={`${icon[provider as keyof typeof icon]}`} width="20" height="20" alt={title}/>
        {title}
    </Link>
  );
}
  
export default Index;