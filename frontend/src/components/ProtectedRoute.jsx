import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/useAuthStore.js'
import { Navigate, Outlet } from 'react-router'
import { Spin } from 'antd';

const ProtectedRoute = () => {
    const authStore = useAuthStore()
    const { accessToken, user, loading, refresh, fetchMe } = authStore
    const [starting, setStarting] = useState(true)

    const init = async () => {
        try {
            const hasRefreshCookie = document.cookie
                .split(';')
                .some((cookie) => cookie.trim().startsWith('refreshToken='));

            if (!accessToken) {
                if (!hasRefreshCookie) {
                    return;
                }
                await authStore.refresh()
            }

            if (accessToken && !user) {
                await authStore.fetchMe()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setStarting(false)
        }
    }

    useEffect(() => {
        void init()
    }, [accessToken, user])

    if (starting || loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7ff 0%, #eef2ff 100%)',
                padding: '24px'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '380px',
                    padding: '32px 24px',
                    borderRadius: '20px',
                    background: '#ffffff',
                    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.12)',
                    textAlign: 'center'
                }}>
                    <Spin size="large" />
                    <h3 style={{
                        margin: '16px 0 8px',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#1f2937'
                    }}>
                        Đang tải...
                    </h3>
                    <p style={{
                        margin: 0,
                        color: '#6b7280',
                        fontSize: '14px'
                    }}>
                        Đang kiểm tra trạng thái đăng nhập của bạn.
                    </p>
                </div>
            </div>
        );
    }



    if (!accessToken) {
        return <Navigate to="/signin" replace />
    }
    return (
        <Outlet></Outlet>
    )
}

export default ProtectedRoute