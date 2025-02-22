import { Reflector } from '@nestjs/core';
import { Role } from 'src/schemas/role.schema';

export const Roles = Reflector.createDecorator<Role[]>();
