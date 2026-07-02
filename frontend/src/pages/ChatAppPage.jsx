import React from 'react'
import Logout from './Logout.jsx'
import { useAuthStore } from '../stores/useAuthStore.js'
const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user)
  return (

    <>
      {user?.displayName}
      <div>ChatAppPage</div>
      <Logout />
    </>


  )
}

export default ChatAppPage