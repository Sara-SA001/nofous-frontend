export interface User {
  id: number;
  nationalId: string;
  firstName: string;
  nisba?: string;
  fatherName: string;
  grandfatherName?: string;
  motherName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  governorate: string;
  amanah?: string;
  registrationPlace: string;
  registrationNumber: string;
  registrationDate: string;
  issueDate?: string;
  gender: 'MALE' | 'FEMALE';
  religion: 'MUSLIM' | 'CHRISTIAN' | 'OTHER';
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  cardNumber?: string;
  personalPhoto?: string;
  idFrontPhoto?: string;
  idBackPhoto?: string;
  fatherId?: number;
  husbandId?: number;
  isAlive?: boolean;
  role: 'user' | 'admin' | 'sub_admin';
  adminPermissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  requests?: any[];
  data?: T;
  error?: string;
}

