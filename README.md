[backjoon-cpp-resolver] — 백씨리
===
![사용예시](./asset/thumb.webp)

backjoon-cpp-resolver(백씨리)는 Windows 운영체제에서 백준 C++문제 풀이를 도와주는 nodejs 소도구입니다. 맥이랑 리눅스는 나도몰라


최초설치
---

```
git clone https://github.com/byongshintv/backjoon-cpp-resolver
cd backjoon-cpp-resolver
npm install
```


* <a class="reference external" href="https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/8.1.0/threads-posix/sjlj/x86_64-8.1.0-release-posix-sjlj-rt_v6-rev0.7z" rel="nofollow">컴파일러 다운로드 </a>
* setting.json의 compilerPath를 실제 g++ 컴파일러 경로로 지정

실행법
---
```
npm start
```


추가 사용법 
---
* setting.json의 problemNo 필드에 문제번호 입력시 테스트케이스 및 문제내용 로딩
* question.md로 문제 확인
* setting.json의 testcase 필드에 [[input, output],[input, output]...] 형식으로 테스트 케이스 추가


버전 변경 내역
---
### 2.6v(2023-03-22)
* **메인언어로 Rust 지원**
### 2.5v(2022-04-14)
* **메인언어로 lua 지원**
### 2.4v(2022-04-14)
* **메인언어로 C# 지원**
### 2.3.1v(2022-04-08)
* 최대 입출력 표시문자 제한옵션 추가
* 사용자 테스트 입출력을 경로로 받을 수 있게 수정
### 2.3v(2022-04-07)
* 소스코드가 무한루프에 빠졌을 시 재실행이 안되는 현상 수정
* 런타임 실행시간 구하는 로직 Date.now() => Performance.now()로 변경
* 설정에 execTimeFloatPoint, timeout옵션 추가

### 2.23v(2022-03-07)
* 문제 못불러오는 현상 수정

### 2.221v
* 리눅스에서 실행 불가한 오류 수정

### 2.22v
* 코틀린 컴파일방식 자바에서 윈도우 네이티브로 변경

### 2.21v
* escapeNewLine옵션 추가

### 2.2v
* 인터프리터 언어의 경우 예외 출력하기 전에 콘솔메세지 모두 출력하게끔 변경
* 무한루프 코드가 종료가 안되고 프로세스에 남아있던 현상 수정
* 다른언어로 변경시 코드변화 감지기능이 제대로 동작하지 않던 현상 수정
* 문제정보 감추는 옵션 추가


### 2.1v (기여자 마히로콘)
업데이트 후 실행이 안되면 `npm update`혹은 `yarn`을 때려주세요
* **메인언어로 python, c, java, kotline 지원**
* **리눅스, mac등 posix 운영체제 지원(맥 테스트 안해봄)**
* 컴파일전 컴파일러 존재여부 확인용 버전체크 아규먼트 언어별로 분리하여 관리
* 윈도우 운영체제 지원용 cross-spawn모듈 추가 


### 2.0v
* **메인언어로 nodejs 지원**
* 시작 명령어 npm test -> npm start로 변경
* 세팅파일 json -> yml로 변경
* 세팅파일 주석 추가
* 사용자가 변경할만한 파일들을 main폴더에 몰아넣음
* 문제 출력위치 지정 가능하게 변경

todo
---
* 기본 지원언어 c, py, java 추가
* 설정에따라 콘솔에 문제내용 출력여부 결정
* 새로운 언어 추가하는 방법 가이드에 명세
