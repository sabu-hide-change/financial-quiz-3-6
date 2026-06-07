// npm install lucide-react recharts firebase
import React, { useState, useEffect } from "react";
import { Check, X, Home, ChevronRight, RefreshCw, BarChart2, BookOpen, User, ArrowRight, HelpCircle } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// データの分離用ID
const APP_ID = "QuizApp_Production_Operations_001";

// Firebase設定 (環境変数を使用)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase初期化
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ==========================================
// インラインSVG & HTML 図表コンポーネント
// ==========================================

// 問題5用の縦型製品工程分析図
const Question5Svg = () => (
  <div className="flex justify-center my-6">
    <svg width="140" height="500" viewBox="0 0 140 500" className="bg-slate-50 border border-slate-200 rounded-lg p-2 shadow-inner">
      {/* 縦の接続線 */}
      <line x1="70" y1="20" x2="70" y2="480" stroke="#475569" strokeWidth="3" />
      
      {/* 1. 貯蔵 ▽ (逆三角形) */}
      <polygon points="40,20 100,20 70,55" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
      <text x="70" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">貯蔵</text>
      <text x="110" y="38" fontSize="10" fill="#64748b" fontWeight="semibold">① 貯蔵</text>

      {/* 2. 運搬 ○ (小) */}
      <circle cx="70" cy="90" r="14" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
      <text x="70" y="93" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">運</text>
      <text x="110" y="94" fontSize="10" fill="#64748b" fontWeight="semibold">② 運搬</text>

      {/* 3. 滞留 D */}
      <path d="M 50,130 L 75,130 A 20,20 0 0,1 75,170 L 50,170 Z" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
      <text x="65" y="153" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">滞留</text>
      <text x="110" y="154" fontSize="10" fill="#64748b" fontWeight="semibold">③ 滞留</text>

      {/* 4. 運搬 ○ (小) */}
      <circle cx="70" cy="210" r="14" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
      <text x="70" y="213" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">運</text>
      <text x="110" y="214" fontSize="10" fill="#64748b" fontWeight="semibold">④ 運搬</text>

      {/* 5. 加工 ○ (大) */}
      <circle cx="70" cy="270" r="24" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" />
      <text x="70" y="274" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e293b">加工</text>
      <text x="110" y="274" fontSize="10" fill="#64748b" fontWeight="semibold">⑤ 加工</text>

      {/* 6. 運搬 ○ (小) */}
      <circle cx="70" cy="330" r="14" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
      <text x="70" y="333" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">運</text>
      <text x="110" y="334" fontSize="10" fill="#64748b" fontWeight="semibold">⑥ 運搬</text>

      {/* 7. 品質検査 ◇ (ひし形) */}
      <polygon points="70,365 95,390 70,415 45,390" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
      <text x="70" y="394" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">検査</text>
      <text x="110" y="394" fontSize="10" fill="#64748b" fontWeight="semibold">⑦ 検査</text>

      {/* 8. 運搬 ○ (小) */}
      <circle cx="70" cy="445" r="14" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
      <text x="70" y="448" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">運</text>
      <text x="110" y="449" fontSize="10" fill="#64748b" fontWeight="semibold">⑧ 運搬</text>

      {/* 9. 貯蔵 ▽ (逆三角形) */}
      <polygon points="40,480 100,480 70,480" fill="none" />
      <polygon points="40,465 100,465 70,495" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
      <text x="70" y="477" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">貯蔵</text>
      <text x="110" y="482" fontSize="10" fill="#64748b" fontWeight="semibold">⑨ 貯蔵</text>
    </svg>
  </div>
);

// 問題6用のフロムツーチャート (HTML Table)
const Question6FromToTable = ({ isExplanation = false }) => (
  <div className="my-6 overflow-x-auto">
    <table className="border-collapse border border-slate-400 w-full max-w-md mx-auto text-center bg-white text-xs shadow-md">
      <thead>
        <tr className="bg-slate-100 font-bold">
          <th className="border border-slate-400 p-2 relative w-16 h-12 bg-slate-50">
            <span className="absolute top-1 right-2 text-[10px]">To</span>
            <span className="absolute bottom-1 left-2 text-[10px]">From</span>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="#94a3b8" strokeWidth="1"/>
            </svg>
          </th>
          <th className="border border-slate-400 p-2 font-bold text-slate-800">A</th>
          <th className="border border-slate-400 p-2 font-bold text-slate-800">B</th>
          <th className="border border-slate-400 p-2 font-bold text-slate-800">C</th>
          <th className="border border-slate-400 p-2 font-bold text-slate-800">D</th>
          <th className="border border-slate-400 p-2 font-bold text-slate-800">E</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-slate-400 p-2 font-bold bg-slate-50">A</td>
          <td className="border border-slate-400 p-2 bg-slate-200"></td>
          <td className="border border-slate-400 p-2 font-semibold">1</td>
          <td className="border border-slate-400 p-2 font-semibold">2</td>
          <td className="border border-slate-400 p-2 font-semibold">3</td>
          <td className="border border-slate-400 p-2 font-semibold">4</td>
        </tr>
        <tr>
          <td className="border border-slate-400 p-2 font-bold bg-slate-50">B</td>
          <td className="border border-slate-400 p-2"></td>
          <td className="border border-slate-400 p-2 bg-slate-200"></td>
          <td className="border border-slate-400 p-2 font-semibold">2</td>
          <td className="border border-slate-400 p-2 font-semibold">3</td>
          <td className="border border-slate-400 p-2"></td>
        </tr>
        <tr>
          <td className="border border-slate-400 p-2 font-bold bg-slate-50">C</td>
          <td className="border border-slate-400 p-2"></td>
          <td className={`border border-slate-400 p-2 font-bold ${isExplanation ? "bg-red-50 text-red-600 ring-2 ring-red-400" : "font-semibold"}`}>1</td>
          <td className="border border-slate-400 p-2 bg-slate-200"></td>
          <td className="border border-slate-400 p-2"></td>
          <td className="border border-slate-400 p-2 font-semibold">1</td>
        </tr>
        <tr>
          <td className="border border-slate-400 p-2 font-bold bg-slate-50">D</td>
          <td className="border border-slate-400 p-2"></td>
          <td className="border border-slate-400 p-2"></td>
          <td className="border border-slate-400 p-2"></td>
          <td className="border border-slate-400 p-2 bg-slate-200"></td>
          <td className="border border-slate-400 p-2 font-semibold">4</td>
        </tr>
        <tr>
          <td className="border border-slate-400 p-2 font-bold bg-slate-50">E</td>
          <td className="border border-slate-400 p-2"></td>
          <td className="border border-slate-400 p-2"></td>
          <td className="border border-slate-400 p-2"></td>
          <td className="border border-slate-400 p-2"></td>
          <td className="border border-slate-400 p-2 bg-slate-200"></td>
        </tr>
      </tbody>
    </table>
    {`${isExplanation ? `<div className="text-center mt-2 text-[10px] text-red-600 font-bold">※ C→B (FROM:C, TO:B) に「1」があるため、アルファベット順と逆の「逆流」が発生しています。</div>` : ""}`}
  </div>
);

// 問題1用 IE体系ツリー
const IETreeDiagram = () => (
  <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-slate-200 my-4 text-xs max-w-md mx-auto shadow-sm">
    <div className="bg-indigo-600 text-white px-4 py-2 rounded-md font-bold shadow-md mb-4 text-center w-full">IE (Industrial Engineering)</div>
    <div className="flex w-full justify-around relative">
      <div className="flex flex-col items-center w-1/2 px-2 border-r border-dashed border-slate-300">
        <div className="bg-emerald-600 text-white px-3 py-1 rounded font-semibold shadow-sm mb-3">方法研究</div>
        <div className="space-y-2 w-full max-w-[150px]">
          <div className="bg-white border border-slate-300 p-2 rounded text-center shadow-xs">工程分析</div>
          <div className="bg-white border border-slate-300 p-2 rounded text-center shadow-xs">動作研究</div>
        </div>
      </div>
      <div className="flex flex-col items-center w-1/2 px-2">
        <div className="bg-sky-600 text-white px-3 py-1 rounded font-semibold shadow-sm mb-3">作業測定</div>
        <div className="space-y-2 w-full max-w-[150px]">
          <div className="bg-white border border-slate-300 p-2 rounded text-center shadow-xs font-semibold">時間研究</div>
          <div className="bg-white border border-slate-300 p-2 rounded text-center shadow-xs">稼働分析</div>
        </div>
      </div>
    </div>
  </div>
);

