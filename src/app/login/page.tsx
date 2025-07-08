"use client";
import UserContext from '@/components/context/userContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import ProviderButton from '@/components/UI/ProviderButton';
import styles from './index.module.scss';

export default function Login () {
    const router = useRouter();
    const { login } = useContext(UserContext);

    const [userForm, setUserForm] = useState ({
        email: '',
        password: '',
    });
    
    // États pour remplacer useFetch
    const [data, setData] = useState<any>(null);
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
    }, [data]);

    return (
        <div className={styles.wrapper}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    id="email"
                    name="email"
                    label='Email:'
                    type="email"
                    placeholder="Enter your email"
                    value={userForm.email}
                    onChange={(e) => handleChange(e)}
                    isRequired
                />
                <Input
                    id="password"
                    name="password"
                    label='Password:'
                    type="password"
                    placeholder="Enter your password"
                    value={userForm.password}
                    onChange={(e) => handleChange(e)}
                    isRequired
                />
                <Button type="submit" title="Login" />
                <ProviderButton
                    title="Continue with Google"
                    icon="/images/google-icon.svg"
                    href="/api/auth/google"
                />
                <ProviderButton
                    title="Continue with Apple"
                    icon="/images/apple-icon.svg"
                    href="/api/auth/apple"
                    style='black'
                />

            </form>
            <p>Already an account ?</p>
            <Link href="/register">Sign-in</Link>
            {loading && <p>Loading...</p>}
            { error && <p>{error}</p> }
        </div>
    );
}