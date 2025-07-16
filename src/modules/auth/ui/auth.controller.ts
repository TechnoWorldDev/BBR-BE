import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserMapper } from 'src/modules/user/ui/mappers/user.mapper';
import { UserResponse } from 'src/modules/user/ui/response/user-response';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { AcceptInviteCommand } from '../application/commands/accept-invite.command';
import { RequestResetPasswordCommand } from '../application/commands/request-reset-password.command';
import { ResetPasswordCommand } from '../application/commands/reset-password.command';
import { VerifyResetOtpCommand } from '../application/commands/verify-reset-otp.command';
import { GoogleGuard } from '../application/guards/google.guard';
import { LocalAuthGuard } from '../application/guards/local-auth.guard';
import { AcceptInviteCommandHandler } from '../application/handlers/accept-invite.command.handler';
import { RequestPasswordCommandHandler } from '../application/handlers/request-password.command.handler';
import { ResetPasswordCOmmandHandler } from '../application/handlers/reset-password.command.handler';
import { SignUpBuyerCommandHandler } from '../application/handlers/sign-up-buyer.command.handler';
import { SignUpDeveloperCommandHandler } from '../application/handlers/sign-up-developer.command.handler';
import { VerifyResetOtpCommandHandler } from '../application/handlers/verify-reset-otp.command.handler';
import { AcceptInviteRequest } from './request/accept-invite.request';
import { CreateUserRequest } from './request/create-user.request';
import { RequestResetPasswordRequest } from './request/request-reset-password.request';
import { ResetPasswordRequest } from './request/reset-password.request';
import { VerifyOtpRequest } from './request/verify-otp.request';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpDeveloperHandler: SignUpDeveloperCommandHandler,
    private readonly signUpBuyerHandler: SignUpBuyerCommandHandler,
    private readonly requestResetPasswordHandler: RequestPasswordCommandHandler,
    private readonly verifyResetOtpHandler: VerifyResetOtpCommandHandler,
    private readonly resetPasswordHandler: ResetPasswordCOmmandHandler,
    private readonly acceptInviteCommandHandler: AcceptInviteCommandHandler,
    private readonly userMapper: UserMapper,
    private readonly configService: ConfigService
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    return this.userMapper.toResponse(req.user);
  }

  @Post('login/admin')
  @UseGuards(LocalAuthGuard)
  async loginAdmin(@Req() req) {
    return this.userMapper.toResponse(req.user);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(@Req() req, @Res() res) {
    const user = req.user;

    await new Promise<void>((resolve, reject) => {
      req.login(user, (err) => {
        if (err) return reject(new InternalServerErrorException('Login failed'));
        resolve();
      });
    });

    const state = req.query.state as string;

    if (state == 'buyer') {
      return res.redirect(this.configService.get<string>('FRONTEND_URL') + '/buyer/onboarding');
    } else if (state == 'developer') {
      return res.redirect(this.configService.get<string>('FRONTEND_URL') + '/developer/onboarding');
    }

    return res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }

  @Post('signup/developer')
  async signUpDeveloper(@Body() command: CreateUserRequest): Promise<UserResponse> {
    const user = await this.signUpDeveloperHandler.handler(command);
    return this.userMapper.toResponse(user);
  }

  @Post('signup/buyer')
  async signUpBuyer(@Body() command: CreateUserRequest): Promise<UserResponse> {
    const user = await this.signUpBuyerHandler.handler(command);
    return this.userMapper.toResponse(user);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  async getProfile(@Req() req: any) {
    return this.userMapper.toResponse(req.user);
  }

  @Post('request-reset-password')
  async requestResetPassword(@Body() request: RequestResetPasswordRequest) {
    const command = new RequestResetPasswordCommand(request.email);
    const result = await this.requestResetPasswordHandler.handle(command);
    return result;
  }

  @Post('verify-otp')
  async verifyOtp(@Body() request: VerifyOtpRequest) {
    const command = new VerifyResetOtpCommand(request.resetToken, request.otp);
    return await this.verifyResetOtpHandler.handle(command);
  }

  @Post('reset-password')
  async resetPassword(@Body() request: ResetPasswordRequest) {
    const command = new ResetPasswordCommand(request.resetToken, request.newPassword);

    return await this.resetPasswordHandler.handle(command);
  }

  @Post('invite/accept')
  @HttpCode(HttpStatus.OK)
  async acceptInvite(@Body() body: AcceptInviteRequest) {
    const command = new AcceptInviteCommand(body.token, body.password);

    await this.acceptInviteCommandHandler.handle(command);

    return HttpStatus.NO_CONTENT;
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard)
  logout(@Req() req, @Res() res) {
    req.logout(() => {
      req.session.destroy((err) => {
        if (err) throw err;

        res.clearCookie('bbr-session');
        res.json({ message: 'Logged out' });
      });
    });
  }
}
