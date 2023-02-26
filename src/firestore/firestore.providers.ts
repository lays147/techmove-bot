import { ScoresCollection } from './../scores/documents/scores.documents';
import { RegistrationDocument } from 'src/registration/documents/registration.document';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
    RegistrationDocument.collectionName,
    ScoresCollection.collectionName,
];
