    import { Test, TestingModule } from '@nestjs/testing';
import { MarketingSolutionsService } from './marketing-solutions.service';
import { IUserRepository } from '../../user/domain/user.repository.interface';
import { IRoleRepository } from '../../role/domain/role.repository.interface';
import { RequestPasswordCommandHandler } from '../../auth/application/handlers/request-password.command.handler';
import { User } from '../../user/domain/user.entity';
import { Residence } from '../../residentmanagement/residence/domain/residence.entity';
import { UserStatusEnum } from '../../../shared/types/user-status.enum';
import { SignupMethodEnum } from '../../../shared/types/signup-method.enum';

describe('MarketingSolutionsService', () => {
  let service: MarketingSolutionsService;
  let userRepository: jest.Mocked<IUserRepository>;
  let roleRepository: jest.Mocked<IRoleRepository>;
  let requestPasswordCommandHandler: jest.Mocked<RequestPasswordCommandHandler>;

  beforeEach(async () => {
    const mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const mockRoleRepository = {
      findByName: jest.fn(),
    };

    const mockRequestPasswordCommandHandler = {
      handle: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketingSolutionsService,
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: IRoleRepository,
          useValue: mockRoleRepository,
        },
        {
          provide: RequestPasswordCommandHandler,
          useValue: mockRequestPasswordCommandHandler,
        },
      ],
    }).compile();

    service = module.get<MarketingSolutionsService>(MarketingSolutionsService);
    userRepository = module.get(IUserRepository);
    roleRepository = module.get(IRoleRepository);
    requestPasswordCommandHandler = module.get(RequestPasswordCommandHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processMarketingLead', () => {
    const testEmail = 'test@example.com';

    it('should create new user and send password reset email when user does not exist', async () => {
      // Mock user not found
      userRepository.findByEmail.mockResolvedValue(null);

      // Mock buyer role
      const mockBuyerRole = { id: 'buyer-role-id', name: 'buyer' };
      roleRepository.findByName.mockResolvedValue(mockBuyerRole);

      // Mock user creation
      const mockCreatedUser = {
        id: 'user-id',
        email: testEmail,
        fullName: '',
        password: '',
        signupMethod: SignupMethodEnum.EMAIL,
        status: UserStatusEnum.INACTIVE,
        roleId: mockBuyerRole.id,
        emailVerified: false,
        agreedTerms: false,
        receiveLuxuryInsights: false,
        notifyLatestNews: false,
        notifyMarketTrends: false,
        notifyBlogs: false,
        pushNotifications: false,
        emailNotifications: true,
      } as User;

      userRepository.create.mockResolvedValue(mockCreatedUser);

      // Mock password reset email
      requestPasswordCommandHandler.handle.mockResolvedValue({ resetToken: 'token' });

      const result = await service.processMarketingLead(testEmail);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(testEmail);
      expect(roleRepository.findByName).toHaveBeenCalledWith('buyer');
      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: testEmail,
        password: '',
        status: UserStatusEnum.INACTIVE,
      }));
      expect(requestPasswordCommandHandler.handle).toHaveBeenCalled();
      expect(result.user).toEqual(mockCreatedUser);
      expect(result.residence).toBeUndefined();
    });

    it('should return existing user when user already exists', async () => {
      // Mock existing user
      const mockExistingUser = {
        id: 'existing-user-id',
        email: testEmail,
        fullName: 'John Doe',
        password: 'hashed-password',
        status: UserStatusEnum.ACTIVE,
        company: { id: 'company-id', name: 'Test Company' },
      } as User;

      userRepository.findByEmail.mockResolvedValue(mockExistingUser);

      const result = await service.processMarketingLead(testEmail);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(testEmail);
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(requestPasswordCommandHandler.handle).not.toHaveBeenCalled();
      expect(result.user).toEqual(mockExistingUser);
    });
  });
}); 