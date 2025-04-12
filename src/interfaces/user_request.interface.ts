import { Request } from 'express';
import { RoleEnum } from 'src/schemas/role.schema';

export interface UserRequest extends Request {
  user: {
    uuid: string;
    role: RoleEnum;
  };
}
