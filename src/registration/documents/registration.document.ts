import { RegistrationDto } from '../dto/registration.dto';

const MONTH = new Date().toLocaleString('default', { month: 'long' });

export class RegistrationDocument extends RegistrationDto {
    static collectionName = `registration-${MONTH.toLowerCase()}`;
}
