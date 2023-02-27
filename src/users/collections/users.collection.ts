import { CURRENT_MONTH } from '@app/constants';
import { UserDto } from '@app/users/dto/user.dto';

export class UsersCollection extends UserDto {
    static collectionName = `users-${CURRENT_MONTH}`;
}
