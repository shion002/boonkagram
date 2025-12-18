export interface Member {
  id: string;
  username: string;
  nickname: string;
  phone: string;
  roles: string[];
  grade: MemberGrade;
  authenticated: boolean;
}

export type MemberGrade = "BASIC" | "VIP" | "ADMIN";

export interface MemberInfoResponse {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  roles: string[];
  authenticated: boolean;
}

export interface MemberRequest {
  username: string;
  password: string;
  phone: string;
  nickname: string;
}
