import { ObjectId } from "mongodb";

export enum UserRole {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  USER = "user",
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface MembershipType {
  _id?: string;
  name: string;
  price: number;
  durationMonths: number;
}

// 3. Aktywny Karnet Użytkownika (Tabela łącząca User <-> MembershipType)
export interface ActiveMembership {
  _id?: string;
  userId: string; // FK do User
  membershipTypeId: string; // FK do MembershipType
  typeName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Activity {
  _id?: string;
  name: string;
  date: string;
  capacity: number;
}

// 5. Rezerwacja (Tabela łącząca User <-> Activity)
export interface Reservation {
  _id?: string;
  userId: string; // FK do User
  activityId: string; // FK do Activity
  activityName: string;
  activityDate: string;
  createdAt: string;
}
