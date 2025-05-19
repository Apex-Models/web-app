"use client";
import UserContext from '@/components/context/userContext';
import useFetch from '@/components/hooks/useFetch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

export default function Login () {
    const router = useRouter();
    const { login } = useContext(UserContext);

    const [userError, setUserError] = useState("");
    const [userForm, setUserForm] = useState ({
        email: '',
        password: '',
    });
    
    const { fetchData, data, error, loading } = useFetch({ url: 'auth/login', method: 'POST', body: userForm });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserForm({ ...userForm, [e.target.name]: e.target.value});
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if(userForm.email === '' || userForm.password === '') {
            setUserError('Please fill in all fields');
            return;
        } else if(!userForm.email.includes('@')) {
            setUserError('Please enter a valid email address');
            return;
        }
        fetchData();
    };

    useEffect(()=> {
        if (data?.success && data?.data) {
            login(data.data);
            router.push('/');
        } else if (data?.message) {
            setUserError(data.message || 'Login failed. Please check your credentials.');
        }
    }, [data]);

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <a href='http://localhost:3030/api/auth/google'>Login with Google</a>
            <p>Already an account ?</p>
            <Link href="/register">Sign-in</Link>
            {userError && <p>{userError}</p>}
        </div>
    );
}