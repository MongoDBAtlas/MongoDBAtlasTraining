<img src="https://companieslogo.com/img/orig/MDB_BIG-ad812c6c.png?t=1648915248" width="50%" title="Github_Logo"/> <br>


# MongoDB Atlas Hands-on Training

### [&rarr; Bucket Pattern](#bucket)

### [&rarr; Computed Pattern](#computed)

### [&rarr; Versioing Pattern](#versioning)


<br>

### bucket
Nodejs로 Atlas 에 접속 하고 MongoDB Query 를 이용하여 데이터를 생성 테스트 합니다. 
코드는 application 폴더에 있으며 실행을 위해서는 NodeJS를 설치하고 테스트를 위해 관련 패키지를 설치 하여 줍니다.

````
% npm install

added 196 packages, and audited 197 packages in 2s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
````
node_modules 폴더가 생성되어 관련된 라이브러리가 설치 됩니다.

Atlas 와 연결 정보를 맞게 수정 하여 줍니다.

````
const uri =mongodb+srv://atlas-account:<password>@cluster0.****.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
````

application 폴더에서 bucket 스크립트를 실행 하여 데이터를 생성 합니다.

````
node bucket.js

````

데이터를 생성하는 Query는 다음과 같습니다.

````
const sensor_id = "12345";
const bucket_range = 5;


const device = {sensor_id:sensor_id, transaction_count: {$lt: bucket_range}};

      
for (let i=0; i <100; i++)
{
      let temp= getRandomTemperature (30);
      let now = new Date();
      const updateQuery = {
            $setOnInsert: {sensor_id : sensor_id, start_date:now.toISOString()},
            $push: {measurements: {temperature: temp, timestamp: now.toISOString()}},
            $inc: {transaction_count:1, sum_temperature: temp}
      };

      const result = await userCollection.updateOne(device, updateQuery, {upsert:true});
}
````
조회 조건으로 sensor_id 와 transaction_count 등으로 기존에 값이 존재 하는지를 확인 하고 문서가 없을 경우는 데이터를 새로 생성 하도록 upsert=true 조건을 이용합니다. 데이터는 Insert 시 생성되는 데이터와 기존 데이터를 update 하는 데이터를 구분하여 처리 하여 줍니다.


### computed

Nodejs로 Atlas 에 접속 하고 MongoDB Query 를 이용하여 데이터를 생성 테스트 합니다. 
코드는 application 폴더에 있으며 실행을 위해서는 NodeJS를 설치하고 테스트를 위해 관련 패키지를 설치 하여 줍니다.

````
% npm install

added 196 packages, and audited 197 packages in 2s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
````
node_modules 폴더가 생성되어 관련된 라이브러리가 설치 됩니다.

Atlas 와 연결 정보를 맞게 수정 하여 줍니다.

````
const uri =mongodb+srv://atlas-account:<password>@cluster0.****.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
````

application 폴더에서 computed 스크립트를 실행 하여 데이터를 생성 합니다.

````
node computed.js

````

데이터를 생성하는 Query는 다음과 같습니다.

````
const sensor_id = "12345";
const bucket_range = 60;

const device = {sensor_id:sensor_id, txCount: {$lt: bucket_range}};

for (let i=0; i <100; i++)
{
      let temp= getRandomTemperature (30);
      let mois = getRandomTemperature (50);
      let now = new Date();
      const updateQuery = {
      $setOnInsert: {sensor_id : sensor_id, start_date:now.toISOString()},
      $push: {measurements: {temperature: temp, moisture: mois ,timestamp: now.toISOString()}},
      $inc: {txCount:1, sum_temp: temp, sum_moisture: mois}
      };

      const result = await computedCollection.updateOne(device, updateQuery, {upsert:true});
}

````
데이터 생성시 $inc 를 이용하여 기존 값에 데이터를 추가 해주는 방식으로 사전에 데이터를 계산 하여 줍니다.


### versioning


Nodejs로 Atlas 에 접속 하고 MongoDB Query 를 이용하여 데이터를 생성 테스트 합니다. 
코드는 application 폴더에 있으며 실행을 위해서는 NodeJS를 설치하고 테스트를 위해 관련 패키지를 설치 하여 줍니다.

````
% npm install

added 196 packages, and audited 197 packages in 2s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
````
node_modules 폴더가 생성되어 관련된 라이브러리가 설치 됩니다.

Atlas 와 연결 정보를 맞게 수정 하여 줍니다.

````
const uri =mongodb+srv://atlas-account:<password>@cluster0.****.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
````

application 폴더에서 version 스크립트를 실행 하여 데이터를 생성 합니다.

````
node version1.js

````

데이터를 생성하는 Query는 다음과 같습니다.


````
for (let i=0; i <100; i++)
{
      const newUser = {
      schema_version: "1.0",
      ssn:"123-456-000"+i, 
      email:"user"+i+"@email.com", 
      name:"Gildong Hong "+i, 
      age: Math.floor(Math.random()*100),
      DateOfBirth: "1st Jan.",
      Addresses:[{"Address Name":"Work","Street":"431, Teheran-ro GangNam-gu ","City":"Seoul", "Zip":"06159"}], 
      Phones:[{"type":"mobile","number":"010-5555-1234"}]
      };

      const result = await versionCollection.insertOne(newUser);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
}

````

데이터 스키마가 변경되는 경우 version을 지정 하여 데이터를 저장 합니다.

````

for (let i=0; i <100; i++)
{
      const newUser = {
      schema_version: "2.0",
      ssn:"123-456-000"+i, 
      email:"user"+i+"@email.com", 
      name:"Gildong Hong "+i, 
      age: Math.floor(Math.random()*100),
      DateOfBirth: "1st Jan.", 
      Hobbies:["Martial arts"],
      Addresses:[{"Address Name":"Work","Street":"431, Teheran-ro GangNam-gu ","City":"Seoul", "Zip":"06159"}], 
      Phones:[{"type":"mobile","number":"010-5555-1234"}]
      };

      const result = await versionCollection.insertOne(newUser);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
}

````

데이터 조회 혹은 기존 데이터를 새로운 스키마로 저장 하는 경우 schema_version 정보를 이용하여 저장합니다.