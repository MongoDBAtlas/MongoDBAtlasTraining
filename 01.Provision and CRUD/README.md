<img src="https://companieslogo.com/img/orig/MDB_BIG-ad812c6c.png?t=1648915248" width="50%" title="Github_Logo"/> <br>


# MongoDB Atlas Hands-on Training

### [&rarr; Cluster Provision](#Provision)

### [&rarr; CRUD with Nodejs](#CRUD)

### [&rarr; CRUD with Mongosh](#MONGOSH)

### [&rarr; Compass 를 이용한 데이터 확인](#Compass)

### [&rarr; 추가 Query](#option)

<br>

### Provision
Pre-Work에 나온 바와 같이 Atlas database를 배포 하여 줍니다.
- [Prew-Work](/00.pre-work/README.md)


### CRUD

Nodejs로 Atlas 에 접속 하고 MongoDB Query 를 이용하여 데이터를 생성, 조회, 삭제를 테스트 합니다. 
코드는 application 폴더에 있으며 실행을 위해서는 NodeJS를 설치하고 테스트를 위해 관련 패키지를 설치 하여 줍니다.

````
% npm install

added 196 packages, and audited 197 packages in 2s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
````
node_modules 폴더가 생성되어 관련된 라이브러리가 설치 됩니다.


#### Connection Test

MongoDB Atlas 와 연결을 위한 테스트 입니다.
MongoDB atlas Console에 접근 주소를 얻어야 합니다. 
접속 주소를 얻기 위해 Console에 로그인합니다. 
데이터베이스 클러스터의 Connect 버튼을 클릭 합니다.

<img src="/01.Provision and CRUD/images/image01.png" width="90%" height="90%">     


접근방법을 선택 하여 주는 단계에서 Connect your application를 선택 하면 접근 주소를 얻을 수 있습니다.   

<img src="/01.Provision and CRUD/images/image08.png" width="60%" height="60%">   

Driver는 Node.js를 선택 하고 버젼은 4.1 or later를 선택 하여 주면 연결을 위한 Connection String이 생성 됩니다.    

<img src="/01.Provision and CRUD/images/image09.png" width="70%" height="70%">     


