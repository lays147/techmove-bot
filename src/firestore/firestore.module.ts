import { Firestore, Settings } from '@google-cloud/firestore';

import { DynamicModule, Module } from '@nestjs/common';

import {
    FirestoreCollectionProviders,
    FirestoreDatabaseProvider,
    FirestoreOptionsProvider,
} from './firestore.providers';

type FirestoreModuleOptions = {
    imports: any[];
    useFactory: (...args: any[]) => Settings;
    inject: any[];
};

@Module({})
export class FirestoreModule {
    static forRoot(options: FirestoreModuleOptions): DynamicModule {
        const optionsProvider = {
            provide: FirestoreOptionsProvider,
            useFactory: options.useFactory,
            inject: options.inject,
        };
        const dbProvider = {
            provide: FirestoreDatabaseProvider,
            useFactory: (config: Settings) => new Firestore(config),
            inject: [FirestoreOptionsProvider],
        };
        const collectionProviders = FirestoreCollectionProviders.map(
            providerName => ({
                provide: providerName,
                useFactory: (db: Firestore) => db.collection(providerName),
                inject: [FirestoreDatabaseProvider],
            }),
        );
        return {
            global: true,
            module: FirestoreModule,
            imports: options.imports,
            providers: [optionsProvider, dbProvider, ...collectionProviders],
            exports: [dbProvider, ...collectionProviders],
        };
    }
}
