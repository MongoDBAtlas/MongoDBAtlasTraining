<img src="https://companieslogo.com/img/orig/MDB_BIG-ad812c6c.png?t=1648915248" width="50%" title="Github_Logo"/> <br>


# MongoDB Atlas Hands-on Training

### Pre Work


#### Atlas Account
MongoDB Atlas 의 무료 계정을 생성 합니다.     
Atlas는 관리형 데이터 베이스로 간편하게 데이터 베이스를 생성 하고 인터넷을 통한 엑세스로 편리하게 사용 할 수 있습니다.   

계정 생성을 위해 Atlas 사이트에 접속 합니다.   

https://www.mongodb.com/ko-kr/cloud/atlas/register

신용카드 입력 없이 계정을 생성 할 수 있습니다. 기존 계정을 가지고 있는 경우 2개의 Freetier 데이터베이스 클러스터까지 생성 가능 하며 Hands-on 과정도 Free-tier를 이용하게 됩니다.    

#### Database 생성
Atlas에 로그인 후 테스트용 데이터 베이스를 생성 합니다.    
로그인 후 Deployment 메뉴에 Database 를 클릭 합니다. 오른쪽 화면에 생성되어 진 데이터 베이스 정보를 볼 수 있으며 최초에는 데이터 베이스가 없음으로 Create를 클릭 하여 데이터베이스 클러스터를 생성 합니다.    

<img src="/00.pre-work/images/images01.png" width="90%" height="90%">     
클러스터 사양을 선택 할 수 있으며 무료로 사용 할 수 있는 Shared를 선택 하고 Cloud Provider로 AWS를 선택 하고 지역은 Seoul을 선택 합니다.

<img src="/00.pre-work/images/images02.png" width="90%" height="90%">     
Cluster Tier 는 M0 Sandbox 를 선택 합니다 (M2, M5는 추가 금액이 소요 됩니다.)    

<img src="/00.pre-work/images/images03.png" width="90%" height="90%">  
Cluster Name을 입력 하고 Create Cluster를 클릭 하여 데이터 베이스를 생성합니다. (소요시간은 대략 10분이내가 소요 됩니다.)


#### Database Account 생성
Atlas 데이터베이스 클러스터를 접근하기 위한 계정 생성으로 Security 메뉴에 Database Access를 클릭 하여 계정을 생성 할 수 있습니다.    
Hands-on에서는 Id/password를 이용하는 방식의 데이터베이스 계정을 생성 합니다.   
<img src="/00.pre-work/images/images08.png" width="90%" height="90%">  
계정은 atlas-account로 하여 생성 합니다. Built-in Role 은 편의상 Read and Write to any database 를 선택합니다.


#### Network Access 생성
데이터 베이스 접근 테스트를 위해서 접근 하려는 컴퓨터의 IP 주소를 방화벽에 허용 해 주어야 합니다.    
Security의 Network Access메뉴를 선택 합니다.
<img src="/00.pre-work/images/images05.png" width="80%" height="80%">  
Add IP Address를 클릭하고 Add IP Access List Entry 에서 Add current IP Address를 클릭하하고 Confirm을 선택 합니다.   
방화벽 설정은 1분 가량의 시간이 소요 됩니다.


#### 초기 데이터 로드
생성된 데이터 베이스 클러스터에 초기 샘플 데이터를 적재하여 Hands on을 진행 합니다.   
<img src="/00.pre-work/images/images06.png" width="90%" height="90%">     


Database 메뉴를 클릭 하면 생성된 데이터 베이스 클러스터를 볼 수 있습니다. 최초에는 데이터가 없음으로 클러스터 메뉴 버튼을 "..."을 클릭 하면 추가 메뉴 중 Load Sample Dataset 을 선택 합니다.   
생성이 완료된 후 Browse Collections를 클릭하먄 데이터를 볼 수 있습니다.
생성된 데이터 베이스는 sample_airbnb외 8개의 데이터베이스가 생성 되고 최소 1개 이상의 컬렉션(테이블)이 생성되게 됩니다.
<img src="/00.pre-work/images/images07.png" width="90%" height="90%"> 


#### 기타 필요한 소프트웨어
클라이언트 애플리케이션 테스트를 위한 Nodejs 필요합니다.
MongoDB에 접속하고 데이터를 조회 하는 GUI Tool (Compass)를 다운로드 합니다.

Nodejs : 
https://nodejs.org/en/download/

Compass :   
https://www.mongodb.com/products/compass

Mongosh :
https://www.mongodb.com/docs/mongodb-shell/install/