connect.js 에 const uri을 수정 하여 줍니다. 생성한 Database Account 와 비밀 번호를 수정하여 줍니다. 만약 비밀번호에 특수문자가 포함되어있는 경우 ('@','#', '!' 등) HTML URI encoding이 필요합니다.  
(https://www.w3schools.com/tags/ref_urlencode.ASP)

````
const uri =mongodb+srv://atlas-account:<password>@cluster0.****.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
````
연결 테스트를 위해 다음을 실행 합니다.

````
% node connect.js 
Connected successfully to server
````

#### Insert Test

MongoDB Atlas 와 연결하여 데이터를 생성 합니다.
insertOne.js 에 const uri을 수정 하여 줍니다.

````
const uri =mongodb+srv://atlas-account:<password>@cluster0.****.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
````
입력할 데이터를 수정 하여 줍니다. 

````
      const newUser = <<query>>;  // query를 수정

      const newUser = {
        ssn:"123-456-0001", 
        email:"user@email.com", 
        name:"Gildong Hong", 
        DateOfBirth: "1st Jan.", 
        Hobbies:["Martial arts"],
        Addresses:[{"Address Name":"Work","Street":"431, Teheran-ro GangNam-gu ","City":"Seoul", "Zip":"06159"}], 
        Phones:[{"type":"mobile","number":"010-5555-1234"}]
      };
````

입력 테스트를 위해 다음을 실행 합니다.

````
% node insertOne.js 
A document was inserted with the _id: 63bba1f8e554c42df82f974e
````
Atlas Console 에서 데이터 생성 여부를 확인 합니다.


#### find Test

MongoDB Atlas 와 연결하여 데이터를 조회 합니다.
findeOne.js 에 const uri을 수정 하여 줍니다.

````
const uri =mongodb+srv://atlas-account:<password>@cluster0.****.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
````
입력할 데이터를 수정 하여 줍니다.
조회할 데이터의 ssn을 확인 합니다.  

`````
const query = {ssn:"123-456-0001"};
`````

데이터를 조회 합니다
````
% node findOne.js
Find One Record: 63bba1f8e554c42df82f974e
Find One Record by SSN: 63bba1f8e554c42df82f974e
````

#### Update Test

MongoDB Atlas 와 연결하여 데이터를 업데이트 합니다.
updateOne.js 에 const uri을 수정 하여 줍니다.


````
const uri =mongodb+srv://atlas-account:<password>@cluster0.****.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
````
수정할 데이터를 ssn을 입력 하여 줍니다.
수정 대상 데이터의 ssn 및 수정할 데이터 항목을 확인 수정 하여 줍니다.
`````
      const query = {"ssn":"123-456-0001"};
      const updatedata ={$set:{email:"gildong@email.com"}};

const result = await userCollection.updateOne(query, updatedata);
      
`````

데이터를 수정 합니다
````
% node updateOne.js
1 document(s) matched the filter, updated 0 document(s)
````

#### Update Hobbies Test


MongoDB Atlas 와 연결하여 데이터를 업데이트 합니다.
updateHobbies.js 에 const uri을 수정 하여 줍니다.

````
const uri =mongodb+srv://atlas-account:<password>@cluster0.****.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
````
수정할 데이터를 ssn을 입력 하여 줍니다.
수정 대상 데이터의 ssn 및 Hobby 항목을 추가 하여 줍니다. (취미로 Reading 추가 하기)
`````

      const query = {"ssn":"123-456-0001"};
      const updatedata ={$push:{Hobbies:"Reading"}};

const result = await userCollection.updateOne(query, updatedata);
          
`````

데이터를 수정 합니다
````
node updateHobbies.js 
1 document(s) matched the filter, updated 1 document(s)
````
Atlas Data Console에서 데이터가 수정 된 것을 확인 합니다.


#### Remove Test


MongoDB Atlas 와 연결하여 데이터를 삭제 합니다.
removeUser.js 에 const uri을 수정 하여 줍니다.

````
const uri =mongodb+srv://atlas-account:<password>@cluster0.****.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
````
삭제할 데이터를 수정 하여 줍니다.
삭제할 데이터의 ssn 및 입력 하여줍니다.
`````

const qeury = {"ssn":"123-456-0001"};

      const result = await userCollection.deleteOne(qeury);

`````

데이터를 삭제 합니다
````
% node removeUser.js 
1 document(s) removed
````


### MONGOSH

Mongosh로 Atlas 에 접속 하고 MongoDB Query 를 이용하여 데이터를 생성, 조회, 삭제를 테스트 합니다. NodeJS에 익숙하지 않은 경우 이를 이용하여 테스트 합니다.


#### Connection

MongoDB Atlas 와 Mongosh을 이용하여 연결 합니다.    
MongoDB atlas Mongosh 접근 주소를 얻어야 합니다. 
접속 주소를 얻기 위해 Console에 로그인합니다. 
데이터베이스 클러스터의 Connect 버튼을 클릭 합니다.

<img src="/01.Provision and CRUD/images/image01.png" width="90%" height="90%">     


접근방법을 선택 하여 주는 단계에서 Shell을 선택 하면 접근 주소를 얻을 수 있습니다.   

<img src="/01.Provision and CRUD/images/image20.png" width="60%" height="60%">   

Mongosh이 설치 되어 있음으로 I have the MongoDB Shell installed를 선택하고 계정 접근은 암호로 접근할 것임으로 Password를 선택하면 접근 할 수 있는 주소를 얻을 수 있습니다.    

<img src="/01.Provision and CRUD/images/image21.png" width="70%" height="70%">     


Terminal을 열고 해당 주소를 이용하여 mongosh를 실행 하여 줍니다. (접근하기 위한 Account로 입력 하여 줍니다.)

````
 % mongosh "mongodb+srv://cluster0.5qjlg.mongodb.net/myFirstDatabase" --apiVersion 1 --username admin    
Enter password: **********
Current Mongosh Log ID:	64454459813babb209a83f4c
Connecting to:		mongodb+srv://cluster0.5qjlg.mongodb.net/myFirstDatabase
Using MongoDB:		6.0.5 (API Version 1)
Using Mongosh:		1.0.5

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

Atlas atlas-t0pzlo-shard-0 [primary] myFirstDatabase> 
````

#### Insert Test

Mongosh을 이용하여 Atlas와 연결하여 데이터를 생성 합니다.

먼저 데이터베이스를 선택하여야 합니다.
````
Atlas atlas-t0pzlo-shard-0 [primary] myFirstDatabase> use samsungheavy
switched to db samsungheavy
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy>
````

입력할 데이터를 생성하여 줍니다. (변수로 newUser를 만들어 줍니다)

````
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> let newUser=  {
        ssn:"123-456-0001", 
        email:"user@email.com", 
        name:"Gildong Hong", 
        DateOfBirth: "1st Jan.", 
        Hobbies:["Martial arts"],
        Addresses:[{"Address Name":"Work","Street":"431, Teheran-ro GangNam-gu ","City":"Seoul", "Zip":"06159"}], 
        Phones:[{"type":"mobile","number":"010-5555-1234"}]
      };
````

다음 데이터 베이스 명령으로 데이터를 생성 합니다.

````
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> db.handson.insertOne(newUser)
{
  acknowledged: true,
  insertedId: ObjectId("64454591813babb209a83f4d")
}

````
Atlas Console 에서 데이터 생성 여부를 확인 합니다.


#### find Test

Mongosh을 이용하여 Atlas와 연결하여 데이터를 조회 합니다.

먼저 데이터베이스를 선택하여야 합니다. (이미 해당 데이터베이스를 사용 하고 있으면 생략 합니다)
````
Atlas atlas-t0pzlo-shard-0 [primary] myFirstDatabase> use samsungheavy
switched to db samsungheavy
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy>
````

데이터를 조회 합니다
````
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> db.handson.find({ssn:"123-456-0001"})
[
  {
    _id: ObjectId("64454591813babb209a83f4d"),
    ssn: '123-456-0001',
    email: 'user@email.com',
    name: 'Gildong Hong',
    DateOfBirth: '1st Jan.',
    Hobbies: [ 'Martial arts' ],
    Addresses: [
      {
        'Address Name': 'Work',
        Street: '431, Teheran-ro GangNam-gu ',
        City: 'Seoul',
        Zip: '06159'
      }
    ],
    Phones: [ { type: 'mobile', number: '010-5555-1234' } ]
  }
]
````

#### Update Test

Mongosh을 이용하여 Atlas와 연결하여 데이터를 업데이트 합니다.

먼저 데이터베이스를 선택하여야 합니다. (이미 해당 데이터베이스를 사용 하고 있으면 생략 합니다)
````
Atlas atlas-t0pzlo-shard-0 [primary] myFirstDatabase> use samsungheavy
switched to db samsungheavy
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy>
````

수정할 데이터를 ssn을 입력 하여 줍니다.
수정 대상 데이터의 ssn 및 수정할 데이터 항목을 확인 수정 하여 줍니다.
`````
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> let query = {"ssn":"123-456-0001"}

Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> let updatedata = { $set: { email: "gildong@email.com" } }

Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> db.handson.updateOne(query,updatedata)
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
      
`````

데이터를 수정 결과를 확인 합니다. (이메일 주소가 수정 된 것을 확인 합니다)
````
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> db.handson.find({"ssn":"123-456-0001"})
[
  {
    _id: ObjectId("64454591813babb209a83f4d"),
    ssn: '123-456-0001',
    email: 'gildong@email.com',
    name: 'Gildong Hong',
    DateOfBirth: '1st Jan.',
    Hobbies: [ 'Martial arts' ],
    Addresses: [
      {
        'Address Name': 'Work',
        Street: '431, Teheran-ro GangNam-gu ',
        City: 'Seoul',
        Zip: '06159'
      }
    ],
    Phones: [ { type: 'mobile', number: '010-5555-1234' } ]
  }
]
````

#### Update Hobbies Test

Mongosh을 이용하여 Atlas와 연결하여 데이터를 업데이트 (Hobbies를 추가)합니다.

먼저 데이터베이스를 선택하여야 합니다. (이미 해당 데이터베이스를 사용 하고 있으면 생략 합니다)
````
Atlas atlas-t0pzlo-shard-0 [primary] myFirstDatabase> use samsungheavy
switched to db samsungheavy
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy>
````

수정할 데이터를 ssn을 입력 하여 줍니다.
수정 대상 데이터의 ssn 및 Hobby 항목을 추가 하여 줍니다. (취미로 Reading 추가 하기)
`````
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> let query = {"ssn":"123-456-0001"}

Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> let updatedata ={$push:{Hobbies:"Reading"}}

Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> db.handson.updateOne(query,updatedata)
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
          
`````

데이터를 수정 결과를 확인 합니다. (Hobby에 Reading이 추가되어 있음)
````
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> db.handson.find({"ssn":"123-456-0001"})
[
  {
    _id: ObjectId("64454591813babb209a83f4d"),
    ssn: '123-456-0001',
    email: 'gildong@email.com',
    name: 'Gildong Hong',
    DateOfBirth: '1st Jan.',
    Hobbies: [ 'Martial arts', 'Reading' ],
    Addresses: [
      {
        'Address Name': 'Work',
        Street: '431, Teheran-ro GangNam-gu ',
        City: 'Seoul',
        Zip: '06159'
      }
    ],
    Phones: [ { type: 'mobile', number: '010-5555-1234' } ]
  }
]

````

#### Remove Test

Mongosh을 이용하여 Atlas와 연결하여 데이터를 삭제 합니다.

먼저 데이터베이스를 선택하여야 합니다. (이미 해당 데이터베이스를 사용 하고 있으면 생략 합니다)
````
Atlas atlas-t0pzlo-shard-0 [primary] myFirstDatabase> use samsungheavy
switched to db samsungheavy
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy>
````

삭제할 데이터를 수정 하여 줍니다.
삭제할 데이터의 ssn 및 입력 하여줍니다.
`````
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> db.handson.deleteOne({ssn:"123-456-0001"})
{ acknowledged: true, deletedCount: 1 }

`````

데이터를 확인 합니다.
````
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> db.handson.findOne({ssn:"123-456-0001"})
null
Atlas atlas-t0pzlo-shard-0 [primary] samsungheavy> 
````



### Compass

MongoDB Cluster에 접속하여 저장된 데이터 등을 볼 수 있는 개발자용 GUI툴입니다. 이를 이용하여 데이터를 조회 하고 변경 하여 줍니다. 다음 링크에서 다운로드가 가능 합니다.    
Compass :   
https://www.mongodb.com/products/compass

테스트를 위해 다음 방법으로 데이터를 생성 하여 줍니다.
````
% node insertMany.js 
A document was inserted with the _id: 63e32381541c67cc69d78977
A document was inserted with the _id: 63e32381541c67cc69d78978
A document was inserted with the _id: 63e32381541c67cc69d78979
A document was inserted with the _id: 63e32381541c67cc69d7897a
...
````

데이터가 100건이 생성이 되게 됩니다.


#### Connection
MongoDB atlas Console에 접근 주소를 얻어야 합니다. 
접속 주소를 얻기 위해 Console에 로그인합니다.    
데이터베이스 클러스터의 Connect 버튼을 클릭 합니다.

<img src="/01.Provision and CRUD/images/image01.png" width="90%" height="90%">     

접근방법을 선택 하여 주는 단계에서 Connect using MongoDB Compass를 선택 하면 접근 주소를 얻을 수 있습니다.    

<img src="/01.Provision and CRUD/images/image02.png" width="60%" height="60%">     

Connection String을 복사하여 줍니다. 이후 Compass를 실행 하여 줍니다.     
<img src="/01.Provision and CRUD/images/image03.png" width="70%" height="70%">     



복사한 Connection String을 입력하여 줍니다.   

<img src="/01.Provision and CRUD/images/image04.png" width="90%" height="90%">     


#### 데이터 조회
데이터베이스에서 생성한 handson 탭을 클릭 하면 컬렉션 리스트를 볼 수 있습니다. 생성한 user컬렉션을 선택 합니다.    

<img src="/01.Provision and CRUD/images/image05.png" width="90%" height="90%">     

데이터 검색을 위해서 Filter 부분에 검색 조건을 입력 하여 줍니다.
ssn 이 123-456-0001 인 데이터를 찾기 위해 다음과 같이 입력 하여 줍니다.

````
{ssn: "123-456-0001"}
````

<img src="/01.Provision and CRUD/images/image06.png" width="90%" height="90%">     

나이(age)가 10 이상 40이하인 사람을 찾기를 합니다. 조건은 age >= 10 이고 age <=40으로 합니다.

````
{age: {$gte: 10, $lte: 40}}
````

<img src="/01.Provision and CRUD/images/image07.png" width="90%" height="90%">     



### option
생성된 데이터 베이스중 Movie 관련 데이터 컬렉션 (sample_mflix.movies)에서 다음 내용을 Query 합니다.

- 1987 년에 나온 데이터 조회 (Where year = 1987)

- 장르가 Comedy 에 속하는 영화 검색

- 장르가 Comedy 하나 만 있는 데이터 검색

- 장르가 Comedy 혹은 Drama 인 데이터 검색

- imdb 의 평가 점수가 8.0 이상이고 등급이 PG 인 영화 검색

- metacritic의 평점이 존재 하는 영화 검색

- Dr. Strangelove 로 시작하는 영화 검색

해당 쿼리는 다음과 같습니다.
- 1987 년에 나온 데이터 조회 (Where year = 1987)
````
db.movies.find({year:1987})
````
<img src="/01.Provision and CRUD/images/image11.png" width="90%" height="90%">     

- 장르가 Comedy 에 속하는 영화 검색
````
db.movies.find({genres: "Comedy"})

````
<img src="/01.Provision and CRUD/images/image12.png" width="90%" height="90%">     

- 장르가 Comedy 하나 만 있는 데이터 검색
````
db.movies.find({genres:["Comedy"]})

````
<img src="/01.Provision and CRUD/images/image13.png" width="90%" height="90%">     

- 장르가 Comedy 혹은 Drama 인 데이터 검색
````
db.movies.find({genres:{$in:["Comedy", "Drama"]}})

````
<img src="/01.Provision and CRUD/images/image14.png" width="90%" height="90%">     

- imdb 의 평가 점수가 8.0 이상이고 등급이 PG 인 영화 검색
````
db.movies.find({"imdb.rating" : {$gt: 8.0}, rated:"PG"})

````
<img src="/01.Provision and CRUD/images/image15.png" width="90%" height="90%">     

- metacritic의 평점이 존재 하는 영화 검색
````
db.movies.find({metacritic: {$exists: true}})

````
<img src="/01.Provision and CRUD/images/image16.png" width="90%" height="90%">     

- Dr. Strangelove 로 시작하는 영화 검색
````
db.movies.find({title: {$regex: '^Dr. Strangelove'}})

````
<img src="/01.Provision and CRUD/images/image17.png" width="90%" height="90%">     
