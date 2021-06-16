[backjoon-cpp-resolver] — 백씨리
===
<img src="https://files.catbox.moe/k8lvxi.webp">

backjoon-cpp-resolver(백씨리)는 Windows 운영체제에서 C++ 백준 알고리즘 풀이를 도와주는 nodejs 소도구입니다. 맥이랑 리눅스는 나도몰라


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
npm test
```


추가 사용법 
---
* setting.json의 problemNo 필드에 문제번호 입력 
* question.md로 문제 확인
* setting.json의 testcase 필드에 [[input, output],[input, output]...] 형식으로 테스트 케이스 추가

