## [쉬어가기] 요청 생명주기

요청 생명주기(request lifecycle) 혹은 요청/응답 생명주기는 들어온 요청이 어떤 컴포넌트를 거쳐서 처리되고, 생성된 응답은 또 어떤 컴포넌트를 거쳐 처리되는지를 말한다.

어떤 프레임워크를 사용하더라도 요청/응답 생명주기를 알아두는 것은 중요하다.

개발할때나 디버깅할 때 생명주기를 잘 알면 애플리케이션의 동작을 쉽게 이해할 수 있으므로 가능하면 외워두도록 하자.

### 미들웨어

미들웨어의 실행 순서는 정해져 있다.

먼저 전역으로 바인딩된 미들웨어를 실행한다.

이후는 모듈에 바인딩되는 순서대로 실행한다.

다른 모듈에 바인딩되어 있는 미들웨어들이 있으면 먼저 루트 모듈에 바인딩된 미들웨어를 실행하고, imports에 정의한 순서대로 실행한다.

### 가드

가드 역시 전역으로 바인딩된 가드를 먼저 시작한다. 

그리고 컨트롤러에 정의된 순서대로 실행된다. 

아래 코드에서의 예를 들면 Guard1, Guard2, Guard3의 순서로 실행된다.

```tsx
@UseGuards(Guard1, Guard2)
@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService){}
		
	@UseGuards(Guard3)
	@Get()
	getUsers(): Users[] {
		return this.usersService.getUsers();
	}
}
```

### 인터셉터

인터셉터의 실행 순서는 가드와 유사하다. 

다만 한 가지 알아야 할 점은, 인터셉터는 RxJS의 Observable 객체를 반환하는데 이는 요청의 실행 순서와 반대 순서로 동작한다는 점이다. 

즉, 요청은 전역 ⇒ 컨트롤 ⇒ 라우터 순서로 동작하지만, 응답은 라우터 ⇒ 컨트롤러 ⇒ 전역 순으로 동작한다. 

### 파이프

파이프는 동작하는 순서가 조금 독특하다.

파이프가 여러 레벨에 적용되어 있다면 이전과 마찬가지의 순서대로 적용한다.

특이한 점은 파이프가 적용된 라우터의 매개변수가 여러 개 있을 때는 정의한 순서의 역순으로 적용된다는 점이다.

(파이프가 두 개 적용되어있는 코드)

```tsx
@UsePipes(GeneralValidationPipe)
@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}
	
	@UsePipes(RouteSpecificPipe)
	@Patch(':id')
	updateUser(
		@Body() body: UpdateUserDTO,
		@param() params: UpdateUserParams,
		@Query() query: UpdateUserQuery,
	) {
		return this.usersService.updateUser(body, params, query);
	}
}
```

updateUser 함수에는 파이프가 둘 다 적용되었는데 GeneralValidationPipe ⇒ RouteSpecificPipe 순으로 적용된다.

하지만 이들 파이프를 각각 적용하는 updateUser의 매개변수는 query ⇒ params ⇒ body 순으로 적용된다. 

즉, GeneralValidationPipe가 query ⇒ params ⇒ body 의 순서대로 적용되고, 이후 RouteSpecificPipe가 같은 순서대로 적용된다. 

### 예외 필터

유일하게 필터는 전역 필터가 먼저 적용되지 않는다.

**라우터 ⇒ 컨트롤러 ⇒ 전역** 으로 바인딩된 순서대로 동작한다. 

참고로 필터가 예외를 잡으면(catch) 다른 필터가 동일한 예외를 잡을 수 없다.

어떻게 생각하면 당연한 것인데 라우터에 적용된 예외 필터가 이미 예외를 잡아서 처리했는데 전역 예외 필터가 또 잡아서 처리를 할 필요가 없기 때문이다. 

### 일반적인 요청/응답 생명주기

위의 내용을 종합하면 다음과 같다.

![일반적인 요청:응답 생명주기.png](./RequestLifeCycle.png)