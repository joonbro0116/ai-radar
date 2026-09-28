# AI 레이더

출근길에 5분 안에 읽는 개인 AI 학습 브리핑입니다. 아이폰 홈 화면에서는 앱처럼 열리고, 텔레그램 봇이 매일 새 브리핑 링크를 보냅니다.

> 지금은 **읽는 화면**이 완성된 상태입니다. 아래 순서대로 GitHub와 텔레그램을 연결하면 매일 자동 발송까지 확장합니다.

## 완성되면 이렇게 동작합니다

```text
공식 AI 소스
  → 매일 오전 7:10 (한국 시간) GitHub Actions가 새 글 확인
  → AI가 한국어 5분 브리핑으로 요약
  → briefs.json 갱신 · GitHub Pages가 웹앱 배포
  → 텔레그램 봇이 “오늘의 AI 레이더” 링크 발송
  → 아이폰 알림을 눌러 홈 화면 앱에서 읽기
```

처음에는 다음 출처만 사용합니다. 범위를 좁혀야 읽을 수 있는 품질이 나옵니다.

- OpenAI, Anthropic, Google DeepMind의 공식 발표와 개발자 문서
- GitHub의 AI 관련 릴리스와 주목받는 저장소
- Hugging Face와 주요 연구소의 공식 업데이트

브리핑은 매일 세 가지를 넘기지 않습니다. 각 항목에는 `무슨 변화인가`, `왜 중요한가`, `원문`을 반드시 넣습니다. 직장 업무와 직접 관련 없는 개인 학습용이며, 회사 계정·문서·데이터는 사용하지 않습니다.

## 현재 들어 있는 것

- `index.html` — 아이폰에 맞춘 브리핑 화면
- `briefs.json` — 화면에 표시할 브리핑 데이터. 현재는 자동화 전의 시작용 내용입니다.
- `app.js` — 브리핑 표시와 “나중에 보기” 저장 기능. 저장 정보는 아이폰 브라우저 안에만 보관됩니다.
- `manifest.webmanifest`, `icon.svg` — 홈 화면 설치를 위한 앱 이름과 아이콘

## 1. GitHub에 올리기

GitHub에서 **새 저장소**를 하나 만듭니다. 이름은 `ai-radar`를 권합니다. GitHub Free라면 Pages를 쓰기 위해 공개 저장소로 만듭니다. 이 프로젝트에는 개인·회사 정보나 비밀키를 넣지 않으므로 코드와 브리핑이 공개되어도 괜찮을 때만 그렇게 합니다. 비공개 저장소 Pages는 지원되는 유료 플랜이 필요합니다. 저장소를 만든 뒤, 이 폴더를 그 저장소에 올립니다.

PowerShell에서 실행할 명령입니다. `<내-계정>`만 본인 GitHub 사용자명으로 바꿉니다.

```powershell
cd C:\Users\joonb\Projects\ai-radar
git init
git add .
git commit -m "Add AI Radar PWA"
git branch -M main
git remote add origin https://github.com/<내-계정>/ai-radar.git
git push -u origin main
```

이미 빈 저장소를 만들었다면 위 명령은 그대로 쓸 수 있습니다. 저장소 주소가 다르면 `git remote add origin`의 주소만 바꾸면 됩니다.

## 2. 웹 주소 만들기 — GitHub Pages

GitHub 저장소에서 다음을 설정합니다.

1. **Settings → Pages**를 엽니다.
2. **Build and deployment**의 Source를 **Deploy from a branch**로 고릅니다.
3. Branch는 `main`, 폴더는 `/(root)`를 고르고 Save를 누릅니다.
4. 잠시 후 표시되는 `https://<내-계정>.github.io/ai-radar/` 주소를 엽니다.

이 주소가 아이폰과 텔레그램이 사용할 유일한 링크입니다. 나중에 개인 도메인을 붙이고 싶어도 이 구조는 바꿀 필요가 없습니다.

## 3. 아이폰 15 Pro에 설치하기

