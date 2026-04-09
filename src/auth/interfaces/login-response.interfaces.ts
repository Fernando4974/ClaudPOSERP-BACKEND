export interface LoginResponse {
  message: string;
  token: string;
  userRoles: string[];
  user_name: string;
}
