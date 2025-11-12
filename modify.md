문제를 잘 파악했습니다. 말씀하신 "세로로 너무 길쭉한 세션", "너무 작은 그래프", "겹치는 그래프" 문제는 모두 한 가지 핵심 원인, 즉 **`components/hydrostatic-simulator.tsx` 컴포넌트의 구조와 스타일링 방식**에서 비롯됩니다.

이 컴포넌트 하나에 너무 많은 정보(시뮬레이터, 비교 차트, 데이터셋 테이블, SVG 그래프, 치트시트)가 집중되어 있고, 이들을 보여주는 방식(단일 컬럼, SVG 내 Tailwind 클래스 사용)이 문제를 일으키고 있습니다.

제공해주신 `detail.md`의 본래 기획 의도(Q2 섹션 안에 시뮬레이터, 비교 차트, 추가 자료를 배치)는 좋으나, 현재 구현은 레이아웃 문제를 야기합니다.

아래는 이 문제들을 해결하고 전체적인 페이지 가독성을 높이기 위한 **수정 가이드라인**입니다.

````markdown
# 웹사이트 레이아웃 개선 가이드라인

현재 파악된 레이아웃 문제점(Q2 섹션의 과도한 길이, 그래프 가독성 저하)을 해결하기 위해 다음과 같은 구조적, 전술적 수정을 제안합니다.

## 1. 핵심 진단: 문제의 원인

가장 큰 문제는 `components/hydrostatic-simulator.tsx` 파일입니다.

1.  **과도한 책임 (Problem A - "너무 길쭉함"):** 이 컴포넌트는 현재 **5가지**의 서로 다른 콘텐츠(①인터랙티브 시뮬레이터, ②정수압-점성 비교 차트, ③데이터셋 테이블, ④데이터셋 SVG 그래프, ⑤계산 치트시트)를 모두 포함하고 있습니다. 이로 인해 단일 컴포넌트가 극도로 길어집니다.
2.  **비효율적인 레이아웃 (Problem A):** 메인 레이아웃이 `xl:flex-row`로 되어 있어, 아주 큰 화면(XL)이 아니면 모든 콘텐츠가 1줄로 길게 표시됩니다.
3.  **잘못된 시각화 접근 (Problem B/C - "작고 겹치는 그래프"):**
    * **`DatasetSvgPreview` (겹치는 그래프):** SVG(`<svg>`) 요소 내의 `<text>`에 Tailwind 클래스(`text-sm`, `text-[11px]` 등)를 사용했습니다. Tailwind의 폰트 크기는 `rem` 단위로 고정되지만, SVG의 `viewBox`는 컨테이너에 맞춰 비율대로 축소됩니다. 이 둘이 따로 놀면서, **그래프(viewBox)는 쪼그라드는데 텍스트(rem)는 크기를 유지하려다 보니** 서로 겹치게 됩니다.
    * **`PressureComparisonChart` (안 보이는 그래프):** "정수압(45.33)"과 "점성 저항(0.56)"의 값 차이가 약 80배입니다. 선형(linear) 스케일의 막대그래프로 그리면 점성 저항 막대가 보이지 않는 것은 **의도된 결과**입니다. (`detail.md` 기획서에도 "거의 보이지 않을 정도로 짧음"이라고 명시됨). 이 그래프의 핵심은 막대의 시각적 차이가 아니라, 함께 제공되는 **"Hydrostatic ÷ viscous: 80.0x"** 같은 텍스트 비율입니다.

## 2. 전략적 권고: 컴포넌트 분리 및 재배치

`hydrostatic-simulator.tsx`에 집중된 기능을 분리하여 `app/page.tsx`에서 재조립해야 합니다.

**`app/page.tsx` (수정 제안)**

