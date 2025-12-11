import { UserRole, UserStatus } from 'src/module/user/enums/user.enum';

export class AccessTokenPayload {
  userName: string;
  role: UserRole;
  status: UserStatus;
}
