import { ScoresCollection } from './../scores/documents/scores.documents';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
    ScoresCollection.collectionName,
];
