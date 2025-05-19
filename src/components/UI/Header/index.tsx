"use client";

import UserContext from "@/components/context/userContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const Header = () => {
    const router = useRouter();
    const { user, logout } = useContext(UserContext);

    return (
        <div>
            <p>Apex</p>
            {
                user ? (
                    <div>
                        <p>Welcome, {user.firstName}</p>
                        <button onClick={() => logout()}>Logout</button>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => router.push('/login')}>Login</button>
                    </div>
                )
            }
        </div>
    );
}

export default Header;