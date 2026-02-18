// npm install lucide-react recharts

import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Home, 
  RotateCcw, 
  BookOpen, 
  Trophy, 
  AlertCircle,
  ChevronRight,
  Save,
  Play
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// -----------------------------------------------------------------------------
// Data: Problems & Explanations (Extracted from provided document)
// -----------------------------------------------------------------------------

const QUIZ_DATA = [
  {
    id: 1,
    category: "品質管理",
    question: "品質管理に関する記述として、最も適切なものはどれか。",
    options: [
      "不合格になるはずのロットが合格になる確率を、消費者危険と呼ぶ。",
      "設計品質は、適合の品質とも呼ばれる。",
      "安全性能が要求される医療機などは、通常抜取検査が実施される。",
      "TQMでは、生産部門の担当者が改善を行って不良の流出を防止する。"
    ],
    correctAnswer: 0,
    explanation: "抜取検査において、本来は不合格のはずのロットを合格にしてしまう（消費者が不良品をつかむ）リスクを「消費者危険」と呼びます。",
    details: [
      { label: "消費者危険", text: "不合格ロットを合格としてしまうリスク（JIS Z 9001）。" },
      { label: "生産者危険", text: "合格ロットを不合格としてしまうリスク。" },
      { label: "設計品質", text: "「ねらいの品質」と呼ばれます。「適合の品質」は製造品質（結果の品質）のことです。" },
      { label: "全数検査", text: "医療機器や高価な製品など、不具合の見逃しが許されない製品に適用されます。" },
      { label: "TQM", text: "生産部門だけでなく、経営戦略としてトップダウンで全社的に実施します。" }
    ]
  },
  {
    id: 2,
    category: "TQM",
    question: "TQM（総合的品質管理）に関する記述として、最も不適切なものはどれか。",
    options: [
      "TQMでは、結果だけに着目するのではなく、プロセスの改善により品質を向上させることを重視している。",
      "TQMの原則には、「目的に関する原則」、「手段に関する原則」、「組織の運営に関する原則」の3つがある。",
      "TQMでは、会社利益の優先ではなく、顧客第一の考え方で活動を進めることを重視している。",
      "TQMの「組織の運営に関する原則」の中には、リーダーシップ、重点志向、人間性尊重、教育訓練の重視がある。"
    ],
    correctAnswer: 3,
    explanation: "「重点志向」は「組織の運営に関する原則」ではなく、「手段に関する原則」に含まれます。",
    tableId: "tqm-principles"
  },
  {
    id: 3,
    category: "QC7つ道具",
    question: "品質管理におけるQC手法を用いる場面の説明として、最も適切なものはどれか。",
    options: [
      "Ｘ－Ｒ管理図を用いて、ブザーの音量と電流値の関連性を調べた。",
      "散布図を用いて、塗装ムラが発生する予想原因を複数のメンバーで議論した。",
      "ヒストグラムを用いて、100個の製品重量のバラツキを調べた。",
      "層別を用いて、製品の重さが許容値内であるか管理した。"
    ],
    correctAnswer: 2,
    explanation: "ヒストグラム（度数分布図）は、データのバラツキの分布形状を見るために使用します。",
    details: [
      { label: "ア（×）", text: "2つの特性の関連性を見るのは「散布図」です。Ｘ－Ｒ管理図は工程の管理に用います。" },
      { label: "イ（×）", text: "原因を議論・整理するのは「特性要因図」です。" },
      { label: "エ（×）", text: "許容値内であるか時系列で管理するのは「管理図」です。" }
    ]
  },
  {
    id: 4,
    category: "QC7つ道具",
    question: "品質管理におけるQC手法の内容について、最も不適切なものはどれか。",
    options: [
      "管理図には、管理限界を示す2本の線が引かれる。",
      "散布図の偽相関とは、2つの特性の間に一見関係がないように見えても、実際に相関があることをいう。",
      "ヒストグラムのデータの分布は、一般には正規分布となる。",
      "特性要因図は、QCサークルで実際に取組む活動内容を決める際に役立つ。"
    ],
    correctAnswer: 1,
    explanation: "「偽相関」とは、一見相関があるように見えても、実際は直接の関係がない（第3の要因が影響している等）ことを指します。記述は逆になっています。",
    tableId: "qc-tools"
  },
  {
    id: 5,
    category: "新QC7つ道具",
    question: "品質管理における新QC7つ道具と、分析内容の組合わせとして、最も適切なものはどれか。",
    options: [
      "連関図法 ― ばらばらの情報をグループにまとめ、問題などを整理する。",
      "親和図法 ― 目標を設定し、そこにいたるまでの手段を系統立てて展開する。",
      "マトリックス図法 ― 数値データを用いて、2つの要素の問題を整理する。",
      "PDPC法 ― 予め発生しそうな問題とその対応策を考えておき、プロジェクトを運営する。"
    ],
    correctAnswer: 3,
    explanation: "PDPC法（Process Decision Program Chart）は、事態の進展とともに様々な結果が想定される問題について、望ましい結果に至るプロセスを定める方法です。",
    details: [
      { label: "ア（×）", text: "ばらばらの情報をまとめるのは「親和図法」です。連関図法は因果関係を整理します。" },
      { label: "イ（×）", text: "手段を系統立てて展開するのは「系統図法」です。" },
      { label: "ウ（×）", text: "数値データを用いて解析するのは「マトリックスデータ解析法」です。マトリックス図法は交点に記号などを入れます。" }
    ]
  },
  {
    id: 6,
    category: "設備保全活動",
    question: "設備の保全活動に関する記述として、最も適切なものはどれか。",
    options: [
      "プレス機がよく停止するため、故障が起こりにくくなるように改善した。これを予防保全と呼ぶ。",
      "加工機のオイルの交換時期がきたので交換した。これを事後保全と呼ぶ。",
      "新しい切削マシンの導入時に、現行機種の保全実績を考慮して機種を選定した。これを保全予防と呼ぶ。",
      "測定器の電池が切れたので新品に交換した。これを改良保全と呼ぶ。"
    ],
    correctAnswer: 2,
    explanation: "保全予防（Maintenance Prevention）は、新しい設備を計画・設計する段階から、過去の保全実績や新技術を取り入れ、信頼性・保全性・経済性の高い設備とすることです。",
    tableId: "maintenance-types"
  },
  {
    id: 7,
    category: "設備保全活動",
    question: "TPM(Total Productive Maintenance)における自主保全活動に関する記述として、最も不適切なものはどれか。",
    options: [
      "経営トップから第一線の従業員にいたるまで全員が参加し、ロス・ゼロを達成するための自主保全活動である。",
      "自主保全活動は7つのステップで実施され、最後のステップは「自主管理の徹底」となる。",
      "設備を中心とするゴミ・ヨゴレの一斉排除と給油、増締めは、「自主点検」のステップで実施される。",
      "必要な保全作業や点検を短時間で確実に実施し、維持するための行動基準の作成は、「自主保全仮基準の作成」のステップで実施される。"
    ],
    correctAnswer: 2,
    explanation: "ゴミ・ヨゴレの一斉排除と給油、増締めは、第1ステップの「初期清掃」で実施されます。「自主点検」は第5ステップです。",
    details: [
      { label: "ステップ1", text: "初期清掃（清掃・点検）" },
      { label: "ステップ2", text: "発生源・困難箇所対策" },
      { label: "ステップ3", text: "自主保全仮基準の作成" },
      { label: "ステップ4", text: "総点検" },
      { label: "ステップ5", text: "自主点検" }
    ]
  },
  {
    id: 8,
    category: "設備効率",
    question: "設備効率に関する文中の空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものはどれか。\n「設備効率を表す指標には、（　Ａ　）、性能稼働率、良品率がある。これら3つの指標を掛け合わせることで、設備の全体の効率である、（　Ｂ　）が求められる。このうち（　Ａ　）を高めるには設備故障を防止したり、（　Ｃ　）を極力短くする必要がある。また性能稼働率を高めるには、設備が一時的に停止する（　Ｄ　）や、空転、速度低下などの無駄を極力減らす必要がある。」",
    options: [
      "Ａ：設備稼働率　Ｂ：全体設備効率　Ｃ：標準時間　Ｄ：チョコ停",
      "Ａ：時間稼働率　Ｂ：全体設備効率　Ｃ：段取り時間　Ｄ：ロス停",
      "Ａ：設備稼働率　Ｂ：設備総合効率　Ｃ：標準時間　Ｄ：ロス停",
      "Ａ：時間稼働率　Ｂ：設備総合効率　Ｃ：段取り時間　Ｄ：チョコ停"
    ],
    correctAnswer: 3,
    explanation: "設備総合効率 ＝ 時間稼働率 × 性能稼働率 × 良品率 で求められます。",
    details: [
      { label: "時間稼働率", text: "停止ロス（故障、段取り調整）を除いた稼働割合。" },
      { label: "性能稼働率", text: "性能ロス（チョコ停、空転、速度低下）を除いた稼働割合。" },
      { label: "良品率", text: "不良ロス（不良、手直し）を除いた良品の割合。" }
    ]
  },
  {
    id: 9,
    category: "設備の評価指標",
    question: "設備の評価指標に関する記述として、最も適切なものはどれか。",
    options: [
      "MTBFは、故障した設備が稼働できる状態に修復するための時間の平均値である。",
      "MTTRは、故障した設備が修復してから次に故障するまでの時間の平均値である。",
      "可用率とは、設備が必要とされるときに使用中または運転可能な状態にある確率である。",
      "可用率は、MTTR÷（MTBF＋MTTR）で求めることができる。"
    ],
    correctAnswer: 2,
    explanation: "可用率（アベイラビリティ）は、必要な時に使える確率です。計算式は MTBF ÷ (MTBF + MTTR) です。",
    details: [
      { label: "MTBF", text: "Mean Time Between Failures（平均故障間隔）。信頼性の指標。" },
      { label: "MTTR", text: "Mean Time To Repair（平均修復時間）。保全性の指標。" },
      { label: "誤答エ", text: "分子がMTTRになっていますが、正しくはMTBFです。" }
    ]
  },
  {
    id: 10,
    category: "環境保全",
    question: "環境保全に関する記述として、最も適切なものはどれか。",
    options: [
      "環境基本法では、事業者の責務として、廃棄物の適正処理、公害防止、環境負荷の低減、再生資源の利用などを挙げている。",
      "廃棄物削減に取組む3つの観点として、リジェクト、リユース、リサイクルがある。",
      "循環型社会形成推進基本法では、廃棄物の処理の優先順位を ①発生抑制、②再生利用、③再利用、④熱回収、⑤適正処分 の順で決めている。",
      "企業が排出する廃棄物の量をゼロにする取組みのことを、ゼロディフェクトと呼ぶ。"
    ],
    correctAnswer: 0,
    explanation: "環境基本法に基づく記述として適切です。",
    details: [
      { label: "3R", text: "リデュース(発生抑制)、リユース(再使用)、リサイクル(再生利用)。リジェクトは含まれません。" },
      { label: "優先順位", text: "①発生抑制(リデュース) ②再使用(リユース) ③再生利用(リサイクル) ④熱回収 ⑤適正処分 の順です。" },
      { label: "ゼロエミッション", text: "廃棄物をゼロにする取り組み。ゼロディフェクトは不良品ゼロの運動です。" }
    ]
  },
  {
    id: 11,
    category: "開発･設計システム",
    question: "コンピュータを用いた開発・設計の情報システムに関する記述として、最も適切なものはどれか。",
    options: [
      "強度に不安がある部品のモデルをコンピュータ上に作成し、強度のシミュレーションを行うのに、「CAD」を用いた。",
      "新製品を開発するにあたり、前モデルと同じ部品を使用する部分については、その部品の「CAE」データを再利用しながら設計を進めた。",
      "コンピューター上の部品設計データを、「CAM」を用いて加工機械で使えるデータに変換した。",
      "設計・開発に関わるすべての情報を一元化して管理し、複数部門で共有ができるように、「CAI」を導入した。"
    ],
    correctAnswer: 2,
    explanation: "CAM（Computer Aided Manufacturing）は、CAD等で作成した形状データを、NC工作機械等で加工するためのデータ（NCプログラムなど）に変換・作成するシステムです。",
    details: [
      { label: "CAD", text: "設計（Design）を支援するシステム。" },
      { label: "CAE", text: "解析・シミュレーション（Engineering）を支援するシステム。" },
      { label: "PDM", text: "製品データ管理。選択肢エの説明に該当します。" },
      { label: "CAI", text: "教育（Instruction）を支援するシステム。" }
    ]
  },
  {
    id: 12,
    category: "製造の情報システム",
    question: "製造の情報システムの内容の組合せとして、最も不適切なものはどれか。",
    options: [
      "NC － 入力された、切削用工具の刃先の加工動作情報をもとに、動作する機械。",
      "MC － 自動工具交換機能をもち、1台でさまざまな加工ができる機械。",
      "FMC － まとまった工程を自動化できるように、機械を組み合わせたもの。",
      "FMS － 生産だけでなく、受注や設計、物流なども含めて全体を管理するシステム。"
    ],
    correctAnswer: 3,
    explanation: "FMS（Flexible Manufacturing System）は、複数のFMCや自動搬送装置などで構成される生産ライン全体のシステムです。選択肢の説明（受注や設計、物流も含める）は、CIM（Computer Integrated Manufacturing）の内容です。",
    tableId: "mfg-systems"
  },
  {
    id: 13,
    category: "SCM",
    question: "サプライチェーンマネジメントについて、JISの定義の中では、その目標を次のように記載している。文中の空欄A～Dに入る用語の組合せとして、もっとも適切なものはどれか。\n「SCMの目標は、（　Ａ　）マネジメントを実現するとともに、最新情報技術及び制約理論、APSというサプライチェーン計画などの管理技術に基づき、（　Ｂ　）の変化に対してサプライチェーン全体を（　Ｃ　）に変化させ、ダイナミックな環境のもとで部門間や企業間における業務の（　Ｄ　）を図ることである。」",
    options: [
      "Ａ：キャッシュフロー　Ｂ：景気　Ｃ：俊敏　Ｄ：効率最適化",
      "Ａ：顧客重視　Ｂ：市場　Ｃ：柔軟　Ｄ：全体最適化",
      "Ａ：キャッシュフロー　Ｂ：市場　Ｃ：俊敏　Ｄ：全体最適化",
      "Ａ：顧客重視　Ｂ：景気　Ｃ：柔軟　Ｄ：効率最適化"
    ],
    correctAnswer: 2,
    explanation: "JISにおけるSCMの定義では、「キャッシュフロー」「市場の変化」「俊敏（アジリティ）」「全体最適化」がキーワードとなります。",
    details: [
      { label: "目的", text: "部分最適ではなく、サプライチェーン全体の最適化を図ること。" },
      { label: "効果", text: "在庫削減、リードタイム短縮、キャッシュフローの向上。" }
    ]
  }
];

