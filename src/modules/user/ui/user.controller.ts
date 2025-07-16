import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { CreateUserCommand } from '../application/command/create-user.command';
import { FetchUsersQuery } from '../application/command/fetch-users.query';
import { SendVerificationCommand } from '../application/command/send-verification.command';
import { UpdateUserProfileCommand } from '../application/command/update-user-profile.command';
import { UpdateUserStatusCommand } from '../application/command/update-user-status.command';
import { UpdateUserCommand } from '../application/command/update-user.command';
import { VerificationCommand } from '../application/command/verification.command';
import { CreateUserCommandHandler } from '../application/handler/create-user.command.handler';
import { DeleteUserCommandHandler } from '../application/handler/delete-user.command.handler';
import { SendVerifyEmailCommandHandler } from '../application/handler/send-verify-email.command.handler';
import { UpdateUserCommandHandler } from '../application/handler/update-user-command.handler';
import { UpdateUserProfileCommandHandler } from '../application/handler/update-user-profile.command.handler';
import { UpdateUserStatusCommandHandler } from '../application/handler/update-user-status.command.handler';
import { VerifyEmailCommandHandler } from '../application/handler/verify-email.command.handler';
import { FetchUsersCommandHandler } from '../application/query/fetch-users-command.query';
import { FindByIdUserCommandHandler } from '../application/query/find-by-id-user.command.query';
import { User } from '../domain/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { CreateUserRequest } from './request/create-user.request';
import { UpdateUserProfileRequest } from './request/update-user-profile.request';
import { UpdateUserStatusRequest } from './request/update-user-status.request';
import { UpdateUserRequest } from './request/update-user.request';
import { UserResponse } from './response/user-response';
import { FindByEmailUserQueryHandler } from '../application/query/find-by-email-user.command.query';
import { VerifyPasswordRequest } from './request/verify-password.request';
import { VerifyPasswordCommandHandler } from '../application/handler/verify-password-command.handler';
import { ChangePasswordRequest } from './request/change-password.requst';
import { ChangePasswordCommandHandler } from '../application/handler/change-password-command.handler';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(RBACGuard)
export class UserController {
  constructor(
    private readonly createUserHandler: CreateUserCommandHandler,
    private readonly fetchUsersHandler: FetchUsersCommandHandler,
    private readonly findByIdUserHandler: FindByIdUserCommandHandler,
    private readonly deleteUserHandler: DeleteUserCommandHandler,
    private readonly updateUserHandler: UpdateUserCommandHandler,
    private readonly sendVerifyEmailHandler: SendVerifyEmailCommandHandler,
    private readonly verifyEmailCommandHandler: VerifyEmailCommandHandler,
    private readonly updateUserProfileCommandHandler: UpdateUserProfileCommandHandler,
    private readonly updateUserStatusCommandHandler: UpdateUserStatusCommandHandler,
    private readonly findByEmailUserQueryHandler: FindByEmailUserQueryHandler,
    private readonly verifyPasswordCommandHandler: VerifyPasswordCommandHandler,
    private readonly changePasswordCommandHandler: ChangePasswordCommandHandler,
    private readonly userMapper: UserMapper
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponse })
  @ApiResponse({ status: 400, description: 'Bad request (validation error)' })
  @ApiResponse({ status: 409, description: 'Conflict - Email already exists.' })
  @ApiResponse({ status: 400, description: 'Not Saved - User could not be saved.' })
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  async create(
    @Body() request: CreateUserRequest,
    @CurrentUser() currentUser: User
  ): Promise<UserResponse> {
    const command = new CreateUserCommand(
      request.fullName,
      request.email,
      request.password,
      request.roleId,
      request.signupMethod,
      request.emailNotifications,
      currentUser.id
    );

    const user = await this.createUserHandler.handle(command);
    return this.userMapper.toResponse(user);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserResponse] })
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  async findAll(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('status') status?: UserStatusEnum[],
    @Query('roleId') roleId?: string[]
  ): Promise<{ data: UserResponse[]; pagination: PaginationResponse }> {
    const users = await this.fetchUsersHandler.handle(
      new FetchUsersQuery(query, page, limit, sortBy, sortOrder, status, roleId)
    );

    return {
      data: users.data.map((user) => this.userMapper.toResponse(user)),
      pagination: users.pagination,
    };
  }

  // * Resend verification email
  @HttpCode(HttpStatus.OK)
  @Post(':id/resend-verification-email')
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  async resendVerificationEmail(@Param('id') id: string) {
    const command = new SendVerificationCommand(id);

    await this.sendVerifyEmailHandler.handle(command);
  }

  // * Verify email
  @HttpCode(HttpStatus.OK)
  @Post(':token/verify-email')
  async verifyEmail(@Param('token') token: string, @Req() req): Promise<UserResponse> {
    const command = new VerificationCommand(token);

    const user = await this.verifyEmailCommandHandler.handle(command);

    await new Promise<void>((resolve, reject) => {
      req.login(user, (err) => {
        if (err) return reject(new InternalServerErrorException('Login failed'));
        resolve();
      });
    });

    return this.userMapper.toResponse(user);
  }

  @Post('verify-password')
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.OK)
  async verifyPassword(
    @Body() body: VerifyPasswordRequest,
    @CurrentUser() user: User
  ): Promise<void> {
    return await this.verifyPasswordCommandHandler.handle(user.id, body.currentPassword);
  }

  @Put('change-password')
  @UseGuards(SessionAuthGuard)
  async changePassword(@Body() body: ChangePasswordRequest, @CurrentUser() user: User) {
    return await this.changePasswordCommandHandler.handle(
      user.id,
      body.currentPassword,
      body.newPassword
    );
  }

  // * Profile update
  @Put('me')
  @UseGuards(SessionAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProfile(@Body() body: UpdateUserProfileRequest, @CurrentUser() user: User) {
    const command = new UpdateUserProfileCommand(
      user.id,
      body.fullName,
      body.phoneNumber,
      body.phoneNumberCountryCode,
      body.imageId,
      body.currentLocation,
      body.preferredContactMethod,
      body.preferredResidenceLocation,
      body.budgetRangeFrom,
      body.budgetRangeTo,
      body.unitTypes,
      body.lifestyles,
      body.receiveLuxuryInsights,
      body.notifyLatestNews,
      body.notifyBlogs,
      body.notifyMarketTrends,
      body.pushNotifications,
      body.emailNotifications
    );

    return await this.updateUserProfileCommandHandler.handle(command);
  }

  @Get('by-email')
  @UseGuards(SessionAuthGuard)
  async findByEmail(@Query('email') email: string) {
    const user = await this.findByEmailUserQueryHandler.handle(email);
    return this.userMapper.toResponse(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponse })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  async findOne(@Param('id') id: string): Promise<UserResponse> {
    const user = await this.findByIdUserHandler.handle(id);

    return this.userMapper.toResponse(user);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponse })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'User not updatable.' })
  @ApiResponse({ status: 400, description: 'Not Updated - User could not be updated.' })
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  async update(@Param('id') id: string, @Body() request: UpdateUserRequest): Promise<UserResponse> {
    const command = new UpdateUserCommand(
      id,
      request.fullName,
      request.email,
      request.roleId,
      request.password,
      request.signupMethod,
      request.emailNotifications
    );

    const user = await this.updateUserHandler.handle(command);
    return this.userMapper.toResponse(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Not Updated - User could not be deleted.' })
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteUserHandler.handle(id);
  }

  @ApiOperation({ summary: 'Update user status' })
  @UsePipes(new ValidationPipe())
  @UseGuards(SessionAuthGuard, RBACGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() request: UpdateUserStatusRequest
  ): Promise<void> {
    const command = new UpdateUserStatusCommand(id, request.status);
    return this.updateUserStatusCommandHandler.handle(command);
  }
}
