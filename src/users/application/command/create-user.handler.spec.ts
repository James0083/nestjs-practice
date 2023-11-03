import * as uuid from 'uuid';
import * as ulid from 'ulid';
import { Test } from '@nestjs/testing';
import { CreateUserHandler } from './create-user.handler';
import { UserFactory } from '../../domain/user.factory';
import { UserRepository } from 'src/users/infra/db/repository/UserRepository';
import { CreateUserCommand } from './create-user.command';
import { UnprocessableEntityException } from '@nestjs/common';

//CreateUserHandler.execute 내에서 uuid와 ulid 라이브러리를 사용한다.
//외부 라이브러리가 생성하는 임의의 문자열이 항상 같은 값('0000-0000-0000-0000', 'ulid')이 나오도록 한다.
jest.mock('uuid');
jest.mock('ulid');
jest.spyOn(uuid, 'v1').mockReturnValue('0000-0000-0000-0000');
jest.spyOn(ulid, 'ulid').mockReturnValue('ulid');

describe('CreateUserHandler', () => {
  // 테스트 대상인 CreateUserHandler와 의존하고 있는 클래스를 선언한다.
  let createUserHandler: CreateUserHandler;
  let userFactory: UserFactory;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        // UserFactory, UserRepository를 모의 객체로 제공한다.
        {
          provide: UserFactory,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    createUserHandler = module.get(CreateUserHandler);
    userFactory = module.get(UserFactory);
    userRepository = module.get('UserRepository');
  });

  // 항상 같은 값을 가지는 변수를 미리 선언하고 재사용하도록 한다.
  const id = ulid.ulid();
  const name = 'YOUR_NAME';
  const email = 'YOUR_EMAIL@gmail.com';
  const password = 'pass1234';
  const signupVerifyToken = uuid.v1();

  describe('execute', () => {
    it('should execute CreateUserCommand', async () => {
      //Given
      // 기본 테스트 케이스를 위해 userRepository에 저장된 유저가 없는 조건을 설정한다.
      userRepository.findByEmail = jest.fn().mockResolvedValue(null);

      //When
      await createUserHandler.execute(
        new CreateUserCommand(name, email, password),
      );

      //Then
      //UserFactory 테스트의 경우에는 테스트 대상 클래스가 의존하고 있는 객체의 함수를 단순히 호출하는지만 검증했다면, 이번에는 인수까지 제대로 넘기고 있는지를 검증한다.
      expect(userRepository.save).toBeCalledWith(
        id,
        name,
        email,
        password,
        signupVerifyToken,
      );
      expect(userFactory.create).toBeCalledWith(
        id,
        name,
        email,
        signupVerifyToken,
        password,
      );
    });

    it('should throw UnprocessableEntityException when user exists', async () => {
      //Given
      // 생성하려는 유저 정보가 이미 저장되어 있는 경우를 모의한다.
      userRepository.findByEmail = jest.fn().mockResolvedValue({
        id,
        name,
        email,
        password,
        signupVerifyToken,
      });

      //When
      //Then
      // 수행 결과 원하는 예외가 발생하는지 검증한다.
      await expect(
        createUserHandler.execute(new CreateUserCommand(name, email, password)),
      ).rejects.toThrowError(UnprocessableEntityException);
    });
  });
});
