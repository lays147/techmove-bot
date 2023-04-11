// const FIXED_DATE = new Date('2023-01-31'); (timestamp 1675123200000)
// jest.useFakeTimers({ now: FIXED_DATE });
// ^ This does not stays here because of prettier formatting
// Then I configured this in package.json jest fakeTimers now config
import { Test, TestingModule } from '@nestjs/testing';

import { TeamsService } from '@app/teams/teams.service';
import { UserDto } from '@app/users/dto/user.dto';
import { UsersService } from '@app/users/users.service';

import { CronService } from './cron.service';

describe('CronService', () => {
    let service: CronService;
    let usersService: UsersService;
    let teamsService: TeamsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CronService,
                {
                    provide: UsersService,
                    useValue: {
                        getAllUsers: jest.fn(),
                        updateUser: jest.fn(),
                    },
                },
                {
                    provide: TeamsService,
                    useValue: {
                        updateTeamScore: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CronService>(CronService);
        usersService = module.get<UsersService>(UsersService);
        teamsService = module.get<TeamsService>(TeamsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('test getPunishmentScore', () => {
        it.each([
            { date: '03-01-2023', expected: 21 },
            { date: '10-01-2023', expected: 14 },
            { date: '17-01-2023', expected: 7 },
            { date: '24-01-2023', expected: 1 },
            { date: '28-01-2023', expected: 0 },
        ])('should return $expected', async ({ date, expected }) => {
            const response = service.getPunishmentScore(date);
            expect(response).toBe(expected);
        });
    });

    describe('test nonActivitiyPunisher', () => {
        it.each([
            { last_exercise_date: '03-01-2023', total_points: -21 },
            { last_exercise_date: '10-01-2023', total_points: -14 },
            { last_exercise_date: '17-01-2023', total_points: -7 },
            { last_exercise_date: '24-01-2023', total_points: -1 },
        ])(
            'should punish user with $total_points',
            async ({ last_exercise_date, total_points }) => {
                const user = new UserDto();
                user.username = 'testUser';
                user.last_day_of_training = last_exercise_date;

                const spyGet = jest
                    .spyOn(usersService, 'getAllUsers')
                    .mockResolvedValueOnce([user]);

                const spyUpdate = jest.spyOn(usersService, 'updateUser');
                const spyUser: UserDto = user;
                spyUser.total_points = total_points;
                await service.nonActivitiyPunisher();
                expect(spyGet).toHaveBeenCalledTimes(1);
                expect(spyUpdate).toHaveBeenCalledTimes(1);
                expect(spyUpdate).toHaveBeenCalledWith(spyUser);
            },
        );
        it('shouldnt punish user', async () => {
            const user = new UserDto();
            user.username = 'testUser';
            user.last_day_of_training = '28-01-2023';

            const spyGet = jest
                .spyOn(usersService, 'getAllUsers')
                .mockResolvedValueOnce([user]);
            const spyUpdate = jest.spyOn(usersService, 'updateUser');
            await service.nonActivitiyPunisher();
            expect(spyGet).toHaveBeenCalledTimes(1);
            expect(spyUpdate).not.toHaveBeenCalled();
        });
    });

    describe('test nonActivityTeamPunisher', () => {
        it('should punish team because no one exercised in the day', async () => {
            const users: UserDto[] = [];
            for (let index = 0; index < 5; index++) {
                const user = new UserDto();
                user.username = 'testUser';
                user.team = 'A';
                user.last_day_of_training = '30-01-2023';
                users.push(user);
            }
            const spyGet = jest
                .spyOn(usersService, 'getAllUsers')
                .mockResolvedValueOnce(users);
            const spyUpdate = jest.spyOn(teamsService, 'updateTeamScore');
            await service.nonActivityTeamPunisher();
            expect(spyGet).toHaveBeenCalledTimes(1);
            expect(spyUpdate).toHaveBeenCalledWith('A', -1);
        });
        it('should not punish team because at least one exercised in the day', async () => {
            const users: UserDto[] = [];
            for (let index = 0; index < 5; index++) {
                const user = new UserDto();
                user.username = 'testUser';
                user.team = 'A';
                user.last_day_of_training = '30-01-2023';
                users.push(user);
            }
            const spyGet = jest
                .spyOn(usersService, 'getAllUsers')
                .mockResolvedValueOnce(users);
            const spyUpdate = jest.spyOn(teamsService, 'updateTeamScore');
            await service.nonActivityTeamPunisher();
            expect(spyGet).toHaveBeenCalledTimes(1);
            expect(spyUpdate).not.toHaveBeenCalled();
        });
    });
});