1. **Safari**에서 GitHub Pages 주소를 엽니다.
2. 하단의 공유 버튼을 누릅니다.
3. **홈 화면에 추가**를 선택합니다.
4. 이름을 `AI 레이더`로 확인한 뒤 추가합니다.

홈 화면의 아이콘을 누르면 브라우저 탭 대신 앱처럼 열립니다. 설치형 웹앱은 일반 웹사이트로도 계속 열리므로, 별도 앱스토어 등록은 필요 없습니다.

## 4. 텔레그램 봇 만들기

텔레그램에서 `@BotFather`를 열고 `/newbot`을 실행합니다. 봇 이름은 예를 들어 `AI Radar`, 사용자명은 `ai_radar_<내이름>_bot`처럼 정합니다.

BotFather가 보여주는 토큰은 비밀번호와 같습니다.

- 토큰을 이 README, GitHub 코드, 채팅에 붙여 넣지 않습니다.
- 토큰을 받은 뒤 새 봇에게 아무 메시지나 하나 보냅니다. 그래야 봇이 나에게 메시지를 보낼 수 있습니다.
- 다음 단계에서 GitHub **Secrets**에만 저장합니다.

## 5. 자동화에 필요한 비밀값

자동 수집 기능을 추가할 때 GitHub 저장소의 **Settings → Secrets and variables → Actions**에서 아래 값을 등록합니다.

| 이름 | 용도 | 어디에 쓰는가 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 출처를 짧고 정확한 한국어로 정리 | GitHub Actions 안에서만 사용 |
| `TELEGRAM_BOT_TOKEN` | 내 봇으로 메시지 발송 | GitHub Actions 안에서만 사용 |
| `TELEGRAM_CHAT_ID` | 메시지를 받을 내 텔레그램 대화 ID | GitHub Actions 안에서만 사용 |
| `SITE_URL` | 예: `https://<내-계정>.github.io/ai-radar/` | 텔레그램 메시지의 링크 |

`OPENAI_API_KEY`가 없으면 자동 요약은 만들 수 없습니다. 다만 수집한 원문 링크만 보내는 무료 모드는 가능합니다. 처음에는 정확도를 위해 AI 요약 모드로 만들 것을 권합니다.

## 다음 구현 순서

1. 저장소 주소를 확인하고 GitHub Pages에 첫 배포
2. 신뢰할 출처 목록을 코드로 고정
3. 매일 오전 7:10 KST에 실행되는 GitHub Actions 추가
4. 새 `briefs.json` 생성과 텔레그램 링크 발송 연결
5. 실제 아이폰에서 설치·알림·링크 열기까지 확인

자동화 파일은 `.github/workflows/daily-brief.yml`에 둘 예정입니다. 한국은 서머타임이 없으므로 07:10 KST는 전날 22:10 UTC로 고정할 수 있습니다.

```yaml
on:
  schedule:
    - cron: "10 22 * * *" # 매일 07:10 KST
  workflow_dispatch:       # GitHub 화면에서 수동 시험 가능
```

정각에는 GitHub Actions 작업이 몰려 지연될 수 있어 07:00 대신 07:10으로 정했습니다. 공개 저장소는 60일 동안 활동이 없으면 예약 작업이 자동 중단될 수 있으므로, 첫 버전은 비공개 저장소로 운영하거나 월 1회 수동 실행으로 상태를 확인합니다.

자동화가 시작되기 전에는 그럴듯한 가짜 AI 뉴스를 채우지 않습니다. 최신성, 원문 링크, 날짜가 갖춰진 항목만 브리핑에 넣습니다.

## 운영 원칙

- 매일 3개 이하, 총 5분 이하
- 원문과 발표 날짜가 없는 항목은 제외
- “왜 중요한가”는 개인 학습 관점으로만 씀
- 읽지 않은 항목이 쌓이면 다음 날 더 많이 보내지 않음
- 유료 서비스나 새 의존성은 자동화가 실제로 필요해질 때만 추가
