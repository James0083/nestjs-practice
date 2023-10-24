# 2~3. Decorator

> 클래스나 메서드(함수) 앞에 붙여서 역할을 부여
> 

**커스텀 데커레이터 연습해보기

`@Controller()` : 해당 클래스가 컨트롤러 역할, 인수를 prefix로 지정

ex) `@Controller('app')` ⇒ http://localhost:3000/app/hello 로 접근해야함

`@Get()` : get요청 주소 설정

- **와일드카드 사용**
    
    > Routing Path는 와일드 카드를 이용하여 작성할 수 있다.
    > 
    > 
    > 라우팅 문자 위치에 어떤 문자가 와도 됨. 
    > 
    
    `*` , `?` , `+` , `()`
    
    **ex)** `@Get('he*lo')` ⇒ ~/helo, ~/hello, ~/ he__lo 등등이 모두 같은 경로로 요청받아짐
    

`@Delete` : delete요청

`@Param()` : 매개변수를 주입 받을 수 있다. 

- 예시
    
    ```tsx
    @Delete(':userId/memo/:memoId')
    deleteUserMemo(@Param() params: { [key: string]: string }){
    return 'userId: ${params.userId}, memoId: ${params.memoId}';
    }
    
    // #2
    @Delete(':userId/memo/:memoId')
    deleteUserMemo(
    @Param('userId') userId: string,
    @Param('userId') userId: string,
    ){
    return 'userId: ${params.userId}, memoId: ${params.memoId}';
    }
    ```
    

`@Req()` : 클라이언트가 요청할 때 객체(Request)를 받아올 수 있음. 

`@Query()` : 쿼리 매개변수를 받아옴

`@Param(key?: string)` : Path 매개변수 받아옴

`@Body()` : body를 받아옴

`@Header('이름', '값')` : 응답 헤더 구성

`@Redirect(URL, 상태코드)` : URL주소로 리디렉션(Redirection)

- **요청에러 발생**
    
    `throw new BadRequestException('message')`
    
    `throw new NotFoundException('message')`
    

## 하위 도메인 라우팅

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
