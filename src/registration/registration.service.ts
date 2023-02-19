import { RegistrationDto } from './dto/registration.dto';
import { RegistrationDocument } from './documents/registration.document';
import {
    Inject,
    Injectable,
    Logger,
    UnprocessableEntityException,
} from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';

@Injectable()
export class RegistrationService {
    private logger: Logger = new Logger(RegistrationService.name);

    constructor(
        @Inject(RegistrationDocument.collectionName)
        private registrationCollection: CollectionReference<RegistrationDocument>,
    ) {}

    async add(register: RegistrationDto): Promise<RegistrationDocument> {
        try {
            const docRef = this.registrationCollection.doc(register.username);
            await docRef.set({ ...register });
            const registerDoc = await docRef.get();
            const data = registerDoc.data();
            return {
                username: data?.username,
                min: data?.min,
                max: data?.max,
            } as RegistrationDocument;
        } catch (error) {
            this.logger.error(error);
            throw new UnprocessableEntityException(
                'Unable to save data to Firestore.',
            );
        }
    }
}
