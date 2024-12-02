import { User } from "./user.model";

export interface UserList {
    count: number;
    users: User[];
}