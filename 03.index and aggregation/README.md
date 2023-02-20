<img src="https://companieslogo.com/img/orig/MDB_BIG-ad812c6c.png?t=1648915248" width="50%" title="Github_Logo"/> <br>


# MongoDB Atlas Hands-on Training

## Index and Aggreagation
생성한 컬렉션에 인덱스를 생성하여 빠른 데이터 엑세스가 되는 것을 확인 합니다.

### [&rarr; Index on Movies](#Index)

### [&rarr; Aggregation](#Aggregation)

### [&rarr; Lookup 을 이용한 조인](#Lookup)

### [&rarr; 추가 Aggregation](#option)

<br>


### Index

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

No index available for this query 로 인덱스가 사용 되지 않은 것을 확인 할 수 있으며 Dcouments Examined의 갯수가 23530으로 전체 문서가 스캔 된 것을 확인 할 수 있습니다.    
또한 Documnets Returned 가 12인 것으로 전체 문서 중 12개 문서가 리턴된 것으로 12개 문서를 찾기 위해 23530 문서를 검색한 것으로 비효율적인 것을 알 수 있습니다.

E-S-R 규칙에 맞추어 인덱스를 생성 하고 Explain에서 개선된 사항을 확인 합니다.


#### Index 생성

테스트를 위해 cast - year - title 순서로 인덱스를 생성 하고 테스트 합니다.   

<img src="/03.index and aggregation/images/image02.png" width="50%" height="50%">     


동일한 쿼리를 수행 하여 봅니다.    

<img src="/03.index and aggregation/images/image03.png" width="90%" height="90%">     

문서 스캔이 Index 스캔으로 변경 되고 기존에 비해 성능이 개선된 것을 확인 합니다.  

첫 번째에서 IXSCAN으로 생성한 인덱스를 이용하여 12개의 문서가 검색된 것을 확인 할 수 있습니다. 이후 정렬 과정을 거친 후 데이터가 반환 되는 것을 확인 할 수 있습니다. 

인덱스를 ESR 순서로 작성합니다. (cast-title-year)   
동일한 쿼리를 실행 하여 플랜을 확인 합니다.    

<img src="/03.index and aggregation/images/image04.png" width="90%" height="90%">     

Projection 항목에 title만을 출력 하도록 하고 Plan을 확인 합니다.


### Aggregation

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

### Lookup

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



### option
#### Aggregation Group 
다음과 같은 과일 판매 데이터가 있을 때 일자별로 판매된 과일과 총 판매 금액을 계산 합니다.

````
db.sales.insertMany([
{ "_id" : 1, "item" : "apple", "price" : 10, "quantity" : 2, "date" : ISODate("2023-01-01T08:00:00Z") },
{ "_id" : 2, "item" : "grape", "price" : 20, "quantity" : 1, "date" : ISODate("2023-02-03T09:00:00Z") },
{ "_id" : 3, "item" : "melon", "price" : 5, "quantity" : 5, "date" : ISODate("2023-02-03T09:05:00Z") },
{ "_id" : 4, "item" : "apple", "price" : 10, "quantity" : 10, "date" : ISODate("2023-02-15T08:00:00Z") },
{ "_id" : 5, "item" : "melon", "price" : 5, "quantity" : 10, "date" : ISODate("2023-02-15T09:12:00Z") }
])

````

일자 데이터를 기준으로 그룹을 생성하고 accumulation 으로 addToSet, sum 을 이용합니다.

````
db.sales.aggregate(
   [
     {
       $group:
         {
           _id: { day: { $dayOfYear: "$date"}, year: { $year: "$date" } },
           itemsSold: { $addToSet: "$item" },
           total_price: {$sum: "$price"}
         }
     }
   ]
)

{
  _id: {
    day: 34,
    year: 2023
  },
  itemsSold: [
    'grape',
    'melon'
  ],
  total_price: 25
}
{
  _id: {
    day: 46,
    year: 2023
  },
  itemsSold: [
    'melon',
    'apple'
  ],
  total_price: 15
}
{
  _id: {
    day: 1,
    year: 2023
  },
  itemsSold: [
    'apple'
  ],
  total_price: 10
}
````
#### Aggregation Bucket
화가의 프로파일 정보에서 태어난 년도를 기준으로 하여 그룹을 생성 합니다. 년도는 10년을 기준으로 집계 합니다. 즉 1840 ~1850 년으로 집계 합니다.

