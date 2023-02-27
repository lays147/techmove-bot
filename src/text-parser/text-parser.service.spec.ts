import { Test, TestingModule } from '@nestjs/testing';

import { UserDto } from '@app/users/dto/user.dto';

import { TextParserService } from './text-parser.service';

describe('TextParserService', () => {
    let service: TextParserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TextParserService],
        }).compile();

        service = module.get<TextParserService>(TextParserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('test parseUsersScoresToString', () => {
        it('should parse input correctly', () => {
            const user = new UserDto();
            user.username = 'testuser';
            const users = [user];
            const response = service.parseUsersScoresToString(users);
            expect(response).toBeDefined();
        });
    });
    describe('test parseChickensToString', () => {
        it('should parse input correctly', () => {
            const users: string[] = ['testuser'];
            const response = service.parseChickensToString(users);
            expect(response).toBeDefined();
        });
    });

    describe('test parseTeamsScoresToString', () => {
        it('should parse input correctly', () => {
            const teams: TeamsInterface = { A: 10 };
            const response = service.parseTeamsScoresToString(teams);
            expect(response).toBeDefined();
        });
    });
});
