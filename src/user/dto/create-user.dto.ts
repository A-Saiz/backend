import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";
import { REGEX, REGEX_MESSAGE } from "src/utils/app.utils";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @MinLength(8)
    @Matches(REGEX.PASSWORD_RULE, {message: REGEX_MESSAGE.PASSWORD_RULE_MESSAGE})
    password: string;
}