````
db.artists.insertMany([
  { "_id" : 1, "last_name" : "Bernard", "first_name" : "Emil", "year_born" : 1868, "year_died" : 1941, "nationality" : "France" },
  { "_id" : 2, "last_name" : "Rippl-Ronai", "first_name" : "Joszef", "year_born" : 1861, "year_died" : 1927, "nationality" : "Hungary" },
  { "_id" : 3, "last_name" : "Ostroumova", "first_name" : "Anna", "year_born" : 1871, "year_died" : 1955, "nationality" : "Russia" },
  { "_id" : 4, "last_name" : "Van Gogh", "first_name" : "Vincent", "year_born" : 1853, "year_died" : 1890, "nationality" : "Holland" },
  { "_id" : 5, "last_name" : "Maurer", "first_name" : "Alfred", "year_born" : 1868, "year_died" : 1932, "nationality" : "USA" },
  { "_id" : 6, "last_name" : "Munch", "first_name" : "Edvard", "year_born" : 1863, "year_died" : 1944, "nationality" : "Norway" },
  { "_id" : 7, "last_name" : "Redon", "first_name" : "Odilon", "year_born" : 1840, "year_died" : 1916, "nationality" : "France" },
  { "_id" : 8, "last_name" : "Diriks", "first_name" : "Edvard", "year_born" : 1855, "year_died" : 1930, "nationality" : "Norway" }
])
````

태어난 년도를 기준으로 하여 집계를 위해서 bucket을 이용하여 groupBy 항목으로 year_born을 하여 줍니다. 태어난 년도의 집계는 10년을 기준으로 category화는 boundaries레 작성 기준을 작성하여 줍니다. 

````
db.artists.aggregate( [
  {
    $bucket: {
      groupBy: "$year_born",                        // Field to group by
      boundaries: [ 1840, 1850, 1860, 1870, 1880 ], // Boundaries for the buckets
      default: "Other",                             // Bucket ID for documents which do not fall into a bucket
      output: {                                     // Output for each bucket
        "count": { $sum: 1 },
        "artists" :
          {
            $push: {
              "name": { $concat: [ "$first_name", " ", "$last_name"] },
              "year_born": "$year_born"
            }
          }
      }
    }
  }
] )


{
  _id: 1840,
  count: 1,
  artists: [
    {
      name: 'Odilon Redon',
      year_born: 1840
    }
  ]
}
{
  _id: 1850,
  count: 2,
  artists: [
    {
      name: 'Vincent Van Gogh',
      year_born: 1853
    },
    {
      name: 'Edvard Diriks',
      year_born: 1855
    }
  ]
}
{
  _id: 1860,
  count: 4,
  artists: [
    {
      name: 'Emil Bernard',
      year_born: 1868
    },
    {
      name: 'Joszef Rippl-Ronai',
      year_born: 1861
    },
    {
      name: 'Alfred Maurer',
      year_born: 1868
    },
    {
      name: 'Edvard Munch',
      year_born: 1863
    }
  ]
}
{
  _id: 1870,
  count: 1,
  artists: [
    {
      name: 'Anna Ostroumova',
      year_born: 1871
    }
  ]
}

````

#### Aggregation Unwind
다음과 같은 의류 정보가 있을 때 의류를 기준으로 가능한 사이즈 정보가 배열화 되어 있습니다. 각 사이즈를 구분하여 문서화를 합니다.    
사이즈가 없는 의류들은 이를 포함 함니다.

````
db.clothing.insertMany([
  { "_id" : 1, "item" : "Shirt", "sizes": [ "S", "M", "L"] },
  { "_id" : 2, "item" : "Shorts", "sizes" : [ ] },
  { "_id" : 3, "item" : "Hat", "sizes": "M" },
  { "_id" : 4, "item" : "Gloves" },
  { "_id" : 5, "item" : "Scarf", "sizes" : null }
])
````
배열로 되어 있는 값을 하나의 문서로 만들어 주기 위해 unwind를 사용합니다. 기본적으로 지정된 array (size)에 값이 없는 경우 연산에서 제외 합니다. 이를 포함하도록 하는 옵션은 preserveAndEmptyArrays입니다.


````

db.clothing.aggregate( [
   { $unwind: { path: "$sizes", preserveNullAndEmptyArrays: true } }
] )

{
  _id: 1,
  item: 'Shirt',
  sizes: 'S'
}
{
  _id: 1,
  item: 'Shirt',
  sizes: 'M'
}
{
  _id: 1,
  item: 'Shirt',
  sizes: 'L'
}
{
  _id: 2,
  item: 'Shorts'
}
{
  _id: 3,
  item: 'Hat',
  sizes: 'M'
}
{
  _id: 4,
  item: 'Gloves'
}
{
  _id: 5,
  item: 'Scarf',
  sizes: null
}
````


