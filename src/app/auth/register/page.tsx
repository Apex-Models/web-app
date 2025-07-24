"use client";
import UserContext from '@/components/context/userContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use, useContext, useEffect, useState } from 'react';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import ProviderButton from '@/components/UI/ProviderButton';
import styles from '../index.module.scss';

export default function Register () {
    const router = useRouter();
    const { login } = useContext(UserContext);

    const [userError, setUserError] = useState("");
    const [userForm, setUserForm] = useState ({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
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
            const response = await fetch(`http://localhost:4003/api/auth/register`, {
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
        if(userForm.email === '' || userForm.password === '') {
            setUserError('Please fill in all fields');
            return;
        } else if(userForm.password.length < 6) {
            setUserError('Password must be at least 6 characters long');
            return;
        } else if(!userForm.email.includes('@')) {
            setUserError('Please enter a valid email address');
            return;
        }
        fetchData();
    };
    
    useEffect(() => {
        if (data?.success && data?.data) {
            login(data.data);
            router.push('/');
        } else if (data?.message) {
            setUserError(data.message || 'Registration failed. Please check your credentials.');
        }
    }, [data]);
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Register</h1>
            <form onSubmit={handleSubmit} className={styles.wrapper}>
                {userError && <p>{userError}</p>}
                <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="firstName"
                    value={userForm.firstName}
                    onChange={(e) => handleChange(e)}
                    isRequired
                />
                <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="lastName"
                    value={userForm.lastName}
                    onChange={(e) => handleChange(e)}
                    isRequired
                />
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
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="confirm password"
                    value={userForm.confirmPassword}
                    onChange={(e) => handleChange(e)}
                    isRequired
                />
                <Button type="submit" title="Register" />
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
                <p className={styles.text}>Not already member ? <Link href="/auth/login" className={styles.link}>login</Link></p>
            </form>
            <div className={styles.terms}>by signing up, you agree to our <a href="/terms" className={styles.link}>terms of service</a> and <a href="/privacy" className={styles.link}>privacy policy</a></div>
        </div>
    );
};