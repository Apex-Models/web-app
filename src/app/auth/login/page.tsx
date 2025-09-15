"use client";
import UserContext from '@/components/context/userContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import ProviderButton from '@/components/UI/ProviderButton';
import styles from '../index.module.scss';

export default function Login () {
    const router = useRouter();
    const { login } = useContext(UserContext);

    const [userForm, setUserForm] = useState ({
        email: '',
        password: '',
    });
    
    // États pour remplacer useFetch
    const [data, setData] = useState<{
        code?: number;
        success?: boolean;
        data?: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        message?: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserForm({ ...userForm, [e.target.name]: e.target.value});
    };

    // Fonction fetch pour remplacer useFetch
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`http://localhost:4003/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userForm)
            });
            
            const dataJson = await response.json();
            
            if(dataJson.code && dataJson.code !== 200) {
                setError(dataJson.message);
            }
            
            setData(dataJson);
        } catch(err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetchData();
    };

    useEffect(()=> {
        if (data?.success && data?.data) {
            login(data.data);
            router.push('/');
        }
    }, [data, login, router]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Login</h1>
            <form onSubmit={handleSubmit} className={styles.wrapper}>
                { error && <p>{error}</p> }
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email"
                    value={userForm.email}
                    onChange={(e) => handleChange(e)}
                    isRequired
                />
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    value={userForm.password}
                    onChange={(e) => handleChange(e)}
                    isRequired
                />
                <Button type="submit" title="Login" />
                <div className={styles.separator}>
                    <div className={styles.line}/>
                    <span className={styles.text}>or</span>
                    <div className={styles.line}/>
                </div>
                <ProviderButton
                    title="Continue with Google"
                    provider="google"
                    href="/api/auth/google"
                />
                <ProviderButton
                    title="Continue with Apple"
                    provider="apple"
                    href="/api/auth/apple"
                />

                <p className={styles.text}>Already an account ? <Link href="/auth/register" className={styles.link}>sign-in</Link></p>
            </form>
            {loading && <p>Loading...</p>}
            <div className={styles.terms}>This site is protected by reCAPTCHA and the <a href="/privacy" className={styles.link}>Google Privacy Policy</a> and <a href="/terms" className={styles.link}>Terms of Service</a> apply.</div>
        </div>
    );
}