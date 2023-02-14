<img src="https://companieslogo.com/img/orig/MDB_BIG-ad812c6c.png?t=1648915248" width="50%" title="Github_Logo"/> <br>


# MongoDB Atlas Hands-on Training

### Index and Aggreagation
생성한 컬렉션에 인덱스를 생성하여 빠른 데이터 엑세스가 되는 것을 확인 합니다.

### Index on Movies

sample_mflix.movies 에서 2000년 이후에 개봉된 영화 중 "Bill Murray"가 출연한 영화 리스트를 검색 하고 제목 순서로 출력 합니다.   

Compass에서 movies 컬렉션을 선택 하고 Explain Plan 에서 실행 합니다.   
````
db.movies.find(
	{
    	"cast":"Bill Murray",
    	"year":{$gte:2000}
	}
).sort(
	{"title":1}
)
````
<img src="/03.index and aggregation/images/image01.png" width="100%" height="100%">     

E-S-R 규칙에 맞추어 인덱스를 생성 하고 Explain에서 개선된 사하을 확인 합니다.


#### Index 생성

테스트를 위해 cast - year - title 순서로 인덱스를 생성 하고 테스트 합니다.   

<img src="/03.index and aggregation/images/image02.png" width="50%" height="50%">     


동일한 쿼리를 수행 하여 봅니다.    

<img src="/03.index and aggregation/images/image03.png" width="90%" height="90%">     

문서 스캔이 Index 스캔으로 변경 되고 기존에 비해 성능이 개선된 것을 확인 합니다.

인덱스를 ESR 순서로 작성합니다. (cast-title-year)   
동일한 쿼리를 실행 하여 플랜을 확인 합니다.    

<img src="/03.index and aggregation/images/image04.png" width="90%" height="90%">     

Projection 항목에 title만을 출력 하도록 하고 Plan을 확인 합니다.


#### Aggregation

Movies 컬렉션에서 장르가 "Comedy" 인 영화 중 포함된 모든 국가를 기준으로 그룹하여 국가별 포함 개수를 "CountriesInComedy" 컬렉션에 데이터를 생성하여 줍니다.  

Aggregation 이 제공하는 Stage 중, Match 를 이용하여 장르가 Comedy인 것을 찾을 수 있으며, 배열로 되어 있는 항목을 개별로 전환은 unwind 를 이용합니다. 국가별로 그룹을 만들기 위해서는 group Stage를 활용 하며 결과 데이터를 컬렉션에 넣기 위해서는 out을 이용 합니다.   

matach
Find와 유사한 형태로 사용 합니다.

````
{$match: 
  {
    genres: 'Comedy',
  }
}
````

unwind
배열을 항목을 지정하면 이를 개별 문서로 전환 하여 줍니다.  

````
{$unwind: 
  {
    path: '$countries',
  }
}
````

group
지정된 필드를 기준으로 그룹하여 줍니다. SQL의 Group by 와 유사 합니다. 그룹에 따른 계산은 그룹별 카운트 한 횟수로 합니다. 

````
{$group: 
  {
    _id: '$countries',
    count: {
      $sum: 1,
    }
  }
}
````

out
입력된 커서를 지정된 컬렉션으로 생성 하여 줍니다.

````
{
    $out: 'countriesByComedy',
}
````

Compass 의 Aggregation에서 Stage를 생성 하여 줍니다.   

match stage 생성 하기   

<img src="/03.index and aggregation/images/image05.png" width="90%" height="90%">     

unwind stage 생성 하기    

<img src="/03.index and aggregation/images/image06.png" width="90%" height="90%">    

group stage 생성 하기    

<img src="/03.index and aggregation/images/image07.png" width="90%" height="90%">     

out stage 생성 하기    

<img src="/03.index and aggregation/images/image08.png" width="90%" height="90%">     

생성된 컬렉션을 확인 합니다. out은 컬렉션을 생성하고 데이터를 생성 하여 줌으로 다시 aggregation을 실행 하기 위해서는 생성된 컬렉션을 삭제하고 실행 해줍니다. (실행 후 작성한 aggregation을 저장하여 줍니다.)

<img src="/03.index and aggregation/images/image09.png" width="100%" height="100%">     


#### Aggregation Node JS 실행 하기

작성한 Aggregation 코드를 Nodejs에서 실행 하도록 개발 합니다. 
개발용 코드는 자동으로 생성 하여 줌으로 이를 이용 하도록 합니다. Compass에서 개발한 aggregation코드를 오픈하여 줍니다.  
메뉴중 "EXPORT TO LANGUAGE"를 클릭 합니다.

