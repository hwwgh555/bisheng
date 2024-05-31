export type User = {
    user_id: number;
    user_name: string;
    role: string | null;
    email: string | null;
    phone_number: string | null;
    dept_id: number | null;
    remark: string | null;
    delete: number;
    create_time: string;
    update_time: string;
};

export type Role = {
  id: number;
  remark: string;
  role_name : string;
  create_time : string;
  update_time : string;
}

export type UserRole = {
    role_id: number
    id: number
    remark: string
    role_name: string
    create_time: string
    update_time: string
}
