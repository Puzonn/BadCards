export interface User {
  username: string;
  avatarId: string;
  profileColor: string;
  discordId: string;
  lang: string;
  role: "User" | "Guest" | "Admin";
}
