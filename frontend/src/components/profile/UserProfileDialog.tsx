import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserAvatar from "@/components/chat/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { useProfileStore } from "@/stores/useProfileStore";
import { useSocketStore } from "@/stores/useSocketStore";
import { Mail, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";

const UserProfileDialog = () => {
  const { open, user, closeProfile } = useProfileStore();
  const { onlineUsers } = useSocketStore();

  if (!user) return null;

  const isOnline = onlineUsers.includes(user._id);

  return (
    <Dialog open={open} onOpenChange={closeProfile}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0">

        {/* Header */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="-mt-14 px-6 pb-6">

          <div className="flex justify-center">
            <UserAvatar
              type="profile"
              name={user.displayName}
              avatarUrl={user.avatarUrl}
              className="ring-4 ring-white shadow-lg"
            />
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold">
              {user.displayName}
            </h2>

            <p className="text-muted-foreground">
              @{user.username}
            </p>

            <Badge
              className={cn(
                "mt-3",
                isOnline
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-700"
              )}
            >
              {isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
            </Badge>
          </div>

          {user.bio && (
            <div className="mt-6 rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                {user.bio}
              </p>
            </div>
          )}

          <div className="mt-6 space-y-4">

            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted-foreground" />

              <span>{user.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="size-4 text-muted-foreground" />

              <span>{user.phone || "Chưa cập nhật"}</span>
            </div>

            <div className="flex items-center gap-3">
              <User className="size-4 text-muted-foreground" />

              <span>@{user.username}</span>
            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;