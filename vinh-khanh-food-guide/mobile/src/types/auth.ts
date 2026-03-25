export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  userId: number;
  username: string;
  role: "ADMIN" | "USER";
}