<img src="https://companieslogo.com/img/orig/MDB_BIG-ad812c6c.png?t=1648915248" width="50%" title="Github_Logo"/>

# Data API(RESTful API) & Functions

### [&rarr; Create App Service](#create-app-service)

### [&rarr; Data API](#data-api)

### [&rarr; Functions](#functions)

<br>

# Create App Service

- [App 시작](#app-시작)
- [App 환경 설정](#app-환경-설정-optional)
- [인증 활성화](#authentication)
- [Rule 변경](#authorization)

> 이미 App Service를 생성한 경우, 이 과정은 건너뛰고 [Data API](#data-api)부터 시작  
> &nbsp;

## App 시작

![start](img-app/01.app-template.png)

- Atlas UI 상단의 `App Services`탭 지입 후
- `Build your own App` 선택
- `Next` 클릭
  > Atlas UI 좌측 `Data API` 메뉴에서 시작할 수도 있다

<br>

![select](img-app/02.app-sel.png)

- App Service의 데이터 소스(클러스터) 지정
- Application 이름
- CP와 리전 결정 후
  > 현재, App Service에 한국 리전은 제공되지 않는다  
  > Global region: 서비스 설정은 선택한 리전에 저장되지만, request는 요청한 클라이언트의 인접 리전에서 서비스  
  > Single region: 모든 request는 지정한 리전에서만 처리
- `Create App Service` 클릭
- `Welcome to your Application Guides`가 보인다면 그냥 무시(`Close Guides`)

<br>

![dashboard](img-app/03.app-dash.png)

- App dashboard에서 `App ID`를 확인할 수 있다 (Data API endpioint에 사용)

## App 환경 설정 (optional)

> 새로 생성된 App은 환경이 설정돼 있지 않다  
> App의 성격에 따라 다른 환경 변수들을 설정하고 개발에 이용할 수 있다
>
> - Testing
> - Development
> - QA
> - Production
>   &nbsp;  
>   &nbsp;

- `NO ENVIRONMENT` 클릭

<br>

![env](img-app/04.env.png)

- 환경 설정 후 (eg. `Testing`)
- `Save Draft` 클릭
- `Understanding Save and Deploy` 모달에서 `Next` 클릭
- `Got it` 클릭

<br>

![env-rev-deploy](img-app/05.env-rev-deploy.png)

- `REVIEW DRAFT & DEPLOY` 클릭
- `Deployment Draft` 모달에서 `Deploy` 클릭

<br>

![env-deployed](img-app/06.env-deployed.png)

- 상단의 `Deployment was successful!` 배너와
- 좌측 Apps 메뉴에서 `TEST` 환경 변경됨을 확인

## Authentication

![api-key](img-data/06.auth-apikey.png)

- 좌측 `Authentication` 메뉴 진입 후
- 테스트에 가장 만만한 `API Keys`의 `EDIT` 버튼 클릭하여
- `Provider Enabled` 활성화
- `Save Draft` 클릭

<br>

![api-key-deploy](img-data/06.auth-apikey-deploy.png)

- 상단의 `REVIEW DRAFT & DEPLOY` 클릭
- 이후 나타난 `Deployment Draft` 모달에서 `Deploy` 클릭
- 상단에 `Deployment was successful!` 확인 후 `Create API Key` 클릭

<br>

![api-key-create](img-data/06.auth-apikey-create.png)

- `Add New API Key` 모달에서 `Api Key Name` 지정 (eg. `keyedUser`)
- `Create` 클릭

<br>

![api-key-save](img-data/06.auth-apikey-save.png)

- API Key는 다시 확인할 수가 없기 때문에 반드시 생성 후 암기해야 한다
- 혹은, 가끔 암기력이 떨어지는 사람은 복사하여 안전한 장소에 저장하고는 그 사실을 완전히 잊어버리고 항상 새 키를 생성하기도 한다 (본인이면 손~)

## Authorization

> 셋업 시 모든 데이터 소스를 연결했지만 기본 authorization은 모두 `denyAllAccess`이기 때문에  
> I/O를 허용하려면 collection 별로 `Rule` 변경이 필요하다  
> <br>

<br>

![rule](img-data/04.rule.png)

- 좌측 `Rules` 메뉴 진입 후
- `sameple_mflix.movies` collection 선택
- 기본 `denyAllAccess`를 `readAll`로 변경 후
- `Add preset role` 클릭

<br>

![rule-deploy](img-data/05.rule-deploy.png)

- Rule이 `0.readAll` 로 변경 확인 후
- 상단의 `REVIEW DRAFT & DEPLOY` 클릭 후
- 활성화 된 `Deployment Draft` 모달에서 `Deploy` 클릭 후
- 잠시 후 상단에서 `Deployment was successful` 확인

# Data API

> **Requisites**
>
> > [[App Service]](#create-app-service)  
> > [[Postman]](https://www.postman.com/downloads/)
>
> 테스트는 Bearer token 방식 인증을 사용하지않기 때문에 [[Postman web]](https://web.postman.co) 버전을 사용할 수 없다  
> 반드시 로컬 설치버전 필요!!
> <br>

<br>

- [Data API 시작](#enable-data-api)
- [Postman 셋업](#postman)
- [테스트](#run-data-api)

<br>

> [[Data API 공식 매뉴얼]](https://www.mongodb.com/docs/atlas/app-services/data-api/)

## Enable Data API

<br>

![start](img-data/01.start.png)

- 좌측 Apps 내비게이션 패널에서 `HTTPS Endpoints` 메뉴 진입
- 상단 `Data API` 탭 선택 후
- 아래 `Enable the Data API` 클릭

<br>

![config](img-data/02.config.png)

- Endpoint URL가 단일 리전용 `https://<Region>.aws.data.mongodb-api.com/app/<App ID>/endpoint`임을 확인
- Leave all settings unchanged but
- Check `Create User Upon Authentication`
- `Save` 클릭 후
- `REVIEW DRAFT & DEPLOY` 클릭

<br>

![deploy](img-data/03.deploy.png)

- 검토 후 `Deploy` 클릭
- 상단의 `Deployment was successful!` 배너 확인

## Postman

<br>

![pm new ws](img-fn/08.pm-new-ws.png)

- Postman에서 새로운 워크스페이스 생성

<br>

![pm import](img-fn/09.pm-import.png)

- 새로 생성된 워크스페이스에서 `Import` 클릭

<br>

![pm folder](img-fn/10.pm-folder.png)

- 제공된 Atlast Training repo의 `postman` 폴더 오픈

<br>

![pm folder](img-fn/11.pm-import-2.png)

- 제공된 Collections, Global env 모두 선택
- `Import` 클릭

<br>

![pm env](img-fn/12.pm-env.png)

- Import된 설정에서 `Environment` - `Globals` 환경변수 중  
  `appId`, `region`, `apiKey` 가 현재 App Service의 설정 값과 동일한지 확인

## Run Data API

<br>

![run req](img-data/08.req.png)

- `auth-apiKey` collection의 `findOne` request를 실행(`Send`) 후 결과 확인
- 다른 두 requests (`find`, `aggregate`)도 실행 후 결과를 확인한다

# Functions

<br>

- [Custom HTTPs Endpoints 설정](#https-endpoints)
- [Function 정의](#new-funtion)
- [Function 테스트](#query-custom-endpoint)

<br>

> [[Data API 공식 매뉴얼]](https://www.mongodb.com/docs/atlas/app-services/data-api/custom-endpoints/)  
> [[Functions 공식 매뉴얼]](https://www.mongodb.com/docs/atlas/app-services/functions/)

## HTTPs Endpoints

![add endpoint](img-fn/01.add-hep.png)

- 좌측 내비게이션 메뉴의 `HTTPS Endpoints` 진입 후
- `Add An Endpoint` 클릭

<br>

#### ![endpoint url](img-fn/02.add-hep-url.png)

- `Route`로 `/genre` 지정
- Endpoint가 Route를 포함한 단일 리전 URL임을 확인  
  `https://<Region>.aws.data.mongodb-api.com/app/<App ID>/endpoint/<Route>`
- `HTTP Method`로 Data API와 동일하게 `POST` 사용
- `Respond With Result`를 켠다

<br>

#### ![new funtion](img-fn/03.new-fn.png)

- `+ New Function` 선택
  > App Service 전체 메뉴 `Functions`에서 임의의 함수를 추가할 수도 있지만  
  > Custom HTTPs endpoint의 경우 https function template이 제공된다
- `Function Name`을 `getMoviesByGenre`로 지정 후
- `Function` body를 아래 코드로 교체한다

  ```
  // This function is the endpoint's request handler.
  exports = async function({ query, headers, body}, response) {
      let {genre, limit} = query;

      if (limit === undefined) {
        limit = 5;
      } else {
        limit = parseInt(limit)
      }

      const contentTypes = headers["Content-Type"];
      const reqBody = body;

      console.log("genre, limit: ", genre, limit);
      console.log("Content-Type:", JSON.stringify(contentTypes));
      console.log("Request body:", reqBody);

      const doc = await context.services.get("mongodb-atlas")
                        .db("sample_mflix").collection("movies")
                        .find(
          {
            genres: {$in: [genre]}
          }
        ).limit(limit).toArray();
      const res = {
        nMovies: doc.length,
        movies: doc
      }

      return  res;
  };
  ```

  > [[Example]](https://www.mongodb.com/docs/atlas/app-services/data-api/custom-endpoints/#example) 에서는 `request.setBody()`로 결과를 리턴하는 예를 보여주지만  
  > 현재 Function은 `setBody`를 지원하지 않는다  
  > [`Respond With Result`](#endpoint-url)를 켜고 json object를 직접 리턴해야 한다

<br>

![set param](img-fn/04.new-fn-param.png)

- 오른쪽 아래 화살표 버튼을 클릭해서 `Testing Console`을 활성화 시킨 후
- 테스트를 위한 query param을 세팅하고
- `Run` 클릭

<br>

![fn res](img-fn/05.new-fn-res.png)

- `Result` 탭에서 기대했던 결과 확인

<br>

![save](img-fn/06.save.png)

- `Fetch Custom User Data`와
- `Create User Upon Authentication`을 enable 시킨 후
- `Save Draft` 클릭

<br>

- 상단 `REVIEW DRAFT & DEPLOY` 배너 버튼을 클릭 후

<br>

- `Deployment Draft` 모달에서 최종 검토를 하고
- 모달 오른쪽 아래 `Deploy` 버튼 클릭

<br>

- 상단에 `Deployment was successful!` 배너가 나오면 성공

## Query Custom Endpoint

![query custom https endpoint](img-fn/07.query-ep.png)

- Postman Collection `customHTTPsEndpoint`의 `genre` request를 실행한다
- query param, `genra`, `limit` 을 변경해서 검색 조건을 변경할 수 있다
