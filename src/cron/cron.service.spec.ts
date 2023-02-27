import { Test, TestingModule } from '@nestjs/testing';

import { UserDto } from '@app/users/dto/user.dto';
import { UsersService } from '@app/users/users.service';

import { CronService } from './cron.service';

describe('CronService', () => {
    let service: CronService;
    let usersService: UsersService;
    const FIXED_DATE = new Date('2023-01-31');
    let spyDate: jest.SpyInstance;

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
            ],
        }).compile();

        service = module.get<CronService>(CronService);
        usersService = module.get<UsersService>(UsersService);
        spyDate = jest
            .spyOn(global, 'Date')
            .mockImplementation(() => FIXED_DATE);
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
            expect(spyDate).toHaveBeenCalledTimes(1);
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
});
