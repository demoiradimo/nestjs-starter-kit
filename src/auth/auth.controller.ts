import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignInRequestDTO, SignUpRequestDTO } from './dto';
import { UsersService, UserEntity } from '../users';
import { AuthResponseDTO } from './dto';
import { AuthService } from './auth.service';
import { LocalGuard, JWTGuard } from './guards';
import { EmailVerificationService } from './email-verification.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private verificationService: EmailVerificationService
  ) {}

  @UseGuards(LocalGuard)
  @Post('sign-in')
  async login(
    @Body() dto: SignInRequestDTO,
    @Request() request,
  ): Promise<AuthResponseDTO> {
    const { id } = request.user as UserEntity;
    const token = await this.authService.createToken({ id });

    return { token };
  }

  @Post('sign-up')
  async register(@Body() dto: SignUpRequestDTO): Promise<AuthResponseDTO> {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { passwordConfirmation, ...data } = dto;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const { id, email } = await this.usersService.create(data);
    const token = await this.authService.createToken({ id });
    await this.verificationService.sendVerificationLink(email);

    return { token };
  }

  @UseGuards(JWTGuard)
  @Get('user')
  user(@Request() request) {
    return request.user;
  }
}
