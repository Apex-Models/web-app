"use client";
import UserContext from "@/components/context/userContext";
import { useRouter, usePathname } from "next/navigation";
import { useContext } from "react";
import styles from "./index.module.scss";
import Link from "next/link";

const Header = () => {
    const { user, cart, logout } = useContext(UserContext);

    const router = useRouter();
    const pathname = usePathname();
    
    const isHomePage = pathname === '/';

    return (
        <div className={`${styles.header} ${isHomePage ? styles.transparent : ''}`}>
            <div className={styles.navItems}>
                <Link href="/products" className={styles.navLink}>
                    CATALOG
                </Link>
                <Link href="/products" className={styles.navLink}>
                    ABOUT
                </Link>
            </div>
            <img src="/apex_logo.png" alt="Logo" className={styles.logo} onClick={() => router.push('/')} />
            <div className={styles.navItems}>
                {
                    user ? (
                        <div>
                            <p>{user.firstName}</p>
                            <button onClick={() => logout()}>LOGOUT</button>
                        </div>
                    ) : (
                        <div>
                            <Link href="/login">LOGIN</Link>
                        </div>
                    )
                }
                <Link href="/account">
                    <img src="/icons/account.svg" alt="Account" className={styles.icon}/>
                </Link>
                <Link href="/cart">
                    <img src="/icons/cart.svg" alt="Cart" className={styles.icon}/>
                    <span className={styles.cartCount}>{cart.length}</span>
                </Link>
            </div>

        </div>
    );
}

export default Header;