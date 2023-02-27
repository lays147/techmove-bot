import { ScoresCollection } from '@app/scores/documents/scores.documents';
import { UsersCollection } from '@app/users/collections/users.collection';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
    ScoresCollection.collectionName,
    UsersCollection.collectionName,
];
