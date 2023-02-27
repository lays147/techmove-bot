export class UserDto {
    username: string;
    team: string = 'Não definido';
    total_of_days: number = 0;
    days_in_row: number = 0;
    extra_points: number = 0;
    total_points: number = 0;
    min: number = 1;
    max: number = 7;
}
