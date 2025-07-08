"use client";
import UserContext from '@/components/context/userContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use, useContext, useEffect, useState } from 'react';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import ProviderButton from '@/components/UI/ProviderButton';
import styles from './index.module.scss';

export default function Register () {
    const router = useRouter();
    const { login } = useContext(UserContext);

    const [userError, setUserError] = useState("");
    const [userForm, setUserForm] = useState ({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
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
        <div className={styles.wrapper}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    label='firstName:'
                    placeholder="firstName"
                    value={userForm.firstName}
                    onChange={(e) => handleChange(e)}
                    isRequired
                />
                <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    label='lastName'
                    placeholder="lastName"
                    value={userForm.lastName}
                    onChange={(e) => handleChange(e)}
                    isRequired
                />
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label='Email:'
                    placeholder="Enter your email"
                    value={userForm.email}
                    onChange={(e) => handleChange(e)}
                    isRequired
                />
                <Input
                    id="password"
                    name="password"
                    type="password"
                    label='Password:'
                    placeholder="password"
                    value={userForm.password}
                    onChange={(e) => handleChange(e)}
                    isRequired
                />
                <Button type="submit" title="Register" />
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
            <p>Not already member ?</p>
            <Link href="/login">login</Link>
            {userError && <p>{userError}</p>}
        </div>
    );
};