<img src="/03.index and aggregation/images/image10.png" width="90%" height="90%">     

개발 언어를 Node를 선택 하여 주고 코드를 복사하여 줍니다.   

<img src="/03.index and aggregation/images/image11.png" width="80%" height="80%">     

application 의 aggregation.js 에 복사한 내용을 붙여 주기 합니다.
컬렉션을 만들지 않고 화면을 출력 하기 위해 out stage 는 생략 하고 작성 합니다.

복사한 내용을 pipeline 으로 작성 합니다.

````
        const pipeline = [
            {
              '$match': {
                'genres': 'Comedy'
              }
            }, {
              '$unwind': {
                'path': '$countries'
              }
            }, {
              '$group': {
                '_id': '$countries', 
                'count': {
                  '$sum': 1
                }
              }
            }
          ];
````

코드를 다음과 같이 실행 하여 줍니다. 실행 전 필요한 모듈을 설치 하여 주고 실행 하여 줍니다.

````
application % npm install

added 196 packages, and audited 197 packages in 2s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
kyudong.kim@Kyudongui-MacBookPro application % node aggregation.js 
Aggregation Records : [object Object]
kyudong.kim@Kyudongui-MacBookPro application % node aggregation.js
ReferenceError: cursor is not defined
    at run (/Users/kyudong.kim/works/group_git/MongoDBAtlasTraining/03.index and aggregation/application/aggregation.js:34:7)
kyudong.kim@Kyudongui-MacBookPro application % node aggregation.js
Error: querySrv ENOTFOUND _mongodb._tcp.***.***.mongodb.net
    at QueryReqWrap.onresolve [as oncomplete] (node:internal/dns/promises:251:17) {
  errno: undefined,
  code: 'ENOTFOUND',
  syscall: 'querySrv',
  hostname: '_mongodb._tcp.***.***.mongodb.net'
}
application % node aggregation.js
{ _id: 'Portugal', count: 14 }
{ _id: 'Cameroon', count: 1 }
{ _id: 'Iraq', count: 1 }
{ _id: 'Italy', count: 477 }
{ _id: 'Romania', count: 25 }
{ _id: 'Germany', count: 442 }
{ _id: 'Iceland', count: 19 }
{ _id: 'Poland', count: 47 }
{ _id: 'Canada', count: 348 }
{ _id: 'Soviet Union', count: 39 }
{ _id: 'Brazil', count: 48 }
{ _id: 'UK', count: 696 }
{ _id: 'East Germany', count: 1 }
{ _id: 'Israel', count: 26 }
{ _id: 'Zaire', count: 1 }
{ _id: 'Cuba', count: 7 }
{ _id: 'Yugoslavia', count: 8 }
{ _id: 'Serbia and Montenegro', count: 5 }
{ _id: 'Albania', count: 1 }
{ _id: 'Japan', count: 171 }
{ _id: 'Spain', count: 197 }
{ _id: 'Czech Republic', count: 41 }
{ _id: 'Ireland', count: 73 }
{ _id: 'Sweden', count: 94 }
{ _id: 'Malta', count: 1 }
{ _id: 'Greece', count: 24 }
{ _id: 'United Arab Emirates', count: 6 }
{ _id: 'Serbia', count: 10 }
{ _id: 'Puerto Rico', count: 3 }
{ _id: 'Montenegro', count: 1 }
{ _id: 'Palestine', count: 1 }
{ _id: 'Liechtenstein', count: 1 }
{ _id: 'West Germany', count: 47 }
{ _id: 'Botswana', count: 2 }
{ _id: 'Colombia', count: 2 }
{ _id: 'Mexico', count: 62 }
{ _id: 'Tajikistan', count: 1 }
{ _id: "Cète d'Ivoire", count: 1 }
{ _id: 'Kazakhstan', count: 1 }
{ _id: 'Monaco', count: 1 }
{ _id: 'Denmark', count: 84 }
{ _id: 'Russia', count: 66 }
{ _id: 'Turkey', count: 23 }
{ _id: 'Latvia', count: 8 }
{ _id: 'Uzbekistan', count: 2 }
{ _id: 'Bolivia', count: 1 }
{ _id: 'Panama', count: 1 }
{ _id: 'Papua New Guinea', count: 1 }
{ _id: 'Iran', count: 13 }
{ _id: 'New Zealand', count: 29 }
{ _id: 'Greenland', count: 1 }
{ _id: 'Netherlands', count: 76 }
{ _id: 'Bulgaria', count: 4 }
{ _id: 'Croatia', count: 10 }
{ _id: 'Faroe Islands', count: 1 }
{ _id: 'Singapore', count: 6 }
{ _id: 'Norway', count: 56 }
{ _id: 'China', count: 50 }
{ _id: 'Slovakia', count: 6 }
{ _id: 'Armenia', count: 2 }
{ _id: 'Luxembourg', count: 20 }
{ _id: 'Austria', count: 33 }
{ _id: 'Chile', count: 7 }
{ _id: 'Indonesia', count: 2 }
{ _id: 'Rwanda', count: 1 }
{ _id: 'Angola', count: 1 }
{ _id: 'Slovenia', count: 6 }
{ _id: 'Jordan', count: 4 }
{ _id: 'Taiwan', count: 28 }
{ _id: 'Tunisia', count: 3 }
{ _id: 'Lebanon', count: 5 }
{ _id: 'Republic of Macedonia', count: 4 }
{ _id: 'Hungary', count: 31 }
{ _id: 'South Korea', count: 49 }
{ _id: 'Belgium', count: 112 }
{ _id: 'Uruguay', count: 6 }
{ _id: 'Finland', count: 104 }
{ _id: 'Bosnia and Herzegovina', count: 2 }
{ _id: 'Saudi Arabia', count: 1 }
{ _id: 'North Korea', count: 1 }
{ _id: 'Ukraine', count: 6 }
{ _id: 'Algeria', count: 1 }
{ _id: 'South Africa', count: 12 }
{ _id: 'India', count: 199 }
{ _id: 'Argentina', count: 54 }
{ _id: 'Egypt', count: 4 }
{ _id: 'Czechoslovakia', count: 21 }
{ _id: 'Philippines', count: 10 }
{ _id: 'Bhutan', count: 1 }
{ _id: 'Thailand', count: 20 }
{ _id: 'Federal Republic of Yugoslavia', count: 8 }
{ _id: 'Estonia', count: 8 }
{ _id: 'Peru', count: 1 }
{ _id: 'Senegal', count: 3 }
{ _id: 'Georgia', count: 3 }
{ _id: 'Australia', count: 148 }
{ _id: 'Malaysia', count: 4 }
{ _id: 'USA', count: 3843 }
{ _id: 'Nigeria', count: 1 }
{ _id: 'Lithuania', count: 2 }
{ _id: 'Qatar', count: 1 }
{ _id: 'Switzerland', count: 49 }
{ _id: 'France', count: 793 }
{ _id: 'Hong Kong', count: 117 }
{ _id: 'Kyrgyzstan', count: 1 }
````

