# Siphon Phenomenon Presentation Site

이 프로젝트는 신경외과 교수진과 의대생을 대상으로 **사이펀 현상(Siphon Phenomenon)** 을 물리, 임상, 공학 관점에서 통합적으로 설명하기 위해 제작된 싱글 페이지 웹 애플리케이션입니다. Next.js 14와 Tailwind CSS를 기반으로 구축되었으며, 인터랙티브한 시뮬레이터와 시각화 컴포넌트를 통해 자세 변화에 따른 정수압 변화를 직관적으로 전달합니다.

## 주요 특징
- **Hero 섹션**: 학술 발표용 톤앤매너에 맞춘 다크 테마 히어로 영역과 핵심 질문 카드.
- **Q1 – Physics & Clinical**: 사이펀 물리 원리 애니메이션과 임상적 중요성을 보여주는 자세 비교, 합병증 카드.
- **Q2 – Quantification**: 포지션별 정수압 계산 시뮬레이터, 정량 비교 차트, 추가 자료 아코디언.
- **Q3 – Solution**: 밸브 전략 비교 탭과 자세별 동작을 시각적으로 표현한 엔지니어링 스토리보드.
- **결론 섹션**: 의사결정자를 위한 핵심 요약과 발표 자료 다운로드 CTA.
- **Vercel 배포 친화적 구성**: 정적 페이지 + 인터랙티브 컴포넌트 구성으로 서버리스 환경에 적합.

## 기술 스택
- [Next.js 14](https://nextjs.org/)
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- 사용자 정의 CSS 애니메이션 – 스크롤 진입/호버 전환 효과
- [lucide-react](https://lucide.dev/) – 임상 합병증 아이콘
- TypeScript

## 프로젝트 구조
```
├── app
│   ├── layout.tsx          # 글로벌 레이아웃 및 메타데이터
│   ├── page.tsx            # 단일 페이지 구성
│   └── globals.css         # Tailwind 및 공통 스타일
├── components
│   ├── hero.tsx
│   ├── animated-physics-diagram.tsx
│   ├── patient-posture-comparison.tsx
│   ├── hydrostatic-simulator.tsx
│   ├── pressure-comparison-chart.tsx
│   ├── shunt-valve-simulator.tsx
│   └── conclusion.tsx
├── public
│   └── hero-illustration.svg
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 로컬 개발 방법
1. **의존성 설치**
   ```bash
   npm install
   ```
2. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   - 기본적으로 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.
3. **품질 검사**
   ```bash
   npm run lint
   npm run build
   ```

## 배포 가이드 (Vercel)
1. [Vercel](https://vercel.com/) 계정에 로그인합니다.
2. GitHub에 이 레포지토리를 업로드한 후 **New Project**를 클릭합니다.
3. 연결할 Git 저장소를 선택하고 빌드 설정을 확인합니다.
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Environment Variables**는 현재 필요하지 않습니다. (필요 시 Vercel 대시보드에서 추가 가능합니다.)
5. **Deploy** 버튼을 클릭하면 자동으로 빌드 및 배포가 진행됩니다.
6. 배포가 완료되면 제공되는 `*.vercel.app` 도메인을 발표용 링크로 활용할 수 있습니다.
7. 변경 사항을 반영하려면 main 브랜치에 커밋/푸시하면 Vercel이 자동으로 새 버전을 배포합니다.

## 추천 발표 활용 방법
- 그랜드 라운드 혹은 케이스 컨퍼런스에서 시뮬레이터를 실시간 조작해 자세별 정수압 변화를 시연하십시오.
- Q3 탭형 비교 모듈에 실제 사례 사진 또는 영상 링크를 추가하면 설득력이 더욱 높아집니다.
- README의 지침을 기반으로 `speaker notes` 문서를 업데이트하여 발표자의 해설 포인트를 정리해 두십시오.

## 라이선스
본 프로젝트는 교육 및 연구 목적의 사용을 가정하고 있으며 별도 라이선스가 명시되어 있지 않습니다. 필요 시 기관 정책에 맞게 수정하여 사용하십시오.
