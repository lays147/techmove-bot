import { TeamsCollection } from '@app/teams/collections/teams.collections';
import { UsersCollection } from '@app/users/collections/users.collection';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
    UsersCollection.collectionName,
    TeamsCollection.collectionName,
];
