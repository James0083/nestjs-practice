# 2. 웹개발 기초지식

## 2.6 Decorator

> 클래스나 메서드(함수) 앞에 붙여서 역할을 부여
> 

# 3. 인터페이스

## 3.1 컨트롤러

### Nest 구성요소에 대한 약어

> 확인 명령어 : `nest -h`
> 

| name | alias | description |
| --- | --- | --- |
| application | application | Generate a new application workspace |
| class | cl | Generate a new class |
| configuration | config | Generate a CLI configuration file |
| controller | co | Generate a controller declaration |
| decorator | d | Generate a custom decorator |
| filter | f | Generate a filter declaration |
| gateway | ga | Generate a gateway declaration |
| guard | gu | Generate a guard declaration |
| interceptor | itc | Generate an interceptor declaration |
| interface | itf | Generate an interface |
| library | lib | Generate a new library within a monorepo |
| middleware | mi | Generate a middleware declaration |
| module | mo | Generate a module declaration |
| pipe | pi | Generate a pipe declaration |
| provider | pr | Generate a provider declaration |
| resolver | r | Generate a GraphQL resolver declaration |
| resource | res | Generate a new CRUD resource (만들고자 하는 리소스의 CRUD 보일러 플레이트 코드를 한번에 생성) |
| service | s | Generate a service declaration |
| sub-app | app | Generate a new application within a monorepo |

> 명령어 사용 : `$ nest g 명령어 [name]`
> 

### 3.1.1 라우팅

`@Controller()` : 해당 클래스가 컨트롤러 역할, 인수를 prefix로 지정

ex) `@Controller('app')` ⇒ http://localhost:3000/app/hello 로 접근해야함

`@Get()` : get요청 주소 설정

### 3.1.2 **와일드카드 사용**

> Routing Path는 와일드 카드를 이용하여 작성할 수 있다.
> 
> 
> 라우팅 문자 위치에 어떤 문자가 와도 됨. 
> 

`*` , `?` , `+` , `()`

**ex)** `@Get('he*lo')` ⇒ ~/helo, ~/hello, ~/ he__lo 등등이 모두 같은 경로로 요청받아짐

`@Patch()` : patch 요청처리

### 3.1.3 요청 객체

`@Req()` : 클라이언트가 요청할 때 객체(Request)를 받아올 수 있음. 

`@Query()` : 쿼리 매개변수를 받아옴

`@Param(key?: string)` : Path 매개변수 받아옴

`@Body()` : body를 받아옴

### 3.1.4 응답

**CRUD 요청결과**

| 경로 | HTTP 메서드 | 응답 상태 코드 | 본문 |
| --- | --- | --- | --- |
| /users | POST | 201 | This action adds a new user |
| /users | GET | 200 | This action return all users |
| /users/1 | GET | 200 | This action returns a #1 user |
| /users/1 | PATCH | 200 | This action updates a #1 user |
| /users/1 | DELETE | 200 | This action removes a #1 user |

`@Res()` : Express응답 객체를 다룸

`@HttpCode(코드)` : 응답코드를 바꾸고 싶을 때

### 3.1.5 헤더

`@Header('이름', '값')` : 응답 헤더 커스텀 구성

### 3.1.6 리디렉션

`@Redirect(URL, 상태코드)` : URL주소로 리디렉션(Redirection)

- **요청에러 발생**
    
    `throw new BadRequestException('message')`
    
    `throw new NotFoundException('message')`
    

### 3.1.7 라우트 매개변수

`@Delete` : delete요청처리

`@Param()` : 매개변수를 주입 받을 수 있다. 

- 예시
    
    ```jsx
    @Delete(':userId/memo/:memoId')
    deleteUserMemo(@Param() params: { [key: string]: string }){
    return 'userId: ${params.userId}, memoId: ${params.memoId}';
    }
    
    // 라우팅 매개변수가 너무 많지않게 설계하는 것이 좋기 때문에 
    // 따로 받아도 코드가 많이 길어지지는 않는다.
    @Delete(':userId/memo/:memoId')
    deleteUserMemo(
    @Param('userId') userId: string,
    @Param('userId') userId: string,
    ){
    return 'userId: ${params.userId}, memoId: ${params.memoId}';
    }
    ```
    

### 3.1.8 하위 도메인 라우팅

@Controller() 데커레이터는 ControllerOptions객체를 인수로 받는데, host 속성에 하위 도메인을 기술하면 된다. 

```tsx
@Controller({host: 'api.example.com'})  //하위 도메인 요청 처리 설정
export class ApiController {
	@Get() //같은 루트 경로
	index(): string {
		return : "Hello, API"; //다른 응답
	}
}
```

로컬에서 테스트 하기 위해서 api.localhost를 지정하면 cru; 명령어가 제대로 동작하지 않는다.

해결방법(mac) : terminal → sudo vim /etc/hosts → 마지막에 `127.0.0.1	api.localhost` 추가, app.module(app.controller.ts 의 라우팅 경로)에 apiController가 먼저 처리되도록 같은 주소를 쓰는 컨트롤러 앞에 추가한다. 

```tsx
ex)
@Module({
	controllers: [ApiController, AppController],
	...
})
export class AppModule { }
```