```tsx
import { HeroSection } from "@/components/hero";
import { AnimatedPhysicsDiagram } from "@/components/animated-physics-diagram";
import { PatientPostureComparison } from "@/components/patient-posture-comparison";
// --- 분리 시작 ---
import { HydrostaticSimulator } from "@/components/hydrostatic-simulator";
import { PressureComparisonChartWrapper } from "@/components/pressure-comparison-chart-wrapper"; // (신규 생성)
import { ReferenceDatasets } from "@/components/reference-datasets"; // (신규 생성)
import { CalculationCheatsheet } from "@/components/calculation-cheatsheet"; // (신규 생성)
// --- 분리 끝 ---
import { ShuntValveSimulator } from "@/components/shunt-valve-simulator";
import { ConclusionSection } from "@/components/conclusion";

export default function Page() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <AnimatedPhysicsDiagram />
      <PatientPostureComparison />

      {/* Q2 섹션을 기능 단위로 분할하여 배치 */}
      <HydrostaticSimulator /> {/* 1. 인터랙티브 시뮬레이터 (가장 핵심) */}
      <PressureComparisonChartWrapper /> {/* 2. 정수압 vs 점성 비교 차트 */}
      <ReferenceDatasets /> {/* 3. 데이터셋 테이블 및 SVG 그래프 */}
      <CalculationCheatsheet /> {/* 4. 계산 치트시트 */}

      <ShuntValveSimulator />
      <ConclusionSection />
    </main>
  );
}
````

## 3\. 전술적 수정 (코드 레벨 가이드)

### 수정 1: `hydrostatic-simulator.tsx` 정리 (Problem A)

이 컴포넌트는 오직 "인터랙티브 시뮬레이터" 기능만 남도록 대폭 축소합니다.

1.  **`hydrostatic-simulator.tsx` 파일:**

      * `PressureComparisonChart`, `DatasetTable`, `DatasetSvgPreview`, `CheatsheetCard` 및 관련 로직( `spinalDataset`, `cheatsheet` 데이터, `computeSpinalChartGeometry` 함수 등)을 **모두 삭제**합니다.
      * 최상위 레이아웃인 `<div className="flex flex-col gap-10 xl:flex-row">`를 **`lg:grid-cols-2`** 와 같이 더 반응적인 그리드 레이아웃으로 변경하여 시뮬레이터와 가정(assumptions) 카드가 적절히 배치되도록 합니다.
      * `PostureFigure`와 상호작용하는 `useState`, `postures`, `assumptions` 데이터만 남깁니다.

    **`hydrostatic-simulator.tsx` (수정 후 구조 예시)**

    ```tsx
    "use client";
    import { useState } from "react";
    // ... PostureFigure, postures, assumptions 정의 ...

    export function HydrostaticSimulator() {
      const [selected, setSelected] = useState(postures[2]);

      return (
        <section>
          <div className="section-wrapper">
            <span className="badge">Q2 · Quantification</span>
            <h2 className="section-title">Hydrostatic head dwarfs viscous losses</h2>
            <p className="section-subtitle max-w-4xl">
              {/* ... 섹션 부제 ... */}
            </p>
            {/* 레이아웃을 xl:flex-row 대신 lg:grid로 변경 */}
            <div className="grid gap-10 lg:grid-cols-2 xl:gap-16">
              {/* 왼쪽 컬럼: 인터랙티브 시뮬레이터 */}
              <div className="card flex-1 space-y-8">
                <div className="grid gap-6 md:grid-cols-[1.1fr,1fr]">
                  <div className="rounded-2xl bg-slate-900/90 p-4">
                    <PostureFigure posture={selected} />
                  </div>
                  <div className="space-y-4">
                    {/* ... Simulation assumptions ... */}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* ... Posture 버튼 ... */}
                </div>
                <div className="space-y-6">
                  {/* ... Metric 카드 ... */}
                </div>
              </div>

              {/* 오른쪽 컬럼: 자세별 압력 비교 막대 그래프 (기존 컴포넌트의 일부) */}
              <div className="flex-1 space-y-6">
                <div className="card bg-slate-900 text-slate-100">
                  <h3 className="text-lg font-semibold">Posture vs. driving pressure</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    {/* ... 설명 ... */}
                  </p>
                  <div className="mt-8 space-y-6">
                    {/* ... 3-bar chart (supine, sitting, standing) ... */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    ```

### 수정 2: 신규 컴포넌트 생성

`hydrostatic-simulator.tsx`에서 삭제한 기능들로 새 컴포넌트를 만듭니다.

  * **`components/pressure-comparison-chart-wrapper.tsx` (Problem B)**

      * `PressureComparisonChart` 컴포넌트와 관련 `postures` 데이터를 가져와 래핑합니다.
      * 이 컴포넌트는 "안 보이는 그래프"가 문제가 아님을 인지해야 합니다. 핵심은 **텍스트와 비율**입니다.
      * **수정 불필요:** `pressure-comparison-chart.tsx`의 막대 너비 로직은 그대로 둡니다. "보이지 않는 것"이 데이터의 핵심(80배 차이)을 전달하는 가장 정직한 방법이며, 기획 의도와도 일치합니다. 별도 섹션으로 분리되어 더 넓은 공간을 확보하는 것만으로도 가독성이 향상됩니다.

  * **`components/reference-datasets.tsx` (Problem C)**

      * `hydrostatic-simulator.tsx`에서 삭제했던 `spinalDataset`, `DatasetTable`, `DatasetSvgPreview`, `computeSpinalChartGeometry` 로직을 이 파일로 옮깁니다.
      * `app/page.tsx`에서 호출할 `ReferenceDatasets` 컴포넌트를 `export` 합니다.
      * **핵심 수정 (`DatasetSvgPreview` 함수 내부):** SVG 내부 `<text>` 요소의 `className`을 **모두 제거**하고, SVG 속성(attribute)이나 `style` 속성을 사용해 스타일을 직접 지정합니다.

    **`DatasetSvgPreview` 수정 예시 (Problem C 해결)**

    ```tsx
    // components/reference-datasets.tsx
    // ... (computeSpinalChartGeometry, spinalDataset 등) ...

    function DatasetSvgPreview({ datasetKey }: { datasetKey: DatasetKey }) {
      // ... (geometry, gradientId 등) ...

      return (
        <figure /* ... */>
          <div className="relative">
            <svg /* ... */>
              {/* ... (defs, rects) ... */}

              {/* [수정] 
                className="fill-white text-[22px] font-semibold tracking-tight" (X)
                대신 SVG 속성을 직접 사용합니다. 
                font-size는 뷰박스 기준 상대 크기이므로 픽셀(px) 대신 단위를 생략하거나 em을 사용합니다.
              */}
              <text
                x={geometry.width / 2}
                y={44}
                textAnchor="middle"
                fill="white"
                fontSize="22"
                fontWeight="600"
                letterSpacing="-0.5"
                // className="fill-white text-[22px] font-semibold tracking-tight" // <-- 제거
              >
                {title}
              </text>
              <text
                x={geometry.width / 2}
                y={70}
                textAnchor="middle"
                fill="#cbd5e1" // (slate-300)
                fontSize="14"
                // className="fill-slate-300 text-sm" // <-- 제거
              >
                Hydrostatic gradient referenced to the umbilicus
              </text>
              
              {/* ... (lines) ... */}
              
              <text
                x={geometry.zeroX}
                y={geometry.chartTop - 14}
                textAnchor="middle"
                fill="#a5f3eb" // (teal-200)
                fontSize="11"
                letterSpacing="0.3em"
                style={{ textTransform: "uppercase" }}
                // className="fill-teal-200 text-[11px] uppercase tracking-[0.3em]" // <-- 제거
              >
                Neutral axis
              </text>

              {/* geometry.bars.map(...) 내부의 <text> 요소들도 동일하게 수정합니다. */}
              {geometry.bars.map((bar) => (
                <g key={bar.level}>
                  {/* ... (rect) ... */}
                  <text
                    x={geometry.margin.left - 28}
                    y={bar.centerY + 5}
                    textAnchor="end"
                    fill="#f1f5f9" // (slate-100)
                    fontSize="15"
                    fontWeight="600"
                    // className="fill-slate-100 text-[15px] font-semibold" // <-- 제거
                  >
                    {bar.level}
                  </text>
                  {/* ... 나머지 모든 <text> 요소의 className을 제거하고 SVG 속성으로 대체 ... */}
                </g>
              ))}
            </svg>
          </div>
          {/* ... (figcaption) ... */}
        </figure>
      );
    }
    ```

  * **`components/calculation-cheatsheet.tsx`**

      * `hydrostatic-simulator.tsx`에서 삭제했던 `cheatsheet` 데이터와 `CheatsheetCard` 컴포넌트 로직을 이 파일로 옮깁니다.
      * `app/page.tsx`에서 호출할 `CalculationCheatsheet` 컴포넌트를 `export` 합니다.

## 4\. 요약

이 가이드라인을 따르면 다음과 같은 개선이 이루어집니다.

1.  **"너무 길쭉한 세션" (A)이 해결됩니다:** Q2 섹션이 4개의 논리적인 컴포넌트로 분리되어, 페이지 스크롤 흐름이 자연스러워집니다.
2.  **"안 보이는 그래프" (B)의 의도가 명확해집니다:** `PressureComparisonChart`가 독립 섹션이 되면서, 막대그래프 자체가 아니라 "수십 배 차이"라는 텍스트 정보에 더 집중할 수 있게 됩니다.
3.  **"겹치는 그래프" (C)가 해결됩니다:** `DatasetSvgPreview` 내부의 `<text>`에서 Tailwind 클래스를 제거하고 SVG 속성을 사용함으로써, 그래프가 컨테이너 크기에 맞춰 축소될 때 텍스트도 함께 깔끔하게 축소되어 더는 겹치지 않습니다.

<!-- end list -->

```
```
