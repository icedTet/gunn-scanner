export enum UserType  {
  student = 'student',
  teacher = 'teacher',
  admin = 'admin',
  developer = 'developer',
}
export interface User {
  userID:string,
  firstName:string,
  lastName:string,
  role: UserType
}
export interface StudentUser extends User {
  role: UserType.student
  
}
