import { UserDto } from '@app/users/dto/user.dto';

const MONTH = new Date().toLocaleString('default', { month: 'long' });

export class ScoresCollection extends UserDto {
    static collectionName = `scores-${MONTH.toLowerCase()}`;
}