// 問題2/5解説用 JIS工程記号表
const JISSymbolsTable = () => (
  <div className="my-4 overflow-x-auto shadow-sm rounded-lg border border-slate-200">
    <table className="w-full text-xs text-left border-collapse bg-white">
      <thead>
        <tr className="bg-slate-100 font-bold border-b border-slate-200">
          <th className="p-2 text-center w-16">記号</th>
          <th className="p-2 w-20">名称</th>
          <th className="p-2">内容</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-100">
          <td className="p-2 text-center font-bold text-lg text-emerald-600">○</td>
          <td className="p-2 font-semibold">加工</td>
          <td className="p-2 text-slate-600">原材料や部品の形状を変える、組み立てるなど、製品に付加価値を与える工程。</td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-2 text-center font-bold text-lg text-sky-600">⇒ / ◯(小)</td>
          <td className="p-2 font-semibold">運搬</td>
          <td className="p-2 text-slate-600">物や作業者を別の場所に移動させる工程。</td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-2 text-center font-bold text-lg text-amber-600">▽</td>
          <td className="p-2 font-semibold">貯蔵 (停滞)</td>
          <td className="p-2 text-slate-600">計画的な保管状態。許可なしには動かせない（倉庫での保管など）。</td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-2 text-center font-bold text-lg text-orange-600">D</td>
          <td className="p-2 font-semibold">滞留 (停滞)</td>
          <td className="p-2 text-slate-600">計画外の一時的な待ち状態（次の工程への仕掛品待ち、接着剤の乾燥待ちなど）。</td>
        </tr>
        <tr>
          <td className="p-2 text-center font-bold text-lg text-indigo-600">□ / ◇</td>
          <td className="p-2 font-semibold">検査</td>
          <td className="p-2 text-slate-600">□は数量検査（個数や重量）、◇は品質検査（規格や性能）。規格と比較して合否を判定する。</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// 問題3解説用
const ProcessAnalysisDiagram = () => (
  <div className="my-4 flex flex-col items-center p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs max-w-md mx-auto shadow-sm">
    <div className="bg-emerald-600 text-white px-3 py-1 rounded font-bold shadow-xs mb-3 text-center">工程分析の分類</div>
    <div className="flex w-full justify-around">
      <div className="flex flex-col items-center w-1/2 border-r border-slate-200 px-1">
        <div className="font-semibold text-slate-800 mb-2">製品・作業者の工程分析</div>
        <div className="space-y-1 text-center w-full">
          <div className="bg-white p-1.5 rounded border border-slate-300">単純工程分析</div>
          <div className="bg-white p-1.5 rounded border border-slate-300">製品工程分析</div>
          <div className="bg-white p-1.5 rounded border border-slate-300">作業者工程分析</div>
        </div>
      </div>
      <div className="flex flex-col items-center w-1/2 px-1">
        <div className="font-semibold text-slate-800 mb-2">流動・配置の分析</div>
        <div className="space-y-1 text-center w-full">
          <div className="bg-white p-1.5 rounded border border-slate-300">流れ線図</div>
          <div className="bg-white p-1.5 rounded border border-slate-300">フロムツーチャート</div>
        </div>
      </div>
    </div>
  </div>
);

// 問題4解説用
const ProcessAnalysisApplicationTable = () => (
  <div className="my-4 overflow-x-auto shadow-sm rounded-lg border border-slate-200">
    <table className="w-full text-xs text-left border-collapse bg-white">
      <thead>
        <tr className="bg-slate-100 font-bold border-b border-slate-200">
          <th className="p-2 w-28">分析手法</th>
          <th className="p-2">主な目的・適用場面</th>
          <th className="p-2">特徴</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-slate-700 bg-slate-50">単純工程分析</td>
          <td className="p-2 text-slate-600">全体の加工プロセスの把握、工場レイアウト設計の初期段階。</td>
          <td className="p-2 text-slate-500">加工と検査のみを表記。運搬・停滞は除外して単純化。</td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-slate-700 bg-slate-50">製品工程分析</td>
          <td className="p-2 text-slate-600">製品の工程改善、停滞時間・距離の削減。</td>
          <td className="p-2 text-slate-500 font-medium">加工・運搬・検査・停滞をすべて追跡して時系列で記録。</td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-slate-700 bg-slate-50">流れ線図</td>
          <td className="p-2 text-slate-600">工場の機械・設備レイアウトの改善、運搬経路の無駄排除。</td>
          <td className="p-2 text-slate-500">実際のレイアウト図の上に工程図記号をプロットして流れを可視化。</td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-slate-700 bg-slate-50">作業者工程分析</td>
          <td className="p-2 text-slate-600">作業手順の標準化、作業の無駄（手待ち等）の改善。</td>
          <td className="p-2 text-slate-500">「作業者」の動きを中心に加工・移動・手待ち・検査を分析。</td>
        </tr>
        <tr>
          <td className="p-2 font-bold text-slate-700 bg-slate-50">フロムツーチャート</td>
          <td className="p-2 text-slate-600">多品種少量生産の工程分析、工程間の正流・逆流物量の把握。</td>
          <td className="p-2 text-slate-500">From/To のマトリクス表で工程間の移動量・重量・距離を表現。</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// 問題7解説用
const HandlingAnalysisDiagram = () => (
  <div className="my-4 space-y-4">
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs shadow-sm">
      <div className="font-bold text-slate-800 mb-2 text-center">運搬工程分析記号の分類</div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-white p-2 rounded border border-slate-200">
          <div className="font-bold text-sky-700 mb-1">台記号</div>
          <div className="space-y-1 text-slate-600 font-mono text-[10px]">
            <div>◯ : 平 (床置き)</div>
            <div>⨀ : 箱 (容器内)</div>
            <div>⨂ : パレット (台の上)</div>
            <div>⨃ : 車台 (移動車)</div>
          </div>
        </div>
        <div className="bg-white p-2 rounded border border-slate-200">
          <div className="font-bold text-indigo-700 mb-1">経路・移動</div>
          <div className="space-y-1 text-slate-600 font-mono text-[10px]">
            <div>直線 : 直線移動</div>
            <div>波線 : エレベータ等</div>
            <div>矢印 (→) : 移動方向</div>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-slate-800 text-slate-100 p-3 rounded-lg text-center font-mono shadow-sm">
      <div className="text-sky-400 font-bold mb-1 text-xs">空運搬係数の公式</div>
      <div className="text-xs">空運搬係数 ＝ 空運搬距離 ÷ 品物の移動距離</div>
      <div className="text-[9px] text-slate-400 mt-1">※空運搬：物を運ばずに空で移動する距離</div>
    </div>
  </div>
);

// 問題8/9解説用
const ActivityAnalysisDiagram = () => (
  <div className="my-4 space-y-4">
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs shadow-sm">
      <div className="font-bold text-slate-800 mb-2 text-center">工程ごとの活性示数 (本問の例)</div>
      <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px]">
        <li>鉄の棒材が床に平置き : <span className="font-bold text-red-600">示数 0</span></li>
        <li>搬送用の箱に鉄の棒材を入れる : <span className="font-bold text-orange-600">示数 1</span></li>
        <li>パレットに搬送用の箱を乗せる : <span className="font-bold text-yellow-600">示数 2</span></li>
        <li>フォークリフトでパレットを運ぶ : <span className="font-bold text-green-600">示数 4</span> (移動中)</li>
        <li>トラックにパレットを積み運ぶ : <span className="font-bold text-green-600">示数 4</span> (移動中)</li>
        <li>フォークリフトでパレットを降ろす : <span className="font-bold text-green-600">示数 4</span> (移動中)</li>
        <li>パレットを所定場所に置く : <span className="font-bold text-yellow-600">示数 2</span></li>
      </ol>
      <div className="bg-slate-800 text-slate-100 p-2 rounded text-center font-mono mt-3 text-xs">
        <div className="text-sky-400 font-bold">平均活性示数の計算</div>
        <div>(0 + 1 + 2 + 4 + 4 + 4 + 2) ÷ 7 = 17 ÷ 7 ≒ <span className="text-yellow-400 font-bold text-sm">2.4</span></div>
      </div>
    </div>
    
    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
      <div className="text-[10px] font-bold text-slate-500 text-center mb-2">運搬活性分析図イメージ</div>
      <svg width="260" height="110" viewBox="0 0 260 110" className="mx-auto">
        <line x1="30" y1="15" x2="250" y2="15" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="30" y1="35" x2="250" y2="35" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="30" y1="55" x2="250" y2="55" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="30" y1="75" x2="250" y2="75" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="30" y1="95" x2="250" y2="95" stroke="#cbd5e1" strokeWidth="1.5" />
        
        <text x="25" y="18" textAnchor="end" fontSize="7" fill="#64748b">4 (移動)</text>
        <text x="25" y="38" textAnchor="end" fontSize="7" fill="#64748b">3 (車台)</text>
        <text x="25" y="58" textAnchor="end" fontSize="7" fill="#64748b">2 (パレ)</text>
        <text x="25" y="78" textAnchor="end" fontSize="7" fill="#64748b">1 (箱)</text>
        <text x="25" y="98" textAnchor="end" fontSize="7" fill="#64748b">0 (平)</text>
        
        <rect x="40" y="95" width="12" height="0" fill="#ef4444" />
        <text x="46" y="106" textAnchor="middle" fontSize="7" fill="#64748b">①</text>
        
        <rect x="70" y="75" width="12" height="20" fill="#f97316" />
        <text x="76" y="106" textAnchor="middle" fontSize="7" fill="#64748b">②</text>
        
        <rect x="100" y="55" width="12" height="40" fill="#eab308" />
        <text x="106" y="106" textAnchor="middle" fontSize="7" fill="#64748b">③</text>
        
        <rect x="130" y="15" width="12" height="80" fill="#22c55e" />
        <text x="136" y="106" textAnchor="middle" fontSize="7" fill="#64748b">④</text>
        
        <rect x="160" y="15" width="12" height="80" fill="#22c55e" />
        <text x="166" y="106" textAnchor="middle" fontSize="7" fill="#64748b">⑤</text>
        
        <rect x="190" y="15" width="12" height="80" fill="#22c55e" />
        <text x="196" y="106" textAnchor="middle" fontSize="7" fill="#64748b">⑥</text>
        
        <rect x="220" y="55" width="12" height="40" fill="#eab308" />
        <text x="226" y="106" textAnchor="middle" fontSize="7" fill="#64748b">⑦</text>
      </svg>
    </div>
  </div>
);

// 問題10解説用
const TherbligAnalysisTable = () => (
  <div className="my-4 overflow-x-auto shadow-sm rounded-lg border border-slate-200">
    <table className="w-full text-xs text-left border-collapse bg-white">
      <thead>
        <tr className="bg-slate-100 font-bold border-b border-slate-200">
          <th className="p-2 w-16">分類</th>
          <th className="p-2">定義</th>
          <th className="p-2">該当する動作例</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-emerald-800 bg-emerald-50 text-center">第1類</td>
          <td className="p-2 font-semibold">作業を行うために直接必要な動作</td>
          <td className="p-2 text-slate-600">手を伸ばす、つかむ、運ぶ、位置決めする、組み立てる、使う、放す</td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-sky-800 bg-sky-50 text-center">第2類</td>
          <td className="p-2 font-semibold">第1類の動作を遅らせる原因となる動作</td>
          <td className="p-2 text-slate-600">探す、見つけ出す、選ぶ、考える、調べる、準備する</td>
        </tr>
        <tr>
          <td className="p-2 font-bold text-red-800 bg-red-50 text-center">第3類</td>
          <td className="p-2 font-semibold">作業に必要がなく、疲労や遅れの原因となる動作（無駄）</td>
          <td className="p-2 text-slate-600">保持する（手で固定する）、避けることのできない遅れ、避けることのできる遅れ、休息、手待ち</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// 問題11解説用
const MotionEconomyPrinciplesTable = () => (
  <div className="my-4 overflow-x-auto shadow-sm rounded-lg border border-slate-200">
    <table className="w-full text-xs text-left border-collapse bg-white">
      <thead>
        <tr className="bg-slate-100 font-bold border-b border-slate-200">
          <th className="p-2 w-28">原則の分類</th>
          <th className="p-2">具体的な改善指針・原則の例</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-slate-700 bg-slate-50">身体の動作</td>
          <td className="p-2 text-slate-600 leading-relaxed">
            ・両手は同時に、左右対称的に、反対方向に動かし始めること。<br/>
            ・基本動作の数を極力少なくし、最短経路で行うこと。<br/>
            ・動作をリズミカルにし、急激な方向転換を避ける。
          </td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-slate-700 bg-slate-50">作業場の配置</td>
          <td className="p-2 text-slate-600 leading-relaxed">
            ・材料や工具は、体の前方に、手の届く範囲で配置すること。<br/>
            ・材料や工具は、作業順序に合わせて定位置に配置する（探す手間の排除）。<br/>
            ・重力などを利用し、供給・排出を楽にする。
          </td>
        </tr>
        <tr>
          <td className="p-2 font-bold text-slate-700 bg-slate-50">工具や設備</td>
          <td className="p-2 text-slate-600 leading-relaxed">
            ・手で保持する代わりに、治具やクランプで固定すること。<br/>
            ・2つ以上の工具を組み合わせて複合工具にする。<br/>
            ・ペダルなど足操作を利用し、手を他の作業に空ける。
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// 問題12/13解説用
const WorkSamplingVsContinuousTable = () => (
  <div className="my-4 overflow-x-auto shadow-sm rounded-lg border border-slate-200">
    <table className="w-full text-xs text-left border-collapse bg-white">
      <thead>
        <tr className="bg-slate-100 font-bold border-b border-slate-200">
          <th className="p-2 w-20">測定手法</th>
          <th className="p-2">メリット</th>
          <th className="p-2">デメリット・不向きな点</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-emerald-800 bg-emerald-50">ワークサンプリング<br/>(瞬間観測)</td>
          <td className="p-2 text-slate-600 leading-relaxed">
            ・付きっきりの必要がなく、測定の労力が少ない。<br/>
            ・1人で多くの対象を同時に測定できる。<br/>
            ・作業者が意識しないため、偏りのないデータが取れる。
          </td>
          <td className="p-2 text-slate-500 leading-relaxed">
            ・瞬間的な観測であるため、発生頻度の極めて低い作業や、非周期的な作業の深い分析には向かない。<br/>
            ・サンプル数が少ないと誤差が大きくなる。
          </td>
        </tr>
        <tr>
          <td className="p-2 font-bold text-sky-800 bg-sky-50">連続観測法<br/>(付きっきり)</td>
          <td className="p-2 text-slate-600 leading-relaxed">
            ・時系列の詳細なデータが取れ、作業の無駄や細かい流れを深く分析できる。<br/>
            ・繰返しのない非定常作業や、複雑な作業プロセスの観測に適する。
          </td>
          <td className="p-2 text-slate-500 leading-relaxed">
            ・測定に付きっきりの多大な時間と手間がかかる。<br/>
            ・観測者がそばにいるため、作業者が意識して通常と異なるペースになりやすい。
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

// 問題14/16解説用
const StandardTimeFormulas = () => (
  <div className="my-4 space-y-3">
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs shadow-sm">
      <div className="font-bold text-indigo-700 mb-1 text-center">標準時間の構成関係</div>
      <div className="flex flex-col space-y-1 bg-white p-2 rounded border border-slate-300 font-mono text-center text-slate-700">
        <div>標準時間 ＝ 正味時間 ＋ 余裕時間</div>
        <div className="text-[10px] text-slate-500">
          正味時間 ＝ 主体作業時間 ＋ 準備段取り時間<br/>
          余裕時間 ＝ 管理余裕 ＋ 人的余裕
        </div>
      </div>
    </div>
    
    <div className="bg-slate-800 text-slate-100 p-3 rounded-lg text-xs font-mono shadow-sm">
      <div className="text-sky-400 font-bold text-center mb-2">余裕率の２つの計算方法</div>
      <div className="space-y-3">
        <div className="border-b border-slate-700 pb-2">
          <div className="font-bold text-yellow-400">■ 外掛け法 (正味時間に対する割合)</div>
          <div className="pl-2">余裕率 ＝ 余裕時間 ÷ 正味時間</div>
          <div className="pl-2 text-[10px] text-slate-400">標準時間 ＝ 正味時間 × (1 ＋ 余裕率)</div>
        </div>
        <div>
          <div className="font-bold text-yellow-400">■ 内掛け法 (標準時間に対する割合)</div>
          <div className="pl-2">余裕率 ＝ 余裕時間 ÷ 標準時間</div>
          <div className="pl-2 text-[10px] text-slate-400">標準時間 ＝ 正味時間 ÷ (1 － 余裕率)</div>
        </div>
      </div>
    </div>
  </div>
);

// 問題15解説用
const StandardTimeSettingMethodsTable = () => (
  <div className="my-4 overflow-x-auto shadow-sm rounded-lg border border-slate-200">
    <table className="w-full text-xs text-left border-collapse bg-white">
      <thead>
        <tr className="bg-slate-100 font-bold border-b border-slate-200">
          <th className="p-2 w-28">設定手法</th>
          <th className="p-2">概要・特徴</th>
          <th className="p-2 text-center w-20">レイティング</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-slate-700 bg-slate-50">ストップウォッチ法</td>
          <td className="p-2 text-slate-600">作業者を直接ストップウォッチで計測。最も一般的で直接的。</td>
          <td className="p-2 text-center font-bold text-red-600 bg-red-50/50">必要</td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-slate-700 bg-slate-50">実績資料法</td>
          <td className="p-2 text-slate-600">過去の実績作業データから標準時間を算出。個別受注生産で多用。手間は少ないが精度は低い。</td>
          <td className="p-2 text-center text-slate-400">不要</td>
        </tr>
        <tr className="border-b border-slate-100">
          <td className="p-2 font-bold text-slate-700 bg-slate-50">標準時間資料法</td>
          <td className="p-2 text-slate-600">あらかじめ用意した作業要素別の時間データ（資料）を足し合わせて標準時間を合成。</td>
          <td className="p-2 text-center text-slate-400">不要</td>
        </tr>
        <tr>
          <td className="p-2 font-bold text-slate-700 bg-slate-50">PTS法</td>
          <td className="p-2 text-slate-600">既定動作時間基準法。動作を微動作レベルに分解し、あらかじめ定められた時間値から合成。繰り返しの多い量産で有効。</td>
          <td className="p-2 text-center text-slate-400">不要</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// 図表の条件レンダラー
const renderDiagram = (id, isExplanation = false) => { return null; };

// ==========================================
// パースされた問題データ配列 (完全ノンカット)
// ==========================================
const QUESTIONS = [
  {
    "id": 1,
    "title": "品質管理",
    "answer": "ア",
    "choices": [
      "ア　不合格になるはずのロットが合格になる確率を、消費者危険と呼ぶ。",
      "イ　設計品質は、適合の品質とも呼ばれる。",
      "ウ　安全性能が要求される医療機などは、通常抜取検査が実施される。",
      "エ　TQMでは、生産部門の担当者が改善を行って不良の流出を防止する。"
    ],
    "source": "スマート問題集 3-6",
    "question": "品質管理に関する記述として、最も適切なものはどれか。",
    "explanation": "ここが重要\n　本問では品質管理について問われています。\n　従来の品質管理は、不良や不具合を少なくすることが管理の中心でしたが、時代と共に、より顧客の要求を満たすことが重視されるようになってきました。品質管理に関する具体的な内容は次のようになります。\n●品質管理の定義\n　JISの定義では「買い手の要求に合った品質の品物またはサービスを経済的に作り出すための手段の体系」としています。つまり品質管理は、顧客要求を満たすために、質が高い製品をできるだけ安いコストで提供するための管理と言えます。\n●品質管理の種類\n①設計品質(ねらいの品質）\n　設計時に、顧客の要求を満たすための目標として設定した品質。\n②製造品質（結果の品質）(適合の品質)\n　製品の製造時に結果として生じた品質。製造品質をできるだけ設計品質に近づけるためには、製造プロセス自体の品質向上や、品質検査により基準値に対する適合判定が必要となります。そのため、製造品質は「適合の品質」と呼ばれることもあります。\n●品質管理のキーワード\n①品質管理は、Quality Control(略してQC)とも呼ばれる。\n②TQC（Total Quality Control：全社的品質管理）\n　品質管理を効果的に実施するために、生産現場だけではなく、製品の企画や設計、購買、アフターサービス、人事･教育など、製品を提供する全ての段階で全社的に行う。\n③TQM（Total Quality Management：総合的品質管理）\n　顧客満足の向上を重視し、経営戦略としてトップダウンで顧客満足や、それを実現するために品質を向上させる手法。\n④QC サークル\n　小集団による、現場からのボトムアップの品質改善活動。\n⑤ISO9000シリーズ（国際標準規格）\n　製品やサービスの品質保証を通じて、顧客満足向上と品質マネジメントシステムの継続的な改善を実現する国際規格。\n●品質保証の活動\n　品質保証では、「検査」「製造」「設計」の3 つの活動が重要です。\n　品質保証の基本は、①上流の設計時から、より安全で品質の高い製品を作り込む活動を行い ②次に製造工程の品質を高めて不良品を作らないように活動し、③最後に検査で不良品を社外に出さないように活動することで、品質保証を実現します。\n●検査の種類\n①全数検査\n　・概要：ロット内の全ての製品を検査する方法。\n　・メリット：不良品を確実に除外することが可能。\n　・デメリット：検査の手間やコストがかかる。\n　・適用：高価な製品や、医療機など品質が重視される製品。\n②抜取検査\n・概要：ロット内からサンプルを抜取って検査し、その結果でロット全体の合否を判定。\n・メリット：全数検査よりも手間やコストがかからない。\n・デメリット：合格となったロットの中にも不良品が含まれる可能性がある。 不合格にしたロットの中にも良品が含まれる可能性がある。\n・適用：電子部品など、比較的安価で大量に生産する製品。\n　抜取検査では次のようなリスクが発生します。\n　・生産者危険：本来は合格にするはずのロットを不合格にしてしまうため、生産者側に発生するリスク。\n　・消費者危険：本来は不合格にするはずのロットを合格にしてしまうため、消費者側に発生するリスク。\n　いくつかのキーワードがありますが、少なくとも「設計品質(ねらいの品質）」「製造品質（結果の品質）(適合の品質）」「生産者危険」「消費者危険」については、しっかりと理解しておきましょう。\nア　○：\n　抜取検査のサンプルの品質がたまたま合格基準を満たしているため、本来は不合格のはずのロットを合格にしてしまう確率を、消費者危険と呼びます。消費者危険とは消費者側のリスクという意味です。よって記述は適切です。\nイ　×：\n　設計品質は、顧客の要求を満たすための品質を、目標として設定したもので「狙いの品質」と呼ばれます。「適合の品質」と呼ばれるのは、製造品質です。よって記述は不適切です。\nウ　×：\n　医療機や自動車など安全上の品質が重視される製品や、高価な製品は、不具合の見逃しが許されません。このため全数検査を行うのが一般的です。よって記述は不適切です。\nエ　×：\n　TQMではより高い視点に立った、顧客満足の向上を重視しています。そのため、製品を現場で改善するだけでなく、経営戦略としてトップダウンで顧客満足や、企業全体の経営の品質を向上させていきます。よって記述は不適切です。"
  },
  {
    "id": 2,
    "title": "TQM",
    "answer": "エ",
    "choices": [
      "ア　TQMでは、結果だけに着目するのではなく、プロセスの改善により品質を向上させることを重視している。",
      "イ　TQMの原則には、「目的に関する原則」、「手段に関する原則」、「組織の運営に関する原則」の3つがある。",
      "ウ　TQMでは、会社利益の優先ではなく、顧客第一の考え方で活動を進めることを重視している。",
      "エ　TQMの「組織の運営に関する原則」の中には、リーダーシップ、重点志向、人間性尊重、教育訓練の重視がある。"
    ],
    "source": "スマート問題集 3-6",
    "question": "TQM（総合的品質管理）に関する記述として、最も不適切なものはどれか。",
    "explanation": "ここが重要\n　本問ではTQM（総合的品質管理）に関する原則について問われています。\n　TQMは、顧客満足の向上や利益創出を実現するために、戦略的に企業活動全体の品質を向上させる手法です。「目的に関する原則」、「手段に関する原則」、「組織の運営に関する原則」の3つの原則に基づき、経営者をはじめ、管理者・監督者・作業者など全員が参加して、企業全体の経営品質を向上させるように活動していきます。\n　3つの原則は、具体的に次のような考え方から成り立っています。\n\n　TQMの原則の詳細内容まで覚える必要はありませんが、3つの原則の名称とどのような項目から成り立っているかは、確認しておきましょう。\nア　○：\n　TQMの「手段に関する原則」における、「プロセス重視」の考え方になります。良い結果を継続的に得るためのプロセス（仕事の仕組み・やり方）に着目し、これを管理し、向上させていくという考え方です。よって記述は適切です。\nイ　○：\n　TQMには、「目的に関する原則」、「手段に関する原則」、「組織の運営に関する原則」、の3つがあります。よって記述は適切です。\nウ　○：\n　TQMの「目的に関する原則」における、「品質第一」や「マーケットイン」の考え方になります。顧客を第一に考え、顧客の中に入りニーズやウォンツを的確に把握し、これを満たす良い製品やサービスの提供を優先させていく考え方です。このような活動が結果的には会社の利益に結びつきますが、最も重視されるのは、顧客満足となります。よって記述は適切です。\nエ　×：\n　「重点志向」は、「手段に関する原則」に含まれます。よって記述は不適切です。なお、「組織の運営に関する原則」には、選択肢の記述の他に「全員参加」が含まれます"
  },
  {
    "id": 3,
    "title": "QC7つ道具 1",
    "answer": "ウ",
    "choices": [
      "ア　Ｘ－Ｒ管理図を用いて、ブザーの音量と電流値の関連性を調べた。",
      "イ　散布図を用いて、塗装ムラが発生する予想原因を複数のメンバーで議論した。",
      "ウ　ヒストグラムを用いて、100個の製品重量のバラツキを調べた。",
      "エ　層別を用いて、製品の重さが許容値内であるか管理した。"
    ],
    "source": "スマート問題集 3-6",
    "question": "品質管理におけるQC手法を用いる場面の説明として、最も適切なものはどれか。",
    "explanation": "ここが重要\n　本問ではQC7つ道具のいくつかについて、実際に適用する場面が問われています。\n　QC7つ道具については、次のようなものがあります。\n\n\n\n\n　QCの7つ道具は過去に多く出題されている分野です。各道具の内容を、実際に適用する場面もイメージしながら、理解しましょう。\nア　×：\n　Ｘ－Ｒ管理図は、ある対象物の特性を管理するための管理図の一つです。データの平均値を表すＸ（エックスバー）のグラフと、データの範囲を表すＲのグラフを縦に並べて表示します。例えば、ロットから抜取りで重さの検査を行い、サンプルの重さの平均値をＸ(－)管理図に表示、サンプルの重さの最大値から最小値を引いた範囲を求めてＲ管理図に表示して、異常やバラツキの傾向を管理します。選択肢の例のように、2つの特性の相関関係の有無を調べる場合には、散布図を用いるのが適当です。よって記述は不適切です。\nイ　×：\n　散布図は、2つの特性をX軸とY軸に取り、データを点でプロットすることで、2つの特性の間の相関関係を把握するために使います。選択肢のような状況で、問題の発生原因を議論するのであれば、特性要因図を用いるのが適当です。よって記述は不適切です。\nウ　○：\n　ヒストグラムは、度数分布図とも呼ばれ、データ範囲ごとのデータの個数、つまり度数を表示したグラフです。選択肢の例であれば、100個の製品について、重量を測定した結果を、1g間隔のデータ範囲に分けてヒストグラムを作ることで、製品重量のバラツキを調べることができます。よって記述は適切です。\nエ　×：\n　層別は、データの母集団を幾つかの層に分割する際に用います。例えば、外観不良の原因を調べる場合であれば、「塗装ムラ」「傷」「欠け」「指紋」などの項目にデータを分けた上で調査を進めることができます。選択肢の例のように、ある特性の範囲を管理する場合は、管理図を用いるのが適当です。よって記述は不適切です。"
  },
  {
    "id": 4,
    "title": "QC7つ道具 2",
    "answer": "イ",
    "choices": [
      "ア　管理図には、管理限界を示す2本の線が引かれる。",
      "イ　散布図の偽相関とは、2つの特性の間に一見関係がないように見えても、実際に相関があることをいう。",
      "ウ　ヒストグラムのデータの分布は、一般には正規分布となる。",
      "エ　特性要因図は、QCサークルで実際に取組む活動内容を決める際に役立つ。"
    ],
    "source": "スマート問題集 3-6",
    "question": "品質管理におけるQC手法の内容について、最も不適切なものはどれか。",
    "explanation": "ここが重要\n　本問ではQC7つ道具のいくつかについて、具体的な内容が問われています。\n　先の問題でQC7つ道具の概要について解説したので、ここでは、いくつかの手法の特徴や留意する点を説明します。\n●管理図\n　管理図は、測定した値を折れ線グラフと共に、上下に管理限界線という線を引いているのが特徴です。上の線を上方管理限界線、下の線を下方管理限界線と呼びます。測定したデータが、管理限界線を越えた場合は、異常と判定します。また、管理限界線を超えない場合でも、データが連続して増加もしくは減少している、管理限界線に近い点が連続している場合などは、工程などに異常がある可能性があります。\n●パレート図\n　パレート図は、取り組むべき重点課題を明確にするのに役立ちます。例えば、不良原因別に不良数を表示するパレート図を作成することで、不良対策の重点項目が分かります。ヒストグラムが特定の項目のデータを扱うのに対して、パレート図は複数の項目を層別（種別）にして、出現頻度を多い順に並べます。\n●ヒストグラム\n　ヒストグラムの分布は、通常、中央が高くなり、その左右が対象に裾野のように広がる正規分布となります。この左右の裾野が広いほどバラツキが大きいということになります。また仮に、分布が正規分布とならない場合はなんらかの異常が考えられます。例えば、切削加工品であれば途中で取付けが緩む、機械が壊れるなどの異常を疑う必要があります。\n●散布図\n　散布図は、2つの特性をX軸とY軸に取り、データを点でプロットします。この時、点の集合が右下がりになる場合を「負の相関関係」、逆に点の集合が右上がりの場合を「正の相関関係」、点が全体に散らばっている場合を「無相関」であると言います。\n　また、散布図上で一見相関があるように見えても、実際は第3の要因によって、相関に見えているだけで直接関係がない場合を、「偽相関」と呼びます。例えば、ビールの売上と、熱中症の患者数を散布図にした場合、正の相関関係が見えるかもしれません。しかし、これは気温という第3の要因が上昇すると、ビールが売れて、熱中症の患者が増えるためです。このように、2つの特性の間に直接の関係がない場合は、偽相関となります。\n●特性要因図\n　ある特性と、それをもたらす様々な要因の関係を図で表したものです。特性要因図はデータがない場合などに、QCサークルなど複数のメンバーが集まり、ブレーンストーミングなどをしながら要因を抽出して整理するのに向いています。グループで自由に意見を出し合い、問題の原因を特性要因図に記入していきます。\n●チェックシート\n　チェックシートはさまざま使い方があります。例えば、データの取得項目を一覧にして、各項目の値を記録したり、外観検査で確認する箇所を一覧にして、実際に対象箇所を確認しながら、○/×などのマークをつけたりします。また、チェックシートで確認項目別の不良数を集計して、後にパレート図などで不良品の分析を行うといった使い方もできます。\n●層別\n　層別は、ここまで紹介した6つの手法とは少し異なり、特定の図などは存在しません。層別は、データの母集団を幾つかの層に分割して、他の6つの手法と組み合わせて使用します。例えば、外観不良の原因を調べる場合であれば、外観不良として一纏めで扱うのではなく、「塗装ムラ」「傷」「欠け」「指紋」などの項目（層別）にデータを分けた上で、パレート図で不良内容の高い順に並べて分析するといった使い方です。\n　相関図における偽相関や、ヒストグラムとパレート図の違いは、混乱しやすいので、しっかりと理解しましょう。\nア　○：\n　管理図には、上下に管理限界線があります。上の線を上方管理限界線、下の線を下方管理限界線と呼びます。測定したデータが、管理限界線を越えた場合は、異常と判定します。よって記述は適切です。\nイ　×：\n　散布図におけるデータの偽相関とは、一見、散布図上で相関があるように見えても、実際は直接関係がないことです。よって記述は不適切です。\nウ　○：\n　ヒストグラムの分布は、通常、中央が高くなり、その左右が裾野のように広がる正規分布となります。よって記述は適切です。\nエ　○：\n　特性要因図は、ある特性の結果が、複数の要因によりもたらされている場合の情報の整理に役立ちます。このため、QCサークルでテーマを決めた後、品質を高めるために実際に行う活動や、取り組む優先順位を決めるのに役立ちます。例えば、外観の不良削減をテーマに上げた上で、外観の不良に繋がるような要因を抽出して特性要因図にまとめ、その中からもっとも大きな要因を特定し、その問題を解決するといった使い方です。よって記述は適切です。"
  },
  {
    "id": 5,
    "title": "新QC7つ道具",
    "answer": "エ",
    "choices": [
      "ア　連関図法 ― ばらばらの情報をグループにまとめ、問題などを整理する。",
      "イ　親和図法 ― 目標を設定し、そこにいたるまでの手段を系統立てて展開する。",
      "ウ　マトリックス図法 ― 数値データを用いて、2つの要素の問題を整理する。",
      "エ　PDPC法 ― 予め発生しそうな問題とその対応策を考えておき、プロジェクトを運営する。"
    ],
    "source": "スマート問題集 3-6",
    "question": "品質管理における新QC7つ道具と、分析内容の組合わせとして、最も適切なものはどれか。",
    "explanation": "ここが重要\n　本問では新QC7つ道具の内容が問われています。\n　新QC7つ道具の内容は次のようになります。\n\n・\n　「連関図法」と「親和図法」、「マトリックス図法」と「マトリックスデータ解析法」は、似たような名称なので、混乱しないように注意しましょう。また、新QC7つ道具の中で、データを扱うのはマトリックスデータ解析のみである点も押さえておきましょう。\nア　×：\n　連関図法とは、原因と結果、目的と手段が絡みあった問題について、関係を明確にする方法です。選択肢の記述は親和図法に関する内容です。よって記述は不適切です。\nイ　×：\n　親和図法とは、ばらばらの情報をまとめ、問題などを明確にする方法です。選択肢の記述は、系統図法に関する内容です。よって記述は不適切です。\nウ　×：\n　マトリックス図法では、2つの要素間の関係は、図記号（例えば◎、△、×）や英数字等を用いて、関係の強さなどを定性的に表わします。数値データを用いて関係性を分かりやすくするのは、マトリックスデータ解析です。よって記述は不適切です。\nエ　○：\n　PDPC法は、選択肢の記述のとおり、予め発生しそうな問題と、その対応策を考えておき、それに沿った行動や新しい手法を考える方法です。よって記述は適切です。"
  },
  {
    "id": 6,
    "title": "設備保全活動1",
    "answer": "ウ",
    "choices": [
      "ア　プレス機がよく停止するため、故障が起こりにくくなるように改善した。これを予防保全と呼ぶ。",
      "イ　加工機のオイルの交換時期がきたので交換した。これを事後保全と呼ぶ。",
      "ウ　新しい切削マシンの導入時に、現行機種の保全実績を考慮して機種を選定した。これを保全予防と呼ぶ。",
      "エ　測定器の電池が切れたので新品に交換した。これを改良保全と呼ぶ。"
    ],
    "source": "スマート問題集 3-6",
    "question": "設備の保全活動に関する記述として、最も適切なものはどれか。",
    "explanation": "ここが重要\n　本問では設備保全の内容について問われています。\n　設備保全は、設備の性能を維持するための活動です。大きく分けて、設備を維持する活動と、改善する活動があり、内容は次のようになります。\n●設備を「維持する活動」\n\n●設備を「改善する活動」\n\n「予防保全」と「保全予防」については混乱しやすいので、「い・よ・か・ほ」（ 維持(い)は予防(よ) / 改善(か)は保全(ほ) ）と語呂合わせで覚えておくとよいでしょう。\nア　×：\n　設備そのものを、故障しにくくなるように改善する活動は、改良保全に該当します。よって記述は不適切です。\nイ　×：\n　消耗部品等の定期交換により故障を防止する活動は、予防保全に該当します。よって記述は不適切です。\nウ　○：\n　過去の保全実績に基づき、新しい設備の導入を計画したり、設計する活動は、保全予防に該当します。よって記述は適切です。\nエ　×：\n　動作不能な状態になった後での復旧処置は、事後保全に該当します。よって記述は不適切です。"
  },
  {
    "id": 7,
    "title": "設備保全活動2",
    "answer": "ウ",
    "choices": [
      "ア　経営トップから第一線の従業員にいたるまで全員が参加し、ロス・ゼロを達成するための自主保全活動である。",
      "イ　自主保全活動は7つのステップで実施され、最後のステップは「自主管理の徹底」となる。",
      "ウ　設備を中心とするゴミ・ヨゴレの一斉排除と給油、増締めは、「自主点検」のステップで実施される。",
      "エ　必要な保全作業や点検を短時間で確実に実施し、維持するための行動基準の作成は、「自主保全仮基準の作成」のステップで実施される。"
    ],
    "source": "スマート問題集 3-6",
    "question": "TPM(Total Productive Maintenance)における自主保全活動に関する記述として、最も不適切なものはどれか。",
    "explanation": "ここが重要\n　本問ではTPM(Total Productive Maintenance)における自主保全活動の内容を問われています。\n　TPMとは、生産部門をはじめ、開発・営業・管理などのあらゆる部門にわたってトップから第一線従業員にいたるまで全員が参加し、ロス・ゼロを達成する保全活動です。TPMにおける保全活動は、次の7つのステップに分けて実施します。\n\n　保全活動は過去に何度か出題されている分野です。保全活動の各ステップの名称と、実施する順番については、しっかりと押さえておきましょう。\nア　○：\n　TPMによる保全活動の特徴は、全員参加のもと、ロス・ゼロを目指します。よって記述は適切です。\nイ　○：\n　自主保全活動は7つのステップで実施されます。「初期清掃（清掃・点検）」から始まり、最後は「自主管理の徹底」となります。よって記述は適切です。\nウ　×：\n　「自主点検」のステップで実施されるのは、能率よく確実に維持できる、各種点検基準や点検チェックシートの作成と実施です。選択肢にある活動は、「初期清掃（清掃・点検）」となります。よって記述は不適切です。\nエ　○：\n　「自主保全の仮基準の作成」のステップでは、短時間で清掃・給油・増締め・点検等の必要な保全作業が、確実に実施かつ維持できる行動基準が作成されます。よって記述は適切です。"
  },
  {
    "id": 8,
    "title": "設備効率",
    "answer": "エ",
    "choices": [
      "ア　Ａ：設備稼働率　Ｂ：全体設備効率　Ｃ：標準時間　Ｄ：チョコ停",
      "イ　Ａ：時間稼働率　Ｂ：全体設備効率　Ｃ：段取り時間　Ｄ：ロス停",
      "ウ　Ａ：設備稼働率　Ｂ：設備総合効率　Ｃ：標準時間　Ｄ：ロス停",
      "エ　Ａ：時間稼働率　Ｂ：設備総合効率　Ｃ：段取り時間　Ｄ：チョコ停"
    ],
    "source": "スマート問題集 3-6",
    "question": "設備効率に関する次の文中の、空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものはどれか。\n設備効率を表す指標には、（　Ａ　）、性能稼働率、良品率がある。これら3つの指標を掛け合わせることで、設備の全体の効率である、（　Ｂ　）が求められる。このうち（　Ａ　）を高めるには設備故障を防止したり、（　Ｃ　）を極力短くする必要がある。また性能稼働率を高めるには、設備が一時的に停止する（　Ｄ　）や、空転、速度低下などの無駄を極力減らす必要がある。",
    "explanation": "ここが重要\n　本問では設備効率について問われています。\n　設備の運用時には、できるだけ無駄な時間を少なくして、設備効率を高めることが重要となります。設備の効率を表す指標には、「時間稼働率」「性能稼働率」、「良品率」の3つがあり、次の図のような関係になっています。また、これら3つの指標を掛け合わせることで、設備の全体の効率である「設備総合効率」を求めることができます。\n\n各指標の具体的な内容は次のようになります。\n●時間稼働率\n　設備の故障や、段取時間などで、設備が停止したロスを測定するための指標で、次の式で求められます。\n時間稼働率 ＝ 稼働時間 ÷ 負荷時間\n※稼働時間 = 負荷時間 － 停止ロス時間\n●性能稼働率\n　設備のチョコ停と呼ばれる一時的な停止、空転や速度低下などの、性能ロスを測定するための指標で、次の式で求められます。\n性能稼働率 ＝ 正味稼働時間÷ 稼働時間\n※正味稼働時間 = 稼働時間 － 性能ロス時間\n●良品率\n　不良品や手直しなどの、不良ロスを測定するための指標で、次の式で求められます。\n良品率 ＝ 価値稼働時間 ÷ 正味稼働時間\n※価値稼働時間 = 正味稼働時間 － 不良ロス時間\n●設備総合効率\n　設備全体の効率で、次の式で求められます。\n設備総合効率 ＝時間稼働率 Ｘ 性能稼働率 Ｘ 良品率\n\n　設備効率に関する問題は、過去に何度か出題されています。設備効率を表す3つの指標の測定内容と、設備総合効率を求める式については、しっかり押さえておきましょう。\nＡ：時間稼働率\n　設備効率を表す指標を分けて考える記述になっている点から、「設備稼働率」と入れるのは適切ではありません。設備効率を表す指標には時間の要素である「時間稼働率」が含まれます。\nＢ：設備総合効率\n　「全体設備効率」も語句から連想できる意味としては似ていますが、設備の全体効率を「設備総合効率」と呼ばれます。\nＣ：段取り時間\n　「標準時間」とは、実際の作業時間に、準備時間や適切な余裕時間なども加えて、設定された作業の標準時間のことです。本問は設備効率に限定した内容ですから「段取り時間」を入れるのが適切です。\nＤ：チョコ停\n　段取りや故障による設備の停止とは別に、一時的なトラブルのために設備が停止する状態を「チョコ停」と呼びます。このような性能ロスを減らすことで、性能稼働率を高めることができます。\n　よって正解はエとなります。"
  },
  {
    "id": 9,
    "title": "設備の評価指標",
    "answer": "ウ",
    "choices": [
      "ア　MTBFは、故障した設備が稼働できる状態に修復するための時間の平均値である。",
      "イ　MTTRは、故障した設備が修復してから次に故障するまでの時間の平均値である。",
      "ウ　可用率とは、設備が必要とされるときに使用中または運転可能な状態にある確率である。",
      "エ　可用率は、MTTR÷（MTBF＋MTTR）で求めることができる。"
    ],
    "source": "スマート問題集 3-6",
    "question": "設備の評価指標に関する記述として、最も適切なものはどれか。",
    "explanation": "ここが重要\n本問では設備の評価指標について問われています。\n設備は、使いたいときに使える状態を常に保つことが重要です。故障しないことはもちろん大切ですが、万が一、故障した場合であっても、できるだけ速やかに修復できることが求められます。\n設備の故障や修復を評価する主な指標に、平均故障間隔、平均修復時間、可用率があります。\n●平均故障間隔（MTBF：Mean Time Between Failures）\n　平均故障間隔は、故障した設備が修復してから、次に故障するまでの時間の平均値です。稼働時間の合計値を故障回数で割ることで求められます。\n\n\n●平均修復時間（MTTR：Mean Time To Repair）\n平均修復時間は、故障した設備が稼働できる状態に修復するための時間の平均値です。修理時間の合計値を修理した回数で割ることで求められます。\n\n\n●可用率（アベイラビリティ）\n　可用率とは、設備が必要とされるときに使用中または運転可能な状態にある確率です。アベイラビリティあるいは可動率（べきどうりつ）とも言います。\n可用率を求める式は、MTBF÷（MTBF＋MTTR）となります。\n設備の評価指標に関する問題は、経営情報システムでも学習しますが、どちらの科目でも出題実績のある論点です。本問で問われた3つの指標について、何を指しているのかしっかりと押さえておきましょう。\nア　×：　\nMTBF（Mean Time Between Failures）は平均故障間隔のことで、故障した設備が修復してから、次に故障するまでの時間の平均値です。よって記述は不適切です。\nイ　×：　\nMTTR（Mean Time To Repair）は平均修復時間のことで、故障した設備が稼働できる状態に修復するための時間の平均値です。よって記述は不適切です。\nウ　○：　\n可用率とは、設備が必要とされるときに使用中または運転可能な状態にある確率です。よって記述は適切です。\nエ　×：　\n可用率を求める式は、MTBF÷（MTBF＋MTTR）です。本肢の式は分子が違います。よって記述は不適切です。"
  },
  {
    "id": 10,
    "title": "環境保全",
    "answer": "ア",
    "choices": [
      "ア　環境基本法では、事業者の責務として、廃棄物の適正処理、公害防止、環境負荷の低減、再生資源の利用などを挙げている。",
      "イ　廃棄物削減に取組む3つの観点として、リジェクト、リユース、リサイクルがある。",
      "ウ　循環型社会形成推進基本法では、廃棄物の処理の優先順位を ①発生抑制、②再生利用、③再利用、④熱回収、⑤適正処分 の順で決めている。",
      "エ　企業が排出する廃棄物の量をゼロにする取組みのことを、ゼロディフェクトと呼ぶ。"
    ],
    "source": "スマート問題集 3-6",
    "question": "環境保全に関する記述として、最も適切なものはどれか。",
    "explanation": "ここが重要\n　本問では環境保全に関する法律やキーワードが問われています。\n　環境保全に関して押さえておきたい内容は次の通りです。\n●環境基本法\n　基本理念として、環境への負荷が少ない社会を構築すること、国際的協力による環境保全を推進することなどを挙げています。また、事業者への責務として、廃棄物の適正処理、公害防止、環境負荷の低減、再生資源の利用などを挙げています。さらに、これを推進するために、環境基本計画として長期的な目標が定められています。\n●循環型社会形成推進基本法\n　環境基本法に基づいた循環型社会の形成を目的に制定された法律です。この法律では環境負荷をできるだけ低減して、循環型社会を構築できるように、廃棄物の処理の優先順位を次のように定めています。①発生抑制、②再利用、③再生利用、④熱回収、⑤適正処分です。尚、この中で、②～④を循環資源としています。\n●個別法\n　循環型社会形成推進基本法に基づいて、循環型社会の形成を推進するための個別の法律として次のような法律があります。\n\n\n●廃棄物の処理・管理\n・廃棄物削減の3R\n「リデュース（廃棄物の発生抑制)」「リユース（再使用）」「リサイクル（再利用）」の3つの頭文字をとったものです。尚、この3Rに「リフューズ（廃棄物になるものを買わない）」を加えて4R、さらに「リペア（修理して使う）」を加えて5Rと言う場合もあります。\n・ゼロエミッション\n　企業が廃棄物をゼロにする取組みのことで、廃棄物を捨てるのではなく、3Rなどを推進することで、廃棄物をゼロにすることを目指します。\n　環境保全や廃棄物等の管理に関しては過去に多く出題されています。問題の傾向としては、関連する法律の詳細内容を問われる場合が多く、その全てを暗記するのは難しいと思われます。このため、環境保全に関しては、先ずは本問の解説にある基本的なことを、しっかりと押さえておきましょう。\nア　○：\n　環境基本法では、選択肢の記述の通りの内容を挙げています。また、これを推進するために、環境基本計画として長期的な目標が定められています。よって記述は適切です。\nイ　×：\n　廃棄物削減の3Rとは、「リデュース（廃棄物の発生抑制)」「リユース（再使用）」「リサイクル（再利用）」の3つの頭文字をとったものです。リジェクトではありません。よって記述は不適切です。\nウ　×：\n　廃棄物の処理の優先順位は、環境に与える負荷が少なくなる順番で定められています。この観点で考えると、選択肢の記述は②と③が逆となります。よって記述は不適切です。\nエ　×：\n　廃棄物の量をゼロにする取り組みは、ゼロエミッションと呼ばれています。ゼロディフェクトは不良の発生をゼロにすることです。よって記述は不適切です。"
  },
  {
    "id": 11,
    "title": "開発･設計の情報システム",
    "answer": "ウ",
    "choices": [
      "ア　強度に不安がある部品のモデルをコンピュータ上に作成し、強度のシミュレーションを行うのに、「CAD」を用いた。",
      "イ　新製品を開発するにあたり、前モデルと同じ部品を使用する部分については、その部品の「CAE」データを再利用しながら設計を進めた。",
      "ウ　コンピューター上の部品設計データを、「CAM」を用いて加工機械で使えるデータに変換した。",
      "エ　設計・開発に関わるすべての情報を一元化して管理し、複数部門で共有ができるように、「CAI」を導入した。"
    ],
    "source": "スマート問題集 3-6",
    "question": "コンピュータを用いた開発・設計の情報システムに関する記述として、最も適切なものはどれか。",
    "explanation": "ここが重要\n　本問ではコンピュータを利用した開発･設計の情報システムに関する内容が問われています。\n　コンピュータを利用した設計には、次のようなものがあります。\n●CAD（Computer-Aided Design）\n　コンピュータを利用して行う製品の設計システムです。CADでは製品の形状やその他の属性データからなるモデルをコンピュータ内部に作成し、製品の設計を進めます。作成した設計データをモデルと呼び、このデータにサイズなどのパラメータで与えることで、似たような部品のバリエーションを簡単に作成できます。このように、CADを利用することで設計作業を効率化することができます。\n●CAM（Computer-Aided Manufacturing）\n　コンピュータ内部に作成したモデルの情報を、加工機械などに直接インプットするシステムです。CAMでは、CADなどで設計したモデルを、実際に生産ができるようにNC工作機械などにインプットします。\n●CAE（Computer-Aided Engineering）\n　コンピュータ内部に作成したモデルの情報を基に、製品や部品の解析評価を行うシステムです。CAEは、製品を実際に作る前に、強度や安定性、性能などの解析やシミュレーションによる評価ができます。CAEを利用することで、実際に試作品を作る前にある程度の確認がコンピュータ上でできるため、設計のリードタイムを短縮することができます。\n●PDM（Product Data Management：製品情報管理システム）\n　CADで作成した製品の設計情報や、部品構成を表す部品表、製品の開発プロセス、およびこれらの変更履歴などを管理するシステムです。PDMの導入によって、製品情報が一元的に管理できるため、関連部門間で情報を共有しながら同時進行で設計を行う、コンカレントエンジニアリングの実現が可能となります。\n　製品開発とは異なる分野ですが、コンピュータを用いたシステムとしてCAIがあります。\n●参考：CAI（Computer-Aided Instruction)\n　コンピュータを用いた教育システムです。複数の人に同時に教えながら、個々の理解力や進度に合わせた個別教育も行えます。\n　開発･設計の情報システムについては過去に何度か出題されています。CAD、CAM、CAEについては混同しやすいので、それぞれの内容をしっかりと理解しましょう。\nア　×：\n　「CAD」は、製品の設計をコンピュータを利用して行うシステムです。選択肢の記述は「CAE」に関する内容です。よって記述は不適切です。\nイ　×：\n　「CAE」は、コンピュータ上のモデルの情報を基に、製品のシミュレーションを行うシステムです。選択肢の記述は「CAD」に関する内容です。よって記述は不適切です。\nウ　○：\n　「CAM」は、選択肢の記述にあるように、「CAD」などで設計したコンピュータ上のモデル情報を、実際の生産に必要な情報に変換し入力するシステムです。よって記述は適切です。\nエ　×：\n　「CAI」は、コンピュータを用いた学習システムです。選択肢の記述は「PDM」に関する内容です。よって記述は不適切です。"
  },
  {
    "id": 12,
    "title": "製造の情報システム",
    "answer": "エ",
    "choices": [
      "ア　NC － 入力された、切削用工具の刃先の加工動作情報をもとに、動作する機械。",
      "イ　MC － 自動工具交換機能をもち、1台でさまざまな加工ができる機械。",
      "ウ　FMC － まとまった工程を自動化できるように、機械を組み合わせたもの。",
      "エ　FMS － 生産だけでなく、受注や設計、物流なども含めて全体を管理するシステム。"
    ],
    "source": "スマート問題集 3-6",
    "question": "製造の情報システムの内容の組合せとして、最も不適切なものはどれか。",
    "explanation": "ここが重要\n　本問ではコンピュータを利用した製造の情報システムの内容が問われています。\n　コンピュータを利用した、製造のシステムには次のようなものがあります。\n●NC（Numerical Control）\n　CADなどの設計データから作成したプログラムを使って、自動的に製品を加工するように数値制御される工作機械です。また、コンピュータが組み込まれたNCのことをCNC（Computer Numerical Control）と呼びます。\n●MC（Machining Center）\n　機械に多数の工具がセットされており、工具を自動的に使い分けながら加工する工作機械です。MCは、1台で様々な加工が行える特徴があります。\n●FMC（Flexible Manufacturing Cell）\n　NCやロボットなどの個々の機械を組み合わせたものです。FMCは、まとまった工程を自動化するものです。\n●FMS（Flexible Manufacturing System）\n　工程全体をコンピュータで管理する生産システムです。FMSは、複数のFMCや自動搬送装置から構成された工程を管理します。FMSにより、1つの生産ラインで様々な製品を生産できるため、多品種少量生産に対応することができます。\n●FA（Factory Automation）\n　工場全体を管理するシステムです。\n●CIM（Computer Integrated Manufacturing）\n　生産だけでなく、受注や設計、物流など、製造業のオペレーション全体を管理するためのシステムです。\n　FMCのC：Cell（狭い範囲）、FMSのS：System(広い範囲・ライン全体）と覚えておくと、混乱を避けられると思います。\nア　○：\n　「NC」は、CAD などで作成した設計情報から生成したプログラムを使い、数値制御により自動加工を行う工作機械です。よって記述は適切です。\nイ　○：\n　「MC」は、機械に多数の工具がセットされており、工具を自動的に使い分けながら、1台で様々な加工ができる工作機械です。よって記述は適切です。\nウ　○：\n　「FMC」は、「NC」やロボットなどの個々の機械を組み合わせ、セル単位で作業を自動化するものです。「FMS」がライン全体を自動化するのに対して、「FMC」はもう少し小さい範囲の自動化です。これにより作業の柔軟性を確保しています。よって記述は適切です。\nエ　×：\n　FMSは、複数のFMCや自動搬送装置を組み合わせて構成された工程全体をコンピュータで管理する生産システムです。選択肢の記述はCIMに関する内容です。よって記述は不適切です。"
  },
  {
    "id": 13,
    "title": "サプライチェーンマネジメント",
    "answer": "ウ",
    "choices": [
      "ア　Ａ：キャッシュフロー　Ｂ：景気　Ｃ：俊敏　Ｄ：効率最適化",
      "イ　Ａ：顧客重視　Ｂ：市場　Ｃ：柔軟　Ｄ：全体最適化",
      "ウ　Ａ：キャッシュフロー　Ｂ：市場　Ｃ：俊敏　Ｄ：全体最適化",
      "エ　Ａ：顧客重視　Ｂ：景気　Ｃ：柔軟　Ｄ：効率最適化"
    ],
    "source": "スマート問題集 3-6",
    "question": "サプライチェーンマネジメントについて、JISの定義の中では、その目標を次のように記載している。文中の空欄A～Dに入る用語の組合せとして、もっとも適切なものはどれか。\nSCMの目標は、（　Ａ　）マネジメントを実現するとともに、最新情報技術及び制約理論、APSというサプライチェーン計画などの管理技術に基づき、（　Ｂ　）の変化に対してサプライチェーン全体を（　Ｃ　）に変化させ、ダイナミックな環境のもとで部門間や企業間における業務の（　Ｄ　）を図ることである。",
    "explanation": "ここが重要\n　本問ではサプライチェーンマネジメントの目標を問われています。\n　サプライチェーンマネジメント（SCM：Supply Chain Management）は、材料から生産、販売を経て製品が消費者に渡るまでの一連のサプライチェーン（供給連鎖）の全体を最適化するための手法で、イメージは次の図のようになります。\n\n　ここでは、サプライチェーンの中で需要情報や販売情報、生産情報などをリアルタイムで共有し全体を最適化します。これにより、最適な量の製品を迅速に提供できるようになるため、在庫を削減し、リードタイムを短縮するなどの経営の効率化が図れます。\n　また、JISではその内容と目標を次のように定義しています。\n●JISのサプライチェーンマネジメントの定義\n　サプライチェーンマネジメントは、資材供給から生産、流通、販売に至る物又はサービスの供給連鎖をネットワークで結び、販売情報、需要情報などを部門間又は企業間でリアルタイムに共有することによって、経営業務全体のスピード及び効率を高めながら顧客満足を実現する経営コンセプトである。\n　備考：SCMの目標は、キャッシュフローマネジメントを実現するとともに、最新情報 技術及び制約理論、APSというサプライチェーン計画などの管理技術に基づき、市場の変化に対してサプライチェーン全体を俊敏に変化させ、ダイナミックな環境のもとで部門間や企業間における業務の全体最適化を図ることである。\n　サプライチェーンマネジメントシステムについては、「資材供給から生産、流通、販売に至る供給連鎖」「情報共有」「俊敏な対応」「全体最適化」などが、重要キーワードになります。しっかりと押さえておきましょう。\n　JISの定義の中では、サプライチェーンマネジメントの目標を、前述の解説のように記載しています。よって正解はウとなります。\n　サプライチェーンマネジメントでは、企業間で情報共有することで、市場のニーズに迅速に対応して顧客満足を高めるとともに、各企業で抱える安全在庫や、死蔵在庫を削減することでキャッシュフローを高める目的があります。"
  }
];

export default function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [passcode, setPasscode] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 学習進捗データ
  const [history, setHistory] = useState({}); // { [id]: { correct: bool, choiceIdx: number, timestamp: string } }
  const [reviews, setReviews] = useState({}); // { [id]: bool }
  
  // 途中再開用の状態
  const [progressIndex, setProgressIndex] = useState(0);
  const [progressMode, setProgressMode] = useState("all");
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  // 画面遷移・クイズ進行の状態
  const [appMode, setAppMode] = useState("login"); // "login" | "dashboard" | "quiz" | "result"
  const [quizMode, setQuizMode] = useState("all"); // "all" | "wrong" | "review"
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // 履歴からの特定問題詳細表示用 (アコーディオン的)
  const [expandedReviewId, setExpandedReviewId] = useState(null);

  // 1. Firebase匿名認証を実行
  useEffect(() => {
    console.log("Firebase Authの初期化中...");
    const auth = getAuth(app);
    signInAnonymously(auth)
      .then((cred) => {
        console.log("匿名サインイン完了。UID:", cred.user.uid);
        setUser(cred.user);
      })
      .catch((err) => {
        console.error("Firebase匿名認証に失敗しました:", err);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  // 2. 履歴・進捗のFirestore保存関数
  const saveProgressToFirestore = async (updatedHistory, updatedReviews, index, mode) => {
    if (!isAuthenticated || !passcode.trim()) return;
    console.log(`Firestoreに進捗を保存します... インデックス: ${index}, モード: ${mode}`);
    try {
      const db = getFirestore(app);
      const docRef = doc(db, APP_ID, passcode.trim());
      await setDoc(docRef, {
        answers: updatedHistory || {},
        reviews: updatedReviews || {},
        progressIndex: index,
        progressMode: mode,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log("Firestore保存が完了しました。");
    } catch (err) {
      console.error("Firestoreへの保存中にエラーが発生しました:", err);
    }
  };

  // 3. 合言葉によるログイン・同期処理
  const handleConnect = async (e) => {
    if (e) e.preventDefault();
    const cleanPasscode = passcode.trim();
    if (!cleanPasscode) return;

    setIsLoadingData(true);
    console.log(`Firestoreへの接続を開始します。合言葉 (ドキュメントID): ${cleanPasscode}`);
    
    try {
      const db = getFirestore(app);
      const docRef = doc(db, APP_ID, cleanPasscode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("学習履歴データを取得しました:", data);
        
        // オプショナルチェイニングとフォールバックによる防衛的代入
        const restoredHistory = data?.answers || {};
        const restoredReviews = data?.reviews || {};
        const restoredIndex = data?.progressIndex || 0;
        const restoredMode = data?.progressMode || "all";

        setHistory(restoredHistory);
        setReviews(restoredReviews);
        
        if (restoredIndex > 0) {
          setProgressIndex(restoredIndex);
          setProgressMode(restoredMode);
          setShowResumePrompt(true);
          console.log(`前回の中断データを検出しました。インデックス: ${restoredIndex}, モード: ${restoredMode}`);
        } else {
          setProgressIndex(0);
        }
      } else {
        console.log("新規ユーザーです。初期データをFirestoreに作成します。");
        setHistory({});
        setReviews({});
        setProgressIndex(0);
        // 新規接続時にドキュメントを作成しておく
        await setDoc(docRef, {
          answers: {},
          reviews: {},
          progressIndex: 0,
          progressMode: "all",
          updatedAt: new Date().toISOString()
        });
      }

      setIsAuthenticated(true);
      setAppMode("dashboard");
    } catch (err) {
      console.error("接続処理に失敗しました。ローカルフォールバックします:", err);
      // 通信エラー時のフォールバック処理 (アプリのクラッシュを防ぐ)
      setHistory({});
      setReviews({});
      setProgressIndex(0);
      setIsAuthenticated(true);
      setAppMode("dashboard");
    } finally {
      setIsLoadingData(false);
    }
  };

  // 4. クイズ開始処理
  const startQuiz = (mode, resumeFromIndex = 0) => {
    console.log(`クイズを開始します。モード: ${mode}, 再開インデックス: ${resumeFromIndex}`);
    let targetQuestions = [];
    
    if (mode === "all") {
      targetQuestions = [...QUESTIONS];
    } else if (mode === "wrong") {
      targetQuestions = QUESTIONS.filter(q => {
        const ans = history[q.id];
        return ans && ans.correct === false;
      });
    } else if (mode === "review") {
      targetQuestions = QUESTIONS.filter(q => reviews[q.id] === true);
    }

    if (targetQuestions.length === 0) {
      alert("対象となる問題がありません。別モードを選択してください。");
      return;
    }

    setQuizMode(mode);
    setCurrentQuizQuestions(targetQuestions);
    setCurrentQuizIndex(resumeFromIndex);
    setSelectedAnswerIdx(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setAppMode("quiz");
  };

  // 5. 解答選択処理
  const handleAnswerSelect = (choiceIdx) => {
    if (selectedAnswerIdx !== null) return; // 回答済みなら何もしない

    const currentQuestion = currentQuizQuestions[currentQuizIndex];
    const labels = ["ア", "イ", "ウ", "エ", "オ"];
    const isAnsCorrect = labels[choiceIdx] === currentQuestion.answer;
    
    console.log(`問題ID: ${currentQuestion.id} に解答。選択: ${labels[choiceIdx]}, 正誤: ${isAnsCorrect}`);

    setSelectedAnswerIdx(choiceIdx);
    setIsCorrect(isAnsCorrect);
    setShowExplanation(true);

    // 履歴の更新
    const updatedHistory = {
      ...history,
      [currentQuestion.id]: {
        correct: isAnsCorrect,
        choiceIdx: choiceIdx,
        timestamp: new Date().toISOString()
      }
    };
    setHistory(updatedHistory);

    // 進行状況の保存 (最後の問題なら progressIndex を 0 にリセット、そうでなければ次の問題インデックス)
    const isLast = currentQuizIndex === currentQuizQuestions.length - 1;
    const nextIdx = isLast ? 0 : currentQuizIndex + 1;
    
    saveProgressToFirestore(updatedHistory, reviews, nextIdx, quizMode);
  };

  // 6. 「要復習」フラグの切り替え
  const toggleReview = async (id) => {
    const updatedReviews = {
      ...reviews,
      [id]: !reviews[id]
    };
    setReviews(updatedReviews);
    console.log(`問題ID: ${id} の復習ステートを更新: ${updatedReviews[id]}`);
    await saveProgressToFirestore(history, updatedReviews, progressIndex, progressMode);
  };

  // 7. 次の問題への遷移
  const handleNext = () => {
    if (currentQuizIndex < currentQuizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswerIdx(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      console.log("全問終了しました。");
      // 完走時は進捗を0にクリア
      setProgressIndex(0);
      setAppMode("result");
    }
  };

  // 8. 途中中断・ホームへ戻る
  const handleGoHome = () => {
    console.log(`学習を中断しホームに戻ります。現在のインデックス: ${currentQuizIndex}`);
    // その時点のインデックスを保存
    setProgressIndex(currentQuizIndex);
    setProgressMode(quizMode);
    saveProgressToFirestore(history, reviews, currentQuizIndex, quizMode);
    setShowResumePrompt(false);
    setAppMode("dashboard");
  };

  // 9. 進捗リセット（最初から始める・全問クリア時）
  const handleResetProgress = async () => {
    console.log("進行状況をリセットします。");
    setProgressIndex(0);
    setShowResumePrompt(false);
    await saveProgressToFirestore(history, reviews, 0, "all");
  };

  // 10. レーダーチャート及び統計データの計算
  const getStatsData = () => {
    const totalQuestions = QUESTIONS.length;
    const answeredList = Object.keys(history).map(Number);
    const answeredCount = answeredList.length;
    const correctCount = Object.values(history).filter(h => h.correct === true).length;
    
    // 指標1: 総合進捗率 (解答済みの割合)
    const progressRate = Math.round((answeredCount / totalQuestions) * 100) || 0;
    
    // 指標2: 全問正解率 (全問題に対する正解率)
    const totalCorrectRate = Math.round((correctCount / totalQuestions) * 100) || 0;
    
    // 指標3: 回答正確性 (解答した問題に対する正解率)
    const accuracyRate = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    
    // 指標4: 工程・運搬分析 (問題 2〜9 の正答率)
    const category1Ids = [2, 3, 4, 5, 6, 7, 8, 9];
    const cat1Correct = category1Ids.filter(id => history[id]?.correct === true).length;
    const cat1Rate = Math.round((cat1Correct / category1Ids.length) * 100);

    // 指標5: 方法・時間研究 (問題 1, 10〜16 の正答率)
    const category2Ids = [1, 10, 11, 12, 13, 14, 15, 16];
    const cat2Correct = category2Ids.filter(id => history[id]?.correct === true).length;
    const cat2Rate = Math.round((cat2Correct / category2Ids.length) * 100);

    return {
      progressRate,
      totalCorrectRate,
      accuracyRate,
      cat1Rate,
      cat2Rate,
      correctCount,
      answeredCount,
      totalQuestions,
      chartData: [
        { subject: "進捗率", A: progressRate, fullMark: 100 },
        { subject: "正解率", A: totalCorrectRate, fullMark: 100 },
        { subject: "正確性", A: accuracyRate, fullMark: 100 },
        { subject: "工程・運搬分析", A: cat1Rate, fullMark: 100 },
        { subject: "方法・時間研究", A: cat2Rate, fullMark: 100 }
      ]
    };
  };

  const stats = getStatsData();

  // 11. ローディング画面 (初期サインイン)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center text-slate-100 p-4">
        <RefreshCw className="animate-spin text-indigo-500 w-12 h-12 mb-4" />
        <h1 className="text-xl font-bold tracking-wider">認証サーバー接続中...</h1>
        <p className="text-sm text-slate-400 mt-2">しばらくお待ちください。</p>
      </div>
    );
  }

  // ==========================================
  // A. 合言葉ログイン画面 (認証前)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
              <BookOpen className="text-indigo-400 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight text-center">IEスマート問題集</h1>
            <p className="text-xs text-slate-400 mt-2 text-center">
              学習履歴をクラウド同期します。任意の合言葉を入力してください。
            </p>
          </div>

          <form onSubmit={handleConnect} className="space-y-6">
            <div>
              <label htmlFor="passcode" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                ユーザーの合言葉 (ID)
              </label>
              <input
                id="passcode"
                type="text"
                placeholder="例: my-study-secret-123"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                disabled={isLoadingData}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoadingData || !passcode.trim()}
              className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center space-x-2 transition disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-lg shadow-indigo-600/15"
            >
              {isLoadingData ? (
                <>
                  <RefreshCw className="animate-spin w-5 h-5 mr-2" />
                  <span>データを同期中...</span>
                </>
              ) : (
                <>
                  <span>学習を始める</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <span className="text-[10px] text-slate-500 font-mono">
              APP_ID: {APP_ID}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // B. メインダッシュボード画面
  // ==========================================
  if (appMode === "dashboard") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
        {/* ヘッダー */}
        <header className="bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="text-indigo-400 w-6 h-6" />
              <span className="font-extrabold tracking-tight text-slate-100">IEスマート問題集</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-full border border-slate-700/60 font-mono">
                <User className="w-3.5 h-3.5" />
                <span>ID: {passcode}</span>
              </div>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setAppMode("login");
                }}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
              >
                切替
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
          {/* 途中再開案内UI */}
          {showResumePrompt && progressIndex > 0 && (
            <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <RefreshCw className="text-indigo-400 w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">前回の学習データがあります</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    前回は【問題 {progressIndex + 1}】まで進んでいます。続きから再開しますか？
                  </p>
                </div>
              </div>
              <div className="flex space-x-3 shrink-0">
                <button
                  onClick={handleResetProgress}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                >
                  最初から始める
                </button>
                <button
                  onClick={() => startQuiz(progressMode, progressIndex)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center space-x-1"
                >
                  <span>続きから再開</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 統計とレーダーチャート */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 統計指標 */}
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs text-slate-400 font-semibold">総合進捗率</p>
                  <p className="text-3xl font-extrabold text-slate-100 mt-1">{stats.progressRate}%</p>
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  解答済: {stats.answeredCount} / {stats.totalQuestions} 問
                </div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm">
                <p className="text-[10px] text-slate-400 font-semibold">全問正解率</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">{stats.totalCorrectRate}%</p>
                <p className="text-[10px] text-slate-500 mt-1">正答: {stats.correctCount} 問</p>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm">
                <p className="text-[10px] text-slate-400 font-semibold">回答正確性</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">{stats.accuracyRate}%</p>
                <p className="text-[10px] text-slate-500 mt-1">回答に対する正解率</p>
              </div>
              <div className="col-span-2 bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <span className="text-xs text-slate-400 font-semibold">要復習の問題</span>
                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                  {Object.values(reviews).filter(v => v === true).length} 問
                </span>
              </div>
            </div>

            {/* レーダーチャート */}
            <div className="md:col-span-7 bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-sm flex flex-col justify-center">
              <h3 className="text-xs font-bold text-slate-400 mb-2 px-2 flex items-center space-x-1.5">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span>分析レーダーチャート</span>
              </h3>
              <div className="w-full h-[220px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" r="80%" data={stats.chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 9 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" tick={{ fontSize: 8, fill: "#475569" }} />
                    <Radar name="進捗分析" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* クイズ開始ボタンエリア */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="font-extrabold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
              <BookOpen className="text-indigo-400 w-5 h-5" />
              <span>クイズに挑戦する</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => startQuiz("all")}
                className="p-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-center shadow-lg shadow-indigo-600/15"
              >
                <p className="font-bold text-white text-sm">すべての問題</p>
                <p className="text-[10px] text-indigo-100 mt-1">{QUESTIONS.length}問から順番に出題</p>
              </button>
              
              <button
                onClick={() => startQuiz("wrong")}
                disabled={QUESTIONS.filter(q => history[q.id]?.correct === false).length === 0}
                className="p-4 rounded-lg bg-red-900/30 border border-red-500/20 hover:bg-red-900/40 text-center transition disabled:opacity-40"
              >
                <p className="font-bold text-red-400 text-sm">前回不正解の問題</p>
                <p className="text-[10px] text-red-500/80 mt-1">
                  対象: {QUESTIONS.filter(q => history[q.id]?.correct === false).length}問
                </p>
              </button>

              <button
                onClick={() => startQuiz("review")}
                disabled={QUESTIONS.filter(q => reviews[q.id] === true).length === 0}
                className="p-4 rounded-lg bg-amber-900/30 border border-amber-500/20 hover:bg-amber-900/40 text-center transition disabled:opacity-40"
              >
                <p className="font-bold text-amber-400 text-sm">要復習の問題</p>
                <p className="text-[10px] text-amber-500/80 mt-1">
                  対象: {QUESTIONS.filter(q => reviews[q.id] === true).length}問
                </p>
              </button>
            </div>
          </div>

          {/* 問題一覧＆学習履歴 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-bold text-slate-100 text-sm flex items-center space-x-1.5">
                <HelpCircle className="text-slate-400 w-4.5 h-4.5" />
                <span>問題一覧と履歴</span>
              </h2>
              <span className="text-[10px] text-slate-400">クリックすると問題詳細が開きます</span>
            </div>

            <div className="divide-y divide-slate-800">
              {QUESTIONS.map(q => {
                const ans = history[q.id];
                const isReviewed = reviews[q.id] === true;
                const isExpanded = expandedReviewId === q.id;

                return (
                  <div key={q.id} className="transition hover:bg-slate-900/40">
                    <div 
                      onClick={() => setExpandedReviewId(isExpanded ? null : q.id)}
                      className="p-4 flex items-center justify-between cursor-pointer space-x-4"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {String(q.id).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-200 truncate">{q.title}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">{q.source}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 shrink-0">
                        {/* 正誤バッジ */}
                        {ans ? (
                          ans.correct ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              正解
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                              不正解
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-500 border border-slate-700/50">
                            未着手
                          </span>
                        )}

                        {/* 要復習のピン */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReview(q.id);
                          }}
                          className={`cursor-pointer p-1.5 rounded-lg border transition ${
                            isReviewed 
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20" 
                              : "border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400"
                          }`}
                          title="要復習に追加/解除"
                        >
                          <Check className={`w-3.5 h-3.5 ${isReviewed ? "opacity-100" : "opacity-30"}`} />
                        </div>
                      </div>
                    </div>

                    {/* 詳細展開エリア (履歴からの復習用) */}
                    {isExpanded && (
                      <div className="px-4 pb-5 pt-1 bg-slate-950/50 border-t border-slate-900 text-xs text-slate-300 space-y-4">
                        <div className="border-l-2 border-indigo-500 pl-3">
                          <p className="font-semibold text-slate-100">【問題文】</p>
                          <p className="mt-1 whitespace-pre-wrap leading-relaxed">{q.question}</p>
                          {/* 問題文用図表 */}
                          {renderDiagram(q.id, false)}
                        </div>

                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                          <div className="flex items-center space-x-2 mb-2 font-bold">
                            <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px]">解説</span>
                            <span className="text-slate-100">解答：{q.answer}</span>
                          </div>
                          <p className="whitespace-pre-wrap leading-relaxed">{q.explanation}</p>
                          
                          {/* 解説用図表 */}
                          {renderDiagram(q.id, true)}
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => startQuiz("all", QUESTIONS.findIndex(qu => qu.id === q.id))}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white rounded-lg flex items-center space-x-1 transition shadow-sm"
                          >
                            <span>この問題から出題開始</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // C. クイズ出題画面
  // ==========================================
  if (appMode === "quiz") {
    const currentQuestion = currentQuizQuestions[currentQuizIndex];
    const isAnswered = selectedAnswerIdx !== null;
    const labels = ["ア", "イ", "ウ", "エ", "オ"];
    const progressPercent = Math.round(((currentQuizIndex) / currentQuizQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
        {/* クイズヘッダー */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={handleGoHome}
              className="text-xs font-bold text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 transition"
            >
              <Home className="w-4 h-4" />
              <span>中断して戻る</span>
            </button>
            <div className="text-xs font-bold text-slate-300 font-mono">
              進捗: {currentQuizIndex + 1} / {currentQuizQuestions.length} 問
            </div>
          </div>
        </header>

        {/* 進捗バー */}
        <div className="w-full bg-slate-900 h-1">
          <div 
            className="bg-indigo-500 h-1 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <main className="max-w-2xl mx-auto px-4 mt-6 space-y-6">
          {/* 問題カード */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider">
                {currentQuestion.source}
              </span>
              <span className="text-xs font-bold text-slate-400">
                問題 {currentQuestion.id}
              </span>
            </div>

            <h2 className="text-base font-extrabold text-slate-100 leading-relaxed whitespace-pre-wrap">
              {currentQuestion.question}
            </h2>

            {/* 問題文内蔵のインライン図表 */}
            {renderDiagram(currentQuestion.id, false)}
          </div>

          {/* 選択肢リスト */}
          <div className="space-y-3">
            {currentQuestion.choices.map((choice, idx) => {
              const choiceLetter = labels[idx];
              const isCorrectChoice = choiceLetter === currentQuestion.answer;
              const isSelected = selectedAnswerIdx === idx;

              let btnStyle = "bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900/60";
              
              if (isAnswered) {
                if (isCorrectChoice) {
                  // 正解の選択肢は常に緑
                  btnStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold";
                } else if (isSelected) {
                  // 不正解の選択肢を選択していた場合は赤
                  btnStyle = "bg-red-500/15 border-red-500 text-red-400 font-bold";
                } else {
                  // それ以外はトーンダウン
                  btnStyle = "bg-slate-900/30 border-slate-800/50 text-slate-500 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-start justify-between space-x-3 text-xs leading-relaxed ${btnStyle}`}
                >
                  <span className="flex-1">{choice}</span>
                  {isAnswered && (
                    <span className="shrink-0 mt-0.5">
                      {isCorrectChoice && <Check className="w-4 h-4 text-emerald-400" />}
                      {!isCorrectChoice && isSelected && <X className="w-4 h-4 text-red-400" />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 解答後の解説エリア */}
          {showExplanation && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
              {/* 正誤判定 */}
              <div className={`flex items-center space-x-2 font-black text-sm ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                {isCorrect ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>正解です！</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    <span>不正解です</span>
                  </>
                )}
              </div>

              {/* 正解の明示 */}
              <div className="text-xs font-bold text-slate-100 flex items-center space-x-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px]">正解</span>
                <span>選択肢 【 {currentQuestion.answer} 】</span>
              </div>

              {/* 解説テキスト */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-200 text-xs border-l-2 border-indigo-500 pl-2">解説レジュメ</h3>
                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* 解説用のインライン図表（体系図、テーブルなど） */}
              {renderDiagram(currentQuestion.id, true)}

              {/* 復習フラグと次のアクション */}
              <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <label className="flex items-center space-x-2 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-200">
                  <input
                    type="checkbox"
                    checked={reviews[currentQuestion.id] === true}
                    onChange={() => toggleReview(currentQuestion.id)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
                  />
                  <span>この問題を「要復習リスト」に登録する</span>
                </label>

                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1 transition self-end sm:self-auto shadow-md"
                >
                  <span>
                    {currentQuizIndex === currentQuizQuestions.length - 1 ? "結果を表示" : "次の問題へ"}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ==========================================
  // D. クイズ結果画面
  // ==========================================
  if (appMode === "result") {
    const total = currentQuizQuestions.length;
    // 今回の出題問題のうち、historyで最新解答がcorrect===trueである問題数
    const corrects = currentQuizQuestions.filter(q => history[q.id]?.correct === true).length;
    const scoreRate = Math.round((corrects / total) * 100) || 0;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <Check className="text-emerald-400 w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-100">演習完了！</h1>
            <p className="text-xs text-slate-400">お疲れ様でした。今回の正解率は以下の通りです。</p>
          </div>

          {/* スコア表示 */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-1">
            <p className="text-4xl font-extrabold text-indigo-400 font-mono">{scoreRate}%</p>
            <p className="text-xs text-slate-500">
              正解数: {corrects} / {total} 問
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setAppMode("dashboard");
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition shadow-md shadow-indigo-600/10"
            >
              ダッシュボードへ戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
