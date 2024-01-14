export interface User {
  Username: string;
  AvatarId: string;
  ProfileColor: string;
  DiscordId: string;
  Lang: string;
  Role: "User" | "Guest" | "Admin";
}
