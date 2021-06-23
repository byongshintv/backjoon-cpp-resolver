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
