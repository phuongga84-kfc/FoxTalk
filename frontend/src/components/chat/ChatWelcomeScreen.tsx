import React from "react";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";
import logo from "/logo.png"; // logo FoxTalk

const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex h-full w-full flex-col bg-transparent">
      <ChatWindowHeader />

      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-background">
        {/* Background */}
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 flex max-w-xl flex-col items-center px-6 text-center gap-5">
          {/* Logo */}
          <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-400 to-violet-600 shadow-2xl">
            <img src={logo} alt="FoxTalk" className="h-24 w-24 rounded-full" />
          </div>

          {/* Title */}
          <h1 className="bg-gradient-to-r from-orange-500 to-violet-600 bg-clip-text text-4xl font-extrabold text-transparent">
            Chào mừng đến với FoxTalk
          </h1>

          <p className="mt-4 max-w-md text-muted-foreground">
            <span className="hidden lg:inline">
              Chọn một cuộc trò chuyện ở thanh bên trái hoặc bắt đầu cuộc trò
              chuyện mới để kết nối với mọi người.
            </span>

            <span className="inline lg:hidden">
              Chọn một cuộc trò chuyện hoặc tạo cuộc trò chuyện mới để bắt đầu.
            </span>
          </p>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWelcomeScreen;
