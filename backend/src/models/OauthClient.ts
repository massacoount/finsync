import { RowDataPacket } from "mysql2";

export interface OAuthClient extends RowDataPacket {
  clientId: string;
  clientSecret: string;
}
