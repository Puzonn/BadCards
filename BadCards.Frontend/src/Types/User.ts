export interface User {
  username: string;
  profileColor: string;
  avatarUrl: string;
  userId: string;
  locale: string;
  joinDate: string;
  role: "User" | "Guest" | "Admin";
}
