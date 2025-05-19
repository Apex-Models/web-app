"use client";
import UserContext from '@/components/context/userContext';
import useFetch from '@/components/hooks/useFetch';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use, useContext, useEffect, useState } from 'react';

export default function Register () {
    const router = useRouter();
    const { login } = useContext(UserContext);

    const [userError, setUserError] = useState("");
    const [userForm, setUserForm] = useState ({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    
    const { fetchData, data, error, loading } = useFetch({ url: 'auth/register', method: 'POST', body: userForm });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserForm({ ...userForm, [e.target.name]: e.target.value});
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
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userForm.email}
                        onChange={(e) => handleChange(e)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="firstName">firstName:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={userForm.firstName}
                        onChange={(e) => handleChange(e)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">lastName:</label>
                    <input
                        type="text"
                        id="lastName"
                        name='lastName'
                        value={userForm.lastName}
                        onChange={(e) => handleChange(e)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={userForm.password}
                        onChange={(e) => handleChange(e)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <a href='http://localhost:3030/api/auth/google'>Register with Google</a>
            <p>Not already member ?</p>
            <Link href="/login">login</Link>
            {userError && <p>{userError}</p>}
        </div>
    );
};