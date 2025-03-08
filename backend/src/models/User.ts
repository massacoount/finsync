import { UserProfile } from "@finsync/shared";
import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket, UserProfile {
    password: string;
}