#### 좌표 정보 검색
sample_airbnb.listingsAndReviews 컬렉션에는 숙박 시설 정보를 가진 문서이며 해당 숙박시설의 지리 정보가 좌표로 입력 되어 있습니다. (address.location)  마드리드 공항을 기준으로 가장 가까운 숙박 시설을 검색 합니다.  마드리드 공항의 좌표 정보는 -3.56744, 40.49845 이며 검색하려는 숙박 시설을 Hotel 과 Apartments 입니다. 보는 데이터는 숙박 시설의 이름과 주소, 떨어진 거리, 금액으로 합니다. (name, property_type, summary, address, price)

검색은 geoNear 스테이지를 이용하여 검색 하며 전체 데이터중 보고자 하는 필드만을 제한 하기 위해 project 스테이지를 사용 합니다.


````
db.listingsAndReviews.aggregate( [
   { $geoNear: {
  near: { type: 'Point', coordinates: [ -3.56744, 40.49845]},
  distanceField:"distance",
  key:"address.location",
  query: {property_type: {$in: ["Hotel","Apartment"]}},
  spherical: true
} },
{ $project: {name:1, property_type:1, 
summary:1, address:1, 
price:1, distance:1}
}
] )

{
  _id: '18426634',
  name: 'Private room',
  summary: 'Intermarche',
  property_type: 'Apartment',
  price: Decimal128("78.00"),
  address: {
    street: 'Porto, Porto, Portugal',
    suburb: '',
    government_area: 'Canedo, Vale e Vila Maior',
    market: 'Porto',
    country: 'Portugal',
    country_code: 'PT',
    location: {
      type: 'Point',
      coordinates: [
        -8.4022,
        41.00962
      ],
      is_location_exact: false
    }
  },
  distance: 411593.1181197846
}
{
  _id: '21883829',
  name: 'Terraço',
  summary: `La maison dispose de 4 chambres et un canapé-lit, est bon pour le repos et est situé dans un quartier calme et magnifique. Il est proche de la plage d'Espinho et si vous préférez visiter une zone naturelle, nous avons les "Passadiços de Arouca", c'est une zone très belle et relaxante. Ici, dans ce village, nous avons aussi un excellent restaurant qu'ils dépensent des repas économiques et très bons.`,
  property_type: 'Apartment',
  price: Decimal128("40.00"),
  address: {
    street: 'Aveiro, Aveiro, Portugal',
    suburb: '',
    government_area: 'Lobão, Gião, Louredo e Guisande',
    market: 'Porto',
    country: 'Portugal',
    country_code: 'PT',
    location: {
      type: 'Point',
      coordinates: [
        -8.45777,
        40.98082
      ],
      is_location_exact: true
    }
  },
  distance: 415895.69466630125
}
{
  _id: '23391765',
  name: 'Cozy Flat, São João da Madeira',
  summary: 'Um apartamento com quarto de cama de casal, wc’s privativos, sala e cozinha, equipado com tudo que precisa. Uma excelente opção para amantes de caminhadas, cultura e lazer. Se o seu motivo de visita for meramente profissional vai sentir-se em casa. Situa-se junto dos serviços e comércios necessários e a área é servida por transportes públicos.  Para além de São João da Madeira, poderá visitar Santa Maria da Feira e Estarreja em poucos minutos. Localiza-se a cerca de 45 km do Porto e Aveiro.',
  property_type: 'Apartment',
  price: Decimal128("45.00"),
  address: {
    street: 'São João da Madeira, Aveiro, Portugal',
    suburb: '',
    government_area: 'São João da Madeira',
    market: 'Porto',
    country: 'Portugal',
    country_code: 'PT',
    location: {
      type: 'Point',
      coordinates: [
        -8.48714,
        40.895
      ],
      is_location_exact: true
    }
  },
  distance: 417500.0627241467
}
{
  _id: '30341193',
  name: 'Recanto agua',
  summary: 'No meio da cidade, da para andar sempre a pé.',
  property_type: 'Apartment',
  price: Decimal128("25.00"),
  address: {
    street: 'São João da Madeira, Aveiro, Portugal',
    suburb: '',
    government_area: 'São João da Madeira',
    market: 'Porto',
    country: 'Portugal',
    country_code: 'PT',
    location: {
      type: 'Point',
      coordinates: [
        -8.49682,
        40.89102
      ],
      is_location_exact: true
    }
  },
  distance: 418278.04115931864
}
````