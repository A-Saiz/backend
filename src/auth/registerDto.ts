import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";
import { REGEX, REGEX_MESSAGE } from "src/utils/app.utils";

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @Matches(REGEX.PASSWORD_RULE, {message: REGEX_MESSAGE.PASSWORD_RULE_MESSAGE})
    password: string;
}

export default RegisterDto;