#### Lookup 을 이용한 조인

sample_mflix.comments 와 sample_mflix.users 를 결합하여 데이터를 조회 합니다.    
users의 데이터 중 이름이 "Mercedes Tyler"인 사람을 찾아 그가 게시한 Comments 를 찾습니다.   

해당 데이터를 검색 하면 다음과 같습니다.    
users    
````
{
  "_id": {
    "$oid": "59b99dedcfa9a34dcd78862d"
  },
  "name": "Mercedes Tyler",
  "email": "mercedes_tyler@fakegmail.com",
  "password": "$2b$12$ONDwIwR9NKF1Tp5GjGI12e8OFMxPELoFrk4x4Q3riJGWY6jl/UZAa"
}
````

comments 의 경우 다음과 같습니다.
````
[{
  "_id": {
    "$oid": "5a9427648b0beebeb69579e7"
  },
  "name": "Mercedes Tyler",
  "email": "mercedes_tyler@fakegmail.com",
  "movie_id": {
    "$oid": "573a1390f29313caabcd4323"
  },
  "text": "Eius veritatis vero facilis quaerat fuga temporibus. Praesentium expedita sequi repellat id. Corporis minima enim ex. Provident fugit nisi dignissimos nulla nam ipsum aliquam.",
  "date": {
    "$date": {
      "$numberLong": "1029646567000"
    }
  }
},
...
]
````

Lookup으로 조인을 하여 데이터를 볼 때는 전체 데이터를 조인 하는 것 보다 Match를 이용하여 Join 할 범위를 좁힌 후에 하는 것이 필요 합니다.   

Aggregation을 작성하기 위해 Compass에서 sample_mflix.users를 선택 합니다.  
Aggregation 탭에서 먼저 match 스테이지를 작성 합니다.