// -----------------------------------------------------------------------------
// Component: Table Renderer (Handling Specific Table Layouts)
// -----------------------------------------------------------------------------

const ExplanationTable = ({ tableId }) => {
  if (!tableId) return null;

  if (tableId === "tqm-principles") {
    return (
      <div className="overflow-x-auto my-4 border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 font-bold border-b">
            <tr>
              <th className="px-4 py-2">原則</th>
              <th className="px-4 py-2">内容</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr><td className="px-4 py-2 font-semibold">目的に関する原則</td><td className="px-4 py-2">品質第一、後工程はお客様、マーケットイン</td></tr>
            <tr><td className="px-4 py-2 font-semibold">手段に関する原則</td><td className="px-4 py-2">プロセス重視、源流管理、標準化、事実に基づく管理、重点志向、PDCA、再発防止、未然防止</td></tr>
            <tr><td className="px-4 py-2 font-semibold">組織の運営に関する原則</td><td className="px-4 py-2">リーダーシップ、全員参加、人間性尊重、教育訓練の重視</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (tableId === "qc-tools") {
    return (
      <div className="overflow-x-auto my-4 border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 font-bold border-b">
            <tr>
              <th className="px-4 py-2">名称</th>
              <th className="px-4 py-2">概要と適用</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr><td className="px-4 py-2 font-semibold">管理図</td><td className="px-4 py-2">時系列データに管理限界線（UCL/LCL）を引き、工程の異常を判定。</td></tr>
            <tr><td className="px-4 py-2 font-semibold">パレート図</td><td className="px-4 py-2">不良項目などを頻度順に並べ、重点課題を明確にする。</td></tr>
            <tr><td className="px-4 py-2 font-semibold">ヒストグラム</td><td className="px-4 py-2">データの度数分布を表示し、バラツキの形状を確認する。</td></tr>
            <tr><td className="px-4 py-2 font-semibold">散布図</td><td className="px-4 py-2">2つの特性の相関関係（正・負・無相関）を見る。※偽相関に注意。</td></tr>
            <tr><td className="px-4 py-2 font-semibold">特性要因図</td><td className="px-4 py-2">結果（特性）と原因（要因）の関係を魚の骨のように整理する。</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (tableId === "maintenance-types") {
    return (
      <div className="overflow-x-auto my-4 border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 font-bold border-b">
            <tr>
              <th className="px-4 py-2">分類</th>
              <th className="px-4 py-2">名称</th>
              <th className="px-4 py-2">活動内容</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-bold" rowSpan="2">維持活動</td>
              <td className="px-4 py-2 font-semibold">予防保全</td>
              <td className="px-4 py-2">故障を未然に防ぐ（定期交換、点検）。</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">事後保全</td>
              <td className="px-4 py-2">故障後の修理。</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold" rowSpan="2">改善活動</td>
              <td className="px-4 py-2 font-semibold">改良保全</td>
              <td className="px-4 py-2">設備自体を故障しにくいように改良する。</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">保全予防</td>
              <td className="px-4 py-2">設計段階から保全不要・容易な設備を計画する。</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (tableId === "mfg-systems") {
    return (
      <div className="overflow-x-auto my-4 border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 font-bold border-b">
            <tr>
              <th className="px-4 py-2">略語</th>
              <th className="px-4 py-2">内容</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr><td className="px-4 py-2 font-semibold">NC/CNC</td><td className="px-4 py-2">数値制御工作機械。</td></tr>
            <tr><td className="px-4 py-2 font-semibold">MC</td><td className="px-4 py-2">マシニングセンタ。自動工具交換機能を持つ。</td></tr>
            <tr><td className="px-4 py-2 font-semibold">FMC</td><td className="px-4 py-2">Flexible Manufacturing Cell。数台の機械とロボットの組合せ（小規模）。</td></tr>
            <tr><td className="px-4 py-2 font-semibold">FMS</td><td className="px-4 py-2">Flexible Manufacturing System。ライン全体の自動化・多品種少量対応。</td></tr>
            <tr><td className="px-4 py-2 font-semibold">CIM</td><td className="px-4 py-2">生産、販売、設計、物流など全社的な統合生産システム。</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

// -----------------------------------------------------------------------------
// Component: App
// -----------------------------------------------------------------------------

export default function App() {
  // State
  const [currentMode, setCurrentMode] = useState('start'); // start, quiz, result, history
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]); // Array of { questionId, isCorrect } for current session
  
  // Persistent Data
  const [globalHistory, setGlobalHistory] = useState([]); // All past attempts
  const [reviewList, setReviewList] = useState([]); // IDs of marked questions

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('app_history') || '[]');
      const savedReview = JSON.parse(localStorage.getItem('app_review_list') || '[]');
      
      if (Array.isArray(savedHistory)) setGlobalHistory(savedHistory);
      if (Array.isArray(savedReview)) setReviewList(savedReview);
      
      console.log('Data loaded successfully');
    } catch (e) {
      console.error('Error loading data from localStorage', e);
      setGlobalHistory([]);
      setReviewList([]);
    }
  }, []);

  // Save to localStorage whenever specific states change
  useEffect(() => {
    try {
      localStorage.setItem('app_history', JSON.stringify(globalHistory));
    } catch (e) {
      console.error('Error saving history', e);
    }
  }, [globalHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('app_review_list', JSON.stringify(reviewList));
    } catch (e) {
      console.error('Error saving review list', e);
    }
  }, [reviewList]);

  // Logic: Start Quiz
  const startQuiz = (mode) => {
    let questionsToAsk = [];

    if (mode === 'all') {
      questionsToAsk = [...QUIZ_DATA];
    } else if (mode === 'review') {
      questionsToAsk = QUIZ_DATA.filter(q => reviewList.includes(q.id));
    } else if (mode === 'mistakes') {
      // Get IDs of questions answered incorrectly in the last attempt for each question
      const mistakeIds = new Set();
      QUIZ_DATA.forEach(q => {
        const attempts = globalHistory.filter(h => h.questionId === q.id);
        if (attempts.length > 0) {
          const lastAttempt = attempts[attempts.length - 1];
          if (!lastAttempt.isCorrect) mistakeIds.add(q.id);
        }
      });
      questionsToAsk = QUIZ_DATA.filter(q => mistakeIds.has(q.id));
    }

    if (questionsToAsk.length === 0) {
      alert("該当する問題がありません。");
      return;
    }

    // Shuffle questions slightly for variety? No, keep order for textbook study.
    setQuizQuestions(questionsToAsk);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizHistory([]);
    setIsAnswered(false);
    setSelectedOption(null);
    setCurrentMode('quiz');
    console.log(`Quiz started: ${mode} mode with ${questionsToAsk.length} questions.`);
  };

  // Logic: Handle Answer
  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const currentQ = quizQuestions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Update current session history
    setQuizHistory(prev => [...prev, {
      questionId: currentQ.id,
      isCorrect: isCorrect,
      userAnswer: optionIndex
    }]);

    // Update global history
    const newRecord = {
      timestamp: new Date().toISOString(),
      questionId: currentQ.id,
      isCorrect: isCorrect
    };
    setGlobalHistory(prev => [...prev, newRecord]);
  };

  // Logic: Next Question
  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      setCurrentMode('result');
    }
  };

  // Logic: Toggle Review Flag
  const toggleReview = (id) => {
    setReviewList(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // ---------------------------------------------------------------------------
  // Screens
  // ---------------------------------------------------------------------------

  const StartScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">生産のオペレーション</h1>
        <p className="text-gray-500 mb-8">スマート問題集 3-6</p>

        <div className="space-y-4">
          <button 
            onClick={() => startQuiz('all')}
            className="w-full flex items-center justify-between p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
          >
            <span className="flex items-center gap-3">
              <Play size={20} /> すべての問題に挑戦
            </span>
            <span className="text-sm bg-blue-500 px-2 py-1 rounded">{QUIZ_DATA.length}問</span>
          </button>

          <button 
            onClick={() => startQuiz('mistakes')}
            className="w-full flex items-center justify-between p-4 bg-white border-2 border-orange-200 text-orange-700 rounded-xl hover:bg-orange-50 transition font-medium"
          >
            <span className="flex items-center gap-3">
              <RotateCcw size={20} /> 前回不正解のみ
            </span>
          </button>

          <button 
            onClick={() => startQuiz('review')}
            className="w-full flex items-center justify-between p-4 bg-white border-2 border-yellow-200 text-yellow-700 rounded-xl hover:bg-yellow-50 transition font-medium"
          >
            <span className="flex items-center gap-3">
              <AlertCircle size={20} /> 要復習の問題
            </span>
            <span className="text-sm bg-yellow-100 px-2 py-1 rounded">
              {reviewList.length}問
            </span>
          </button>

          <div className="pt-4 border-t mt-4">
            <button 
              onClick={() => setCurrentMode('history')}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2 w-full"
            >
              <Trophy size={16} /> 学習履歴を見る
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const QuizScreen = () => {
    const question = quizQuestions[currentQuestionIndex];
    const isReviewMarked = reviewList.includes(question.id);

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-bold text-lg">Q{currentQuestionIndex + 1}</span>
              <span className="text-sm text-gray-400">/ {quizQuestions.length}</span>
            </div>
            <button 
              onClick={() => setCurrentMode('start')}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          {/* Progress Bar */}
          <div className="h-1 bg-gray-100 w-full">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {/* Question Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded uppercase tracking-wider">
                {question.category}
              </span>
            </div>
            <p className="text-lg font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
              {question.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 relative ";
              
              if (isAnswered) {
                if (idx === question.correctAnswer) {
                  btnClass += "bg-green-50 border-green-500 text-green-800";
                } else if (idx === selectedOption) {
                  btnClass += "bg-red-50 border-red-500 text-red-800";
                } else {
                  btnClass += "bg-gray-50 border-gray-200 text-gray-400";
                }
              } else {
                btnClass += "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className="flex gap-3">
                    <span className="font-bold opacity-60">
                      {['ア', 'イ', 'ウ', 'エ'][idx]}.
                    </span>
                    <span>{option}</span>
                  </div>
                  {isAnswered && idx === question.correctAnswer && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
                  )}
                  {isAnswered && idx === selectedOption && idx !== question.correctAnswer && (
                    <X className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Area */}
          {isAnswered && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
              <div className={`p-4 flex items-center justify-between ${selectedOption === question.correctAnswer ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="flex items-center gap-3">
                  {selectedOption === question.correctAnswer ? (
                    <div className="bg-green-500 text-white p-1 rounded-full"><Check size={20} /></div>
                  ) : (
                    <div className="bg-red-500 text-white p-1 rounded-full"><X size={20} /></div>
                  )}
                  <span className={`font-bold ${selectedOption === question.correctAnswer ? 'text-green-800' : 'text-red-800'}`}>
                    {selectedOption === question.correctAnswer ? '正解！' : '不正解...'}
                  </span>
                </div>
                <button 
                  onClick={() => toggleReview(question.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isReviewMarked 
                      ? 'bg-yellow-400 text-white shadow-sm' 
                      : 'bg-white text-gray-500 hover:bg-gray-50 border'
                  }`}
                >
                  <AlertCircle size={16} />
                  {isReviewMarked ? '要復習リスト済' : '要復習に追加'}
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-gray-900 font-bold mb-2">解説</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {question.explanation}
                </p>

                {/* Specific Tables */}
                <ExplanationTable tableId={question.tableId} />

                {/* Bullet Points/Details */}
                {question.details && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    {question.details.map((detail, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-bold text-gray-800 block mb-1">
                          ● {detail.label}
                        </span>
                        <span className="text-gray-600 pl-4 block">
                          {detail.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? '次の問題へ' : '結果を見る'}
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ResultScreen = () => {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    // Chart Data
    const data = [
      { name: '正解', value: score, color: '#22c55e' },
      { name: '不正解', value: quizQuestions.length - score, color: '#ef4444' },
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <div className="max-w-md w-full space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-gray-500 font-medium mb-2">今回の成績</h2>
            <div className="text-5xl font-bold text-gray-900 mb-6">
              {score} <span className="text-xl text-gray-400 font-normal">/ {quizQuestions.length}</span>
            </div>

            <div className="h-48 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <p className="text-lg font-bold text-gray-700 mb-6">
              正答率: <span className="text-blue-600">{percentage}%</span>
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setCurrentMode('start')}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Home size={20} /> ホーム
              </button>
              <button 
                onClick={() => startQuiz('mistakes')}
                className="flex-1 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} /> 再挑戦
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">回答詳細</h3>
            <div className="space-y-3">
              {quizQuestions.map((q, idx) => {
                const historyItem = quizHistory.find(h => h.questionId === q.id);
                const isCorrect = historyItem?.isCorrect;
                
                return (
                  <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        {idx + 1}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-1 w-48">
                        {q.question}
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleReview(q.id)}
                      className={`text-gray-400 hover:text-yellow-500 ${reviewList.includes(q.id) ? 'text-yellow-500' : ''}`}
                    >
                      <AlertCircle size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HistoryScreen = () => {
    // Calculate stats
    const totalAttempts = globalHistory.length;
    const correctAttempts = globalHistory.filter(h => h.isCorrect).length;
    const rate = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">学習履歴</h1>
            <button onClick={() => setCurrentMode('start')} className="p-2 bg-white rounded-full shadow-sm">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-gray-500 text-sm">総回答数</p>
              <p className="text-2xl font-bold text-blue-600">{totalAttempts}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-gray-500 text-sm">通算正答率</p>
              <p className="text-2xl font-bold text-green-600">{rate}%</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">
              問題別正答率
            </div>
            <div className="divide-y max-h-[60vh] overflow-y-auto">
              {QUIZ_DATA.map((q, idx) => {
                const qHistory = globalHistory.filter(h => h.questionId === q.id);
                const qTotal = qHistory.length;
                const qCorrect = qHistory.filter(h => h.isCorrect).length;
                const qRate = qTotal > 0 ? Math.round((qCorrect / qTotal) * 100) : 0;
                
                let colorClass = "text-gray-400";
                if (qTotal > 0) {
                  if (qRate >= 80) colorClass = "text-green-500";
                  else if (qRate >= 50) colorClass = "text-yellow-500";
                  else colorClass = "text-red-500";
                }

                return (
                  <div key={q.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-400 w-6">Q{idx + 1}</span>
                      <span className="text-sm text-gray-800 line-clamp-1 w-40">{q.category}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${colorClass}`}>{qRate}%</span>
                      <span className="text-xs text-gray-400 block">({qCorrect}/{qTotal})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
      {currentMode === 'start' && <StartScreen />}
      {currentMode === 'quiz' && <QuizScreen />}
      {currentMode === 'result' && <ResultScreen />}
      {currentMode === 'history' && <HistoryScreen />}
    </div>
  );
}