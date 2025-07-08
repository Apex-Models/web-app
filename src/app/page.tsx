import Link from "next/link";
import styles from "./page.module.scss";
import Chatbot from "@/components/UI/Chatbot";

export default function Home() {

  return (
    <div className={styles.page}>
      <div className={styles.carroussel}>
        <img className={styles.image}
          src="/images/carroussel-bg-1.jpg"
          alt="Carroussel Background"
        />
        <div className={styles.carrousselContent}>
          <h1 className={styles.title}><b>VOLKSWAGEN GOLF 7</b></h1>
          <p>NOW AVAILABLE</p>
          <div className={styles.linksWarapper}>
            <Link href="/products/26" className={styles.link}>BUY NOW</Link>
            <Link href="/products" className={styles.link}>SEE CATALOG</Link>
          </div>
        </div>
      </div>
      
      {/* Chatbot flottant */}
      <Chatbot />
    </div>
  );
}