Match
````
{$match:
  {
    name:"Mercedes Tyler"
  }
}
````

Lookup 스테이지를 추가하여 줍니다.    
Lookup
````
{$lookup:
  {
    from: "comments",
    localField: "name",
    foreignField: "name",
    as: "Comments"
  }
}
````

<img src="/03.index and aggregation/images/image12.png" width="80%" height="80%">     

결과로 다음과 같이 Comments를 포함한 결과가 보여 집니다.


````
{
  _id: ObjectId("59b99dedcfa9a34dcd78862d"),
  name: 'Mercedes Tyler',
  email: 'mercedes_tyler@fakegmail.com',
  password: '$2b$12$ONDwIwR9NKF1Tp5GjGI12e8OFMxPELoFrk4x4Q3riJGWY6jl/UZAa',
  Comments: [
    {
      _id: ObjectId("5a9427648b0beebeb69579e7"),
      name: 'Mercedes Tyler',
      email: 'mercedes_tyler@fakegmail.com',
      movie_id: ObjectId("573a1390f29313caabcd4323"),
      text: 'Eius veritatis vero facilis quaerat fuga temporibus. Praesentium expedita sequi repellat id. Corporis minima enim ex. Provident fugit nisi dignissimos nulla nam ipsum aliquam.',
      date: 2002-08-18T04:56:07.000Z
    },
    {
      _id: ObjectId("5a9427648b0beebeb6958131"),
      name: 'Mercedes Tyler',
      email: 'mercedes_tyler@fakegmail.com',
      movie_id: ObjectId("573a1392f29313caabcdb8ac"),
      text: 'Dolores nulla laborum doloribus tempore harum officiis. Rerum blanditiis aperiam nemo dignissimos a magni natus. Tenetur suscipit cumque sint dignissimos. Accusantium eveniet consequuntur officia ea.',
      date: 2007-09-21T08:52:00.000Z
    },
    {
      _id: ObjectId("5a9427648b0beebeb69582cb"),
      name: 'Mercedes Tyler',
      email: 'mercedes_tyler@fakegmail.com',
      movie_id: ObjectId("573a1393f29313caabcdbe7c"),
      text: 'Voluptatem ad enim corrupti esse consectetur. Explicabo voluptates quo aperiam deleniti reiciendis. Temporibus aliquid delectus recusandae commodi.',
      date: 2008-05-17T22:55:39.000Z
    },
    {
      _id: ObjectId("5a9427648b0beebeb69582cc"),
      name: 'Mercedes Tyler',
      email: 'mercedes_tyler@fakegmail.com',
      movie_id: ObjectId("573a1393f29313caabcdbe7c"),
      text: 'Fuga nihil dolor veniam repudiandae. Rem debitis ex porro dolorem maxime laborum. Esse molestias accusamus provident unde. Sint cupiditate cumque corporis nulla explicabo fuga.',
      date: 2011-03-01T12:06:42.000Z
    },
    {
      _id: ObjectId("5a9427648b0beebeb69588e6"),
      name: 'Mercedes Tyler',
      email: 'mercedes_tyler@fakegmail.com',
      movie_id: ObjectId("573a1393f29313caabcde00c"),
      text: 'Et quas doloribus ipsum sapiente amet enim optio. Magni odio pariatur quos. Voluptatum error ipsum nemo similique error vel.',
      date: 1971-05-13T02:38:19.000Z
    },
    {
      _id: ObjectId("5a9427648b0beebeb69589a1"),
      name: 'Mercedes Tyler',
      email: 'mercedes_tyler@fakegmail.com',
      movie_id: ObjectId("573a1393f29313caabcde4a8"),
      text: 'Ipsam quos magnam ipsum odio aspernatur voluptas nihil nesciunt. Deserunt magni corporis aperiam. Delectus blanditiis eius molestiae modi velit illo veritatis.',
      date: 2015-12-10T21:26:15.000Z
    },
    {
      _id: ObjectId("5a9427648b0beebeb6958aeb"),
      name: 'Mercedes Tyler',
      email: 'mercedes_tyler@fakegmail.com',
      movie_id: ObjectId("573a1394f29313caabcde63e"),
      text: 'Magnam repudiandae ipsam perspiciatis. Tenetur commodi tenetur dolorem tempora. Quas a quos laboriosam.',
      date: 2007-09-19T02:17:40.000Z
    },
    ...
  ]
}
````
