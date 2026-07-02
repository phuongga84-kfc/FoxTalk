import React from 'react'
import { Button } from 'antd'
import { useAuthStore } from '../stores/useAuthStore'
import { useNavigate } from 'react-router'

const Logout = () => {
    const { signOut } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error(error)
        } finally {
            navigate('/signin')
        }
    }

    return (
        <div style={{ padding: 24 }}>
            <Button
                type="primary"
                danger
                onClick={handleLogout}
                style={{ minWidth: 140 }}
            >
                Đăng xuất
            </Button>
        </div>
    )
}

export default Logout