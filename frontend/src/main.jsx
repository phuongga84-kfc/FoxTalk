import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConfigProvider } from "antd";
import { TooltipProvider } from './components/ui/tooltip';


createRoot(document.getElementById('root')).render(
  <TooltipProvider>
    <StrictMode>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ff6a00",
            borderRadius: 10,
          }
        }}
      >
        <App />
      </ConfigProvider>
    </StrictMode>
  </TooltipProvider>
)
