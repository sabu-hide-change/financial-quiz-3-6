// npm install lucide-react

import { useState, useEffect } from "react";
import { Home, ChevronRight, Check, X, BookOpen, List, RotateCcw } from "lucide-react";

const QUESTIONS = [
  {
    id: 1,
    title: "問題 1 品質管理",
    question: "品質管理に関する記述として、最も適切なものはどれか。",
    type: "most_appropriate",
    choices: [
      { label: "ア", text: "不合格になるはずのロットが合格になる確率を、消費者危険と呼ぶ。" },
      { label: "イ", text: "設計品質は、適合の品質とも呼ばれる。" },
      { label: "ウ", text: "安全性能が要求される医療機などは、通常抜取検査が実施される。" },
      { label: "エ", text: "TQMでは、生産部門の担当者が改善を行って不良の流出を防止する。" },
    ],
    correct: "ア",
    explanation: {
      summary: "品質管理（QC）の基本概念、品質の種類、検査方法について理解しましょう。",
      details: [
        { label: "ア ○", text: "抜取検査のサンプルの品質がたまたま合格基準を満たしているため、本来は不合格のはずのロットを合格にしてしまう確率を、消費者危険と呼びます。消費者危険とは消費者側のリスクという意味です。よって記述は適切です。" },
        { label: "イ ×", text: "設計品質は、顧客の要求を満たすための品質を、目標として設定したもので「狙いの品質」と呼ばれます。「適合の品質」と呼ばれるのは、製造品質です。よって記述は不適切です。" },
        { label: "ウ ×", text: "医療機や自動車など安全上の品質が重視される製品や、高価な製品は、不具合の見逃しが許されません。このため全数検査を行うのが一般的です。よって記述は不適切です。" },
        { label: "エ ×", text: "TQMではより高い視点に立った、顧客満足の向上を重視しています。そのため、製品を現場で改善するだけでなく、経営戦略としてトップダウンで顧客満足や、企業全体の経営の品質を向上させていきます。よって記述は不適切です。" },
      ],
      table: {
        title: "品質管理のキーワード",
        headers: ["用語", "内容"],
        rows: [
          ["設計品質（ねらいの品質）", "設計時に、顧客の要求を満たすための目標として設定した品質"],
          ["製造品質（適合の品質）", "製品の製造時に結果として生じた品質。設計品質に近づけることが目標"],
          ["TQC（全社的品質管理）", "生産現場だけでなく、全ての段階で全社的に品質管理を行う"],
          ["TQM（総合的品質管理）", "経営戦略としてトップダウンで顧客満足・品質向上を図る手法"],
          ["QCサークル", "小集団による、現場からのボトムアップの品質改善活動"],
          ["生産者危険", "本来は合格にすべきロットを不合格にしてしまうリスク"],
          ["消費者危険", "本来は不合格にすべきロットを合格にしてしまうリスク"],
          ["全数検査", "ロット内の全製品を検査。医療機・高価な製品に適用"],
          ["抜取検査", "サンプルを抜取りロット全体の合否を判定。安価・大量生産品に適用"],
        ],
      },
    },
  },
  {
    id: 2,
    title: "問題 2 TQM",
    question: "TQM（総合的品質管理）に関する記述として、最も不適切なものはどれか。",
    type: "most_inappropriate",
    choices: [
      { label: "ア", text: "TQMでは、結果だけに着目するのではなく、プロセスの改善により品質を向上させることを重視している。" },
      { label: "イ", text: "TQMの原則には、「目的に関する原則」、「手段に関する原則」、「組織の運営に関する原則」の3つがある。" },
      { label: "ウ", text: "TQMでは、会社利益の優先ではなく、顧客第一の考え方で活動を進めることを重視している。" },
      { label: "エ", text: "TQMの「組織の運営に関する原則」の中には、リーダーシップ、重点志向、人間性尊重、教育訓練の重視がある。" },
    ],
    correct: "エ",
    explanation: {
      summary: "TQMの3つの原則とその構成内容を整理しましょう。",
      details: [
        { label: "ア ○", text: "TQMの「手段に関する原則」における、「プロセス重視」の考え方になります。良い結果を継続的に得るためのプロセスに着目し、管理・向上させていくという考え方です。よって記述は適切です。" },
        { label: "イ ○", text: "TQMには、「目的に関する原則」、「手段に関する原則」、「組織の運営に関する原則」、の3つがあります。よって記述は適切です。" },
        { label: "ウ ○", text: "TQMの「目的に関する原則」における、「品質第一」や「マーケットイン」の考え方になります。顧客を第一に考え、顧客ニーズを満たす良い製品やサービスの提供を優先させていく考え方です。よって記述は適切です。" },
        { label: "エ ×", text: "「重点志向」は、「手段に関する原則」に含まれます。よって記述は不適切です。なお、「組織の運営に関する原則」には、リーダーシップ、人間性尊重、教育訓練の重視、全員参加が含まれます。" },
      ],
      table: {
        title: "TQMの3つの原則",
        headers: ["原則", "主な内容"],
        rows: [
          ["目的に関する原則", "品質第一、マーケットイン、顧客満足重視"],
          ["手段に関する原則", "プロセス重視、重点志向、データに基づく管理"],
          ["組織の運営に関する原則", "リーダーシップ、全員参加、人間性尊重、教育訓練の重視"],
        ],
      },
    },
  },
  {
    id: 3,
    title: "問題 3 QC7つ道具 1",
    question: "品質管理におけるQC手法を用いる場面の説明として、最も適切なものはどれか。",
    type: "most_appropriate",
    choices: [
      { label: "ア", text: "Ｘ－Ｒ管理図を用いて、ブザーの音量と電流値の関連性を調べた。" },
      { label: "イ", text: "散布図を用いて、塗装ムラが発生する予想原因を複数のメンバーで議論した。" },
      { label: "ウ", text: "ヒストグラムを用いて、100個の製品重量のバラツキを調べた。" },
      { label: "エ", text: "層別を用いて、製品の重さが許容値内であるか管理した。" },
    ],
    correct: "ウ",
    explanation: {
      summary: "QC7つ道具の各手法の適切な使用場面を理解しましょう。",
      details: [
        { label: "ア ×", text: "Ｘ－Ｒ管理図は、サンプルの平均値と範囲を管理するための管理図です。2つの特性の相関関係を調べる場合には、散布図を用います。よって記述は不適切です。" },
        { label: "イ ×", text: "散布図は、2つの特性の相関関係を把握するために使います。問題の発生原因を複数のメンバーで議論するのであれば、特性要因図を用います。よって記述は不適切です。" },
        { label: "ウ ○", text: "ヒストグラムは、度数分布図とも呼ばれ、データ範囲ごとのデータの個数（度数）を表示したグラフです。100個の製品の重量バラツキを調べるのに適切です。よって記述は適切です。" },
        { label: "エ ×", text: "層別は、データの母集団を幾つかの層に分割する際に用います。ある特性の範囲を管理する場合は、管理図を用います。よって記述は不適切です。" },
      ],
      table: {
        title: "QC7つ道具",
        headers: ["手法", "用途"],
        rows: [
          ["管理図（X-R管理図など）", "時系列でデータを管理し、工程の異常を検出する"],
          ["散布図", "2つの特性の相関関係（正・負・無相関）を把握する"],
          ["ヒストグラム（度数分布図）", "データ分布のバラツキを把握する。正規分布となるのが正常"],
          ["パレート図", "不良原因などを多い順に並べ、重点課題を明確にする"],
          ["特性要因図（魚骨図）", "原因と結果の関係を図示。QCサークルでのブレインストーミングに活用"],
          ["チェックシート", "確認項目を一覧にしてデータ収集・確認を行う"],
          ["層別", "データを複数の層（種別）に分けて他の手法と組み合わせて使用"],
        ],
      },
    },
  },
  {
    id: 4,
    title: "問題 4 QC7つ道具 2",
    question: "品質管理におけるQC手法の内容について、最も不適切なものはどれか。",
    type: "most_inappropriate",
    choices: [
      { label: "ア", text: "管理図には、管理限界を示す2本の線が引かれる。" },
      { label: "イ", text: "散布図の偽相関とは、2つの特性の間に一見関係がないように見えても、実際に相関があることをいう。" },
      { label: "ウ", text: "ヒストグラムのデータの分布は、一般には正規分布となる。" },
      { label: "エ", text: "特性要因図は、QCサークルで実際に取組む活動内容を決める際に役立つ。" },
    ],
    correct: "イ",
    explanation: {
      summary: "QC7つ道具の各手法の詳細な内容・特徴を押さえましょう。",
      details: [
        { label: "ア ○", text: "管理図には、上下に管理限界線があります。上の線を上方管理限界線、下の線を下方管理限界線と呼びます。測定したデータが管理限界線を越えた場合は、異常と判定します。よって記述は適切です。" },
        { label: "イ ×", text: "散布図における偽相関とは、一見、散布図上で相関があるように見えても、実際は第3の要因によって相関に見えているだけで、直接関係がないことです。「一見関係がないように見えても実際に相関がある」は逆の説明です。よって記述は不適切です。" },
        { label: "ウ ○", text: "ヒストグラムの分布は、通常、中央が高くなり、その左右が裾野のように広がる正規分布となります。分布が正規分布とならない場合はなんらかの異常が考えられます。よって記述は適切です。" },
        { label: "エ ○", text: "特性要因図は、ある特性の結果が複数の要因によりもたらされている場合の整理に役立ちます。QCサークルでテーマを決めた後、品質向上のために行う活動や優先順位を決めるのに役立ちます。よって記述は適切です。" },
      ],
      table: null,
    },
  },
  {
    id: 5,
    title: "問題 5 新QC7つ道具",
    question: "品質管理における新QC7つ道具と、分析内容の組合わせとして、最も適切なものはどれか。",
    type: "most_appropriate",
    choices: [
      { label: "ア", text: "連関図法 ― ばらばらの情報をグループにまとめ、問題などを整理する。" },
      { label: "イ", text: "親和図法 ― 目標を設定し、そこにいたるまでの手段を系統立てて展開する。" },
      { label: "ウ", text: "マトリックス図法 ― 数値データを用いて、2つの要素の問題を整理する。" },
      { label: "エ", text: "PDPC法 ― 予め発生しそうな問題とその対応策を考えておき、プロジェクトを運営する。" },
    ],
    correct: "エ",
    explanation: {
      summary: "新QC7つ道具の各手法の内容を正確に理解しましょう。データを扱うのはマトリックスデータ解析のみです。",
      details: [
        { label: "ア ×", text: "連関図法とは、原因と結果、目的と手段が絡みあった問題について、関係を明確にする方法です。選択肢の記述は親和図法に関する内容です。よって記述は不適切です。" },
        { label: "イ ×", text: "親和図法とは、ばらばらの情報をまとめ、問題などを明確にする方法です。選択肢の記述は、系統図法に関する内容です。よって記述は不適切です。" },
        { label: "ウ ×", text: "マトリックス図法では、2つの要素間の関係は図記号（◎、△、×）や英数字等で関係の強さなどを定性的に表します。数値データを用いて関係性を分かりやすくするのは、マトリックスデータ解析です。よって記述は不適切です。" },
        { label: "エ ○", text: "PDPC法は、予め発生しそうな問題と、その対応策を考えておき、それに沿った行動や新しい手法を考える方法です。よって記述は適切です。" },
      ],
      table: {
        title: "新QC7つ道具",
        headers: ["手法", "内容"],
        rows: [
          ["連関図法", "原因と結果が複雑に絡み合った問題の関係を明確にする"],
          ["親和図法", "ばらばらの情報をグループにまとめ、問題を整理・明確化する"],
          ["系統図法", "目標を設定し、達成手段を系統立てて展開する"],
          ["マトリックス図法", "2つの要素間の関係を図記号で定性的に整理する"],
          ["マトリックスデータ解析法", "数値データを用いて2つの要素の問題を整理（新QC7つ道具で唯一データを扱う）"],
          ["PDPC法", "予め問題と対応策を考え、プロジェクトを運営する方法"],
          ["アロー・ダイアグラム法", "作業の順序・日程を矢印で表し、進行管理を行う"],
        ],
      },
    },
  },
  {
    id: 6,
    title: "問題 6 設備保全活動1",
    question: "設備の保全活動に関する記述として、最も適切なものはどれか。",
    type: "most_appropriate",
    choices: [
      { label: "ア", text: "プレス機がよく停止するため、故障が起こりにくくなるように改善した。これを予防保全と呼ぶ。" },
      { label: "イ", text: "加工機のオイルの交換時期がきたので交換した。これを事後保全と呼ぶ。" },
      { label: "ウ", text: "新しい切削マシンの導入時に、現行機種の保全実績を考慮して機種を選定した。これを保全予防と呼ぶ。" },
      { label: "エ", text: "測定器の電池が切れたので新品に交換した。これを改良保全と呼ぶ。" },
    ],
    correct: "ウ",
    explanation: {
      summary: "設備保全の種類を整理しましょう。語呂合わせ「い・よ・か・ほ」（維持(い)は予防(よ) / 改善(か)は保全(ほ)）で覚えると便利です。",
      details: [
        { label: "ア ×", text: "設備そのものを、故障しにくくなるように改善する活動は、改良保全に該当します。よって記述は不適切です。" },
        { label: "イ ×", text: "消耗部品等の定期交換により故障を防止する活動は、予防保全に該当します。よって記述は不適切です。" },
        { label: "ウ ○", text: "過去の保全実績に基づき、新しい設備の導入を計画したり、設計する活動は、保全予防に該当します。よって記述は適切です。" },
        { label: "エ ×", text: "動作不能な状態になった後での復旧処置は、事後保全に該当します。よって記述は不適切です。" },
      ],
      table: {
        title: "設備保全の種類",
        headers: ["区分", "種類", "内容"],
        rows: [
          ["維持する活動", "予防保全", "故障前に定期的に点検・部品交換を行い、故障を防止する"],
          ["維持する活動", "事後保全", "故障が発生した後に修理・復旧を行う"],
          ["改善する活動", "改良保全", "設備そのものを改良して、故障しにくくする"],
          ["改善する活動", "保全予防", "新設備の導入・設計時に過去の保全実績を活かして改善する"],
        ],
      },
    },
  },
  {
    id: 7,
    title: "問題 7 設備保全活動2",
    question: "TPM(Total Productive Maintenance)における自主保全活動に関する記述として、最も不適切なものはどれか。",
    type: "most_inappropriate",
    choices: [
      { label: "ア", text: "経営トップから第一線の従業員にいたるまで全員が参加し、ロス・ゼロを達成するための自主保全活動である。" },
      { label: "イ", text: "自主保全活動は7つのステップで実施され、最後のステップは「自主管理の徹底」となる。" },
      { label: "ウ", text: "設備を中心とするゴミ・ヨゴレの一斉排除と給油、増締めは、「自主点検」のステップで実施される。" },
      { label: "エ", text: "必要な保全作業や点検を短時間で確実に実施し、維持するための行動基準の作成は、「自主保全仮基準の作成」のステップで実施される。" },
    ],
    correct: "ウ",
    explanation: {
      summary: "TPMの自主保全活動7つのステップの順番と各内容を押さえましょう。",
      details: [
        { label: "ア ○", text: "TPMによる保全活動の特徴は、全員参加のもと、ロス・ゼロを目指します。よって記述は適切です。" },
        { label: "イ ○", text: "自主保全活動は7つのステップで実施されます。「初期清掃（清掃・点検）」から始まり、最後は「自主管理の徹底」となります。よって記述は適切です。" },
        { label: "ウ ×", text: "「自主点検」のステップで実施されるのは、能率よく確実に維持できる各種点検基準や点検チェックシートの作成と実施です。選択肢にある「ゴミ・ヨゴレの一斉排除と給油、増締め」の活動は、「初期清掃（清掃・点検）」となります。よって記述は不適切です。" },
        { label: "エ ○", text: "「自主保全の仮基準の作成」のステップでは、短時間で清掃・給油・増締め・点検等の必要な保全作業が、確実に実施かつ維持できる行動基準が作成されます。よって記述は適切です。" },
      ],
      table: {
        title: "TPM自主保全活動の7つのステップ",
        headers: ["ステップ", "内容"],
        rows: [
          ["①初期清掃（清掃・点検）", "設備のゴミ・ヨゴレの一斉排除と給油、増締め"],
          ["②発生源・困難箇所対策", "ゴミ・ヨゴレの発生源や清掃困難箇所の対策"],
          ["③自主保全仮基準の作成", "短時間で保全作業が確実に実施できる行動基準の作成"],
          ["④総点検", "設備の各部位を点検し、微欠陥を発見・復元する"],
          ["⑤自主点検", "点検基準や点検チェックシートの作成と実施"],
          ["⑥工程品質の作り込み", "品質不良ゼロを目指した工程管理の標準化"],
          ["⑦自主管理の徹底", "自律的な管理・改善活動の定着"],
        ],
      },
    },
  },
  {
    id: 8,
    title: "問題 8 設備効率",
    question: "設備効率に関する次の文中の、空欄Ａ～Ｄに入る語句の組み合わせとして、最も適切なものはどれか。\n\n設備効率を表す指標には、（　Ａ　）、性能稼働率、良品率がある。これら3つの指標を掛け合わせることで、設備の全体の効率である、（　Ｂ　）が求められる。このうち（　Ａ　）を高めるには設備故障を防止したり、（　Ｃ　）を極力短くする必要がある。また性能稼働率を高めるには、設備が一時的に停止する（　Ｄ　）や、空転、速度低下などの無駄を極力減らす必要がある。",
    type: "most_appropriate",
    choices: [
      { label: "ア", text: "Ａ：設備稼働率　Ｂ：全体設備効率　Ｃ：標準時間　Ｄ：チョコ停" },
      { label: "イ", text: "Ａ：時間稼働率　Ｂ：全体設備効率　Ｃ：段取り時間　Ｄ：ロス停" },
      { label: "ウ", text: "Ａ：設備稼働率　Ｂ：設備総合効率　Ｃ：標準時間　Ｄ：ロス停" },
      { label: "エ", text: "Ａ：時間稼働率　Ｂ：設備総合効率　Ｃ：段取り時間　Ｄ：チョコ停" },
    ],
    correct: "エ",
    explanation: {
      summary: "設備効率の3指標と設備総合効率の計算式を押さえましょう。",
      details: [
        { label: "Ａ：時間稼働率", text: "設備の故障や段取り時間などで設備が停止したロスを測定する指標。時間稼働率 ＝ 稼働時間 ÷ 負荷時間" },
        { label: "Ｂ：設備総合効率", text: "「全体設備効率」も似た語句ですが、設備の全体効率は「設備総合効率」と呼ばれます。設備総合効率 ＝ 時間稼働率 × 性能稼働率 × 良品率" },
        { label: "Ｃ：段取り時間", text: "「標準時間」とは実際の作業時間に余裕時間などを加えた標準時間のこと。設備効率の文脈では「段取り時間」を短くすることが時間稼働率向上に寄与します。" },
        { label: "Ｄ：チョコ停", text: "段取りや故障による停止とは別に、一時的なトラブルによる設備の停止を「チョコ停」と呼びます。性能稼働率 ＝ 正味稼働時間 ÷ 稼働時間" },
      ],
      table: {
        title: "設備効率の3指標",
        headers: ["指標", "計算式", "測定するロス"],
        rows: [
          ["時間稼働率", "稼働時間 ÷ 負荷時間", "設備故障・段取り時間などの停止ロス"],
          ["性能稼働率", "正味稼働時間 ÷ 稼働時間", "チョコ停・空転・速度低下などの性能ロス"],
          ["良品率", "価値稼働時間 ÷ 正味稼働時間", "不良品・手直しなどの不良ロス"],
          ["設備総合効率", "時間稼働率 × 性能稼働率 × 良品率", "設備全体の効率"],
        ],
      },
    },
  },
  {
    id: 9,
    title: "問題 9 設備の評価指標",
    question: "設備の評価指標に関する記述として、最も適切なものはどれか。",
    type: "most_appropriate",
    choices: [
      { label: "ア", text: "MTBFは、故障した設備が稼働できる状態に修復するための時間の平均値である。" },
      { label: "イ", text: "MTTRは、故障した設備が修復してから次に故障するまでの時間の平均値である。" },
      { label: "ウ", text: "可用率とは、設備が必要とされるときに使用中または運転可能な状態にある確率である。" },
      { label: "エ", text: "可用率は、MTTR÷（MTBF＋MTTR）で求めることができる。" },
    ],
    correct: "ウ",
    explanation: {
      summary: "MTBF・MTTR・可用率の定義と計算式を確実に押さえましょう。",
      details: [
        { label: "ア ×", text: "MTBF（Mean Time Between Failures）は平均故障間隔のことで、故障した設備が修復してから、次に故障するまでの時間の平均値です。選択肢はMTTRの説明です。よって記述は不適切です。" },
        { label: "イ ×", text: "MTTR（Mean Time To Repair）は平均修復時間のことで、故障した設備が稼働できる状態に修復するための時間の平均値です。選択肢はMTBFの説明です。よって記述は不適切です。" },
        { label: "ウ ○", text: "可用率とは、設備が必要とされるときに使用中または運転可能な状態にある確率です。アベイラビリティあるいは可動率（べきどうりつ）とも言います。よって記述は適切です。" },
        { label: "エ ×", text: "可用率を求める式は、MTBF÷（MTBF＋MTTR）です。本肢の式は分子がMTTRになっており、間違いです。よって記述は不適切です。" },
      ],
      table: {
        title: "設備の評価指標",
        headers: ["指標", "正式名称", "定義・計算式"],
        rows: [
          ["MTBF", "平均故障間隔（Mean Time Between Failures）", "修復してから次に故障するまでの時間の平均値。稼働時間合計 ÷ 故障回数"],
          ["MTTR", "平均修復時間（Mean Time To Repair）", "故障してから修復完了までの時間の平均値。修理時間合計 ÷ 修理回数"],
          ["可用率", "アベイラビリティ・可動率", "MTBF ÷（MTBF＋MTTR）"],
        ],
      },
    },
  },
  {
    id: 10,
    title: "問題 10 環境保全",
    question: "環境保全に関する記述として、最も適切なものはどれか。",
    type: "most_appropriate",
    choices: [
      { label: "ア", text: "環境基本法では、事業者の責務として、廃棄物の適正処理、公害防止、環境負荷の低減、再生資源の利用などを挙げている。" },
      { label: "イ", text: "廃棄物削減に取組む3つの観点として、リジェクト、リユース、リサイクルがある。" },
      { label: "ウ", text: "循環型社会形成推進基本法では、廃棄物の処理の優先順位を ①発生抑制、②再生利用、③再利用、④熱回収、⑤適正処分 の順で決めている。" },
      { label: "エ", text: "企業が排出する廃棄物の量をゼロにする取組みのことを、ゼロディフェクトと呼ぶ。" },
    ],
    correct: "ア",
    explanation: {
      summary: "環境保全に関する法律（環境基本法・循環型社会形成推進基本法）と3R・ゼロエミッションを押さえましょう。",
      details: [
        { label: "ア ○", text: "環境基本法では、選択肢の記述の通りの内容を挙げています。また、これを推進するために、環境基本計画として長期的な目標が定められています。よって記述は適切です。" },
        { label: "イ ×", text: "廃棄物削減の3Rとは、「リデュース（廃棄物の発生抑制）」「リユース（再使用）」「リサイクル（再利用）」の3つの頭文字をとったものです。リジェクトではありません。よって記述は不適切です。" },
        { label: "ウ ×", text: "廃棄物の処理の優先順位は、①発生抑制、②再利用、③再生利用、④熱回収、⑤適正処分の順です。選択肢の記述は②と③が逆となります。よって記述は不適切です。" },
        { label: "エ ×", text: "廃棄物の量をゼロにする取り組みは、ゼロエミッションと呼ばれています。ゼロディフェクトは不良の発生をゼロにすることです。よって記述は不適切です。" },
      ],
      table: {
        title: "廃棄物処理の優先順位（循環型社会形成推進基本法）",
        headers: ["順位", "内容"],
        rows: [
          ["①", "発生抑制（リデュース）"],
          ["②", "再利用（リユース）"],
          ["③", "再生利用（リサイクル）"],
          ["④", "熱回収"],
          ["⑤", "適正処分"],
        ],
      },
    },
  },
  {
    id: 11,
    title: "問題 11 開発・設計の情報システム",
    question: "コンピュータを用いた開発・設計の情報システムに関する記述として、最も適切なものはどれか。",
    type: "most_appropriate",
    choices: [
      { label: "ア", text: "強度に不安がある部品のモデルをコンピュータ上に作成し、強度のシミュレーションを行うのに、「CAD」を用いた。" },
      { label: "イ", text: "新製品を開発するにあたり、前モデルと同じ部品を使用する部分については、その部品の「CAE」データを再利用しながら設計を進めた。" },
      { label: "ウ", text: "コンピューター上の部品設計データを、「CAM」を用いて加工機械で使えるデータに変換した。" },
      { label: "エ", text: "設計・開発に関わるすべての情報を一元化して管理し、複数部門で共有ができるように、「CAI」を導入した。" },
    ],
    correct: "ウ",
    explanation: {
      summary: "CAD・CAM・CAE・PDMの役割の違いを正確に理解しましょう。CAIは教育システムです。",
      details: [
        { label: "ア ×", text: "「CAD」は、製品の設計をコンピュータを利用して行うシステムです。シミュレーションを行う選択肢の記述は「CAE」に関する内容です。よって記述は不適切です。" },
        { label: "イ ×", text: "「CAE」は、コンピュータ上のモデルの情報を基に、製品の解析評価・シミュレーションを行うシステムです。設計データを再利用して設計を進めるのは「CAD」に関する内容です。よって記述は不適切です。" },
        { label: "ウ ○", text: "「CAM」は、CADなどで設計したコンピュータ上のモデル情報を、実際の生産に必要な情報（NC工作機械へのインプット）に変換するシステムです。よって記述は適切です。" },
        { label: "エ ×", text: "「CAI」は、コンピュータを用いた学習（教育）システムです。設計情報を一元管理し複数部門で共有するのは「PDM（製品情報管理システム）」に関する内容です。よって記述は不適切です。" },
      ],
      table: {
        title: "開発・設計の情報システム",
        headers: ["システム", "正式名称", "主な機能"],
        rows: [
          ["CAD", "Computer-Aided Design", "コンピュータを利用した製品設計。設計データ（モデル）を作成・管理"],
          ["CAM", "Computer-Aided Manufacturing", "CADの設計データをNC工作機械などにインプットする製造支援"],
          ["CAE", "Computer-Aided Engineering", "コンピュータ上で強度・安定性などのシミュレーション・解析評価"],
          ["PDM", "Product Data Management", "設計情報・部品表・変更履歴などを一元管理。コンカレントエンジニアリングを実現"],
          ["CAI", "Computer-Aided Instruction", "コンピュータを用いた教育・学習システム（製品開発とは無関係）"],
        ],
      },
    },
  },
  {
    id: 12,
    title: "問題 12 製造の情報システム",
    question: "製造の情報システムの内容の組合せとして、最も不適切なものはどれか。",
    type: "most_inappropriate",
    choices: [
      { label: "ア", text: "NC － 入力された、切削用工具の刃先の加工動作情報をもとに、動作する機械。" },
      { label: "イ", text: "MC － 自動工具交換機能をもち、1台でさまざまな加工ができる機械。" },
      { label: "ウ", text: "FMC － まとまった工程を自動化できるように、機械を組み合わせたもの。" },
      { label: "エ", text: "FMS － 生産だけでなく、受注や設計、物流なども含めて全体を管理するシステム。" },
    ],
    correct: "エ",
    explanation: {
      summary: "NC→MC→FMC→FMS→FA→CIMの順に適用範囲が広がります。FMCのC=Cell（狭い範囲）、FMSのS=System（ライン全体）と覚えましょう。",
      details: [
        { label: "ア ○", text: "「NC」は、CADなどで作成した設計情報から生成したプログラムを使い、数値制御により自動加工を行う工作機械です。よって記述は適切です。" },
        { label: "イ ○", text: "「MC」は、機械に多数の工具がセットされており、工具を自動的に使い分けながら、1台で様々な加工ができる工作機械です。よって記述は適切です。" },
        { label: "ウ ○", text: "「FMC」は、NCやロボットなどの個々の機械を組み合わせ、セル単位で作業を自動化するものです。よって記述は適切です。" },
        { label: "エ ×", text: "FMSは、複数のFMCや自動搬送装置を組み合わせて構成された工程全体をコンピュータで管理する生産システムです。選択肢の記述（受注・設計・物流も含む全体管理）はCIMに関する内容です。よって記述は不適切です。" },
      ],
      table: {
        title: "製造の情報システム（範囲の小さい順）",
        headers: ["システム", "正式名称", "適用範囲"],
        rows: [
          ["NC", "Numerical Control", "数値制御による単一の工作機械"],
          ["MC", "Machining Center", "自動工具交換機能を持つ単一の加工機"],
          ["FMC", "Flexible Manufacturing Cell", "NCやロボットを組み合わせたセル（小範囲の自動化）"],
          ["FMS", "Flexible Manufacturing System", "複数のFMCと自動搬送装置で構成される工程全体の管理"],
          ["FA", "Factory Automation", "工場全体を管理するシステム"],
          ["CIM", "Computer Integrated Manufacturing", "受注・設計・物流なども含む製造業のオペレーション全体を管理"],
        ],
      },
    },
  },
  {
    id: 13,
    title: "問題 13 サプライチェーンマネジメント",
    question: "サプライチェーンマネジメントについて、JISの定義の中では、その目標を次のように記載している。文中の空欄A～Dに入る用語の組合せとして、もっとも適切なものはどれか。\n\nSCMの目標は、（　Ａ　）マネジメントを実現するとともに、最新情報技術及び制約理論、APSというサプライチェーン計画などの管理技術に基づき、（　Ｂ　）の変化に対してサプライチェーン全体を（　Ｃ　）に変化させ、ダイナミックな環境のもとで部門間や企業間における業務の（　Ｄ　）を図ることである。",
    type: "most_appropriate",
    choices: [
      { label: "ア", text: "Ａ：キャッシュフロー　Ｂ：景気　Ｃ：俊敏　Ｄ：効率最適化" },
      { label: "イ", text: "Ａ：顧客重視　Ｂ：市場　Ｃ：柔軟　Ｄ：全体最適化" },
      { label: "ウ", text: "Ａ：キャッシュフロー　Ｂ：市場　Ｃ：俊敏　Ｄ：全体最適化" },
      { label: "エ", text: "Ａ：顧客重視　Ｂ：景気　Ｃ：柔軟　Ｄ：効率最適化" },
    ],
    correct: "ウ",
    explanation: {
      summary: "SCMのJIS定義の重要キーワード「キャッシュフロー」「市場」「俊敏」「全体最適化」を押さえましょう。",
      details: [
        { label: "Ａ：キャッシュフロー", text: "SCMの目標は「キャッシュフローマネジメントを実現する」ことです。企業間で情報共有することで在庫を削減し、キャッシュフローを高める目的があります。" },
        { label: "Ｂ：市場", text: "「市場の変化に対して」俊敏に対応することがSCMの目標です。景気ではなく市場が正解です。" },
        { label: "Ｃ：俊敏", text: "サプライチェーン全体を「俊敏に」変化させることがポイントです。柔軟ではなく俊敏が正解です。" },
        { label: "Ｄ：全体最適化", text: "部門間や企業間における業務の「全体最適化」を図ることがSCMの目標です。効率最適化ではありません。" },
      ],
      table: {
        title: "SCMの重要ポイント",
        headers: ["キーワード", "内容"],
        rows: [
          ["サプライチェーン", "材料→生産→販売→消費者への一連の供給連鎖"],
          ["情報共有", "販売情報・需要情報・生産情報をリアルタイムで共有"],
          ["全体最適化", "部門間・企業間の業務全体を最適化"],
          ["キャッシュフロー改善", "在庫削減・リードタイム短縮による経営効率化"],
          ["俊敏な対応", "市場の変化に対してサプライチェーン全体を俊敏に変化させる"],
        ],
      },
    },
  },
];

const STORAGE_KEY = "quiz_state_3_6";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    console.log("[loadState] failed, resetting");
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log("[saveState] saved", state);
  } catch (e) {
    console.log("[saveState] error", e);
  }
}

export default function App() {
  const [screen, setScreen] = useState("start");
  const [mode, setMode] = useState("all");
  const [quizQueue, setQuizQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [quizState, setQuizState] = useState({});

  useEffect(() => {
    const loaded = loadState();
    console.log("[init] loaded state", loaded);
    setQuizState(loaded);
  }, []);

  const updateState = (newState) => {
    setQuizState(newState);
    saveState(newState);
  };

  const startQuiz = (selectedMode) => {
    console.log("[startQuiz] mode:", selectedMode);
    setMode(selectedMode);
    let queue = [];
    if (selectedMode === "all") {
      queue = [...QUESTIONS];
    } else if (selectedMode === "wrong") {
      queue = QUESTIONS.filter((q) => quizState[q.id]?.lastResult === false);
    } else if (selectedMode === "review") {
      queue = QUESTIONS.filter((q) => quizState[q.id]?.review === true);
    }
    if (queue.length === 0) {
      alert("対象の問題がありません。");
      return;
    }
    setQuizQueue(queue);
    setCurrentIdx(0);
    setAnswered(null);
    setScreen("quiz");
  };

  const handleAnswer = (label) => {
    const q = quizQueue[currentIdx];
    const isCorrect = label === q.correct;
    console.log("[handleAnswer] q:", q.id, "ans:", label, "correct:", isCorrect);
    setAnswered(label);
    const prev = quizState[q.id] || {};
    const newState = {
      ...quizState,
      [q.id]: {
        ...prev,
        lastResult: isCorrect,
        review: prev.review || false,
        attempts: (prev.attempts || 0) + 1,
        correctCount: (prev.correctCount || 0) + (isCorrect ? 1 : 0),
      },
    };
    updateState(newState);
  };

  const toggleReview = (qId) => {
    const prev = quizState[qId] || {};
    const newState = {
      ...quizState,
      [qId]: { ...prev, review: !prev.review },
    };
    console.log("[toggleReview] q:", qId, "review:", !prev.review);
    updateState(newState);
  };

  const goNext = () => {
    if (currentIdx + 1 < quizQueue.length) {
      setCurrentIdx(currentIdx + 1);
      setAnswered(null);
    } else {
      setScreen("result");
    }
  };

  const currentQ = quizQueue[currentIdx];

  if (screen === "start") {
    const wrongCount = QUESTIONS.filter((q) => quizState[q.id]?.lastResult === false).length;
    const reviewCount = QUESTIONS.filter((q) => quizState[q.id]?.review === true).length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="text-indigo-600" size={28} />
            <h1 className="text-xl font-bold text-gray-800">スマート問題集</h1>
          </div>
          <p className="text-sm text-indigo-700 font-semibold mb-6">3-6 生産のオペレーション</p>
          <p className="text-gray-500 text-sm mb-6">全 {QUESTIONS.length} 問｜モードを選んでスタート</p>

          <div className="space-y-3">
            <button
              onClick={() => startQuiz("all")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 px-5 flex items-center justify-between transition-colors"
            >
              <span className="font-semibold">すべての問題</span>
              <div className="flex items-center gap-2">
                <span className="text-indigo-200 text-sm">{QUESTIONS.length}問</span>
                <ChevronRight size={18} />
              </div>
            </button>
            <button
              onClick={() => startQuiz("wrong")}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 px-5 flex items-center justify-between transition-colors"
            >
              <span className="font-semibold">前回不正解の問題のみ</span>
              <div className="flex items-center gap-2">
                <span className="text-red-100 text-sm">{wrongCount}問</span>
                <ChevronRight size={18} />
              </div>
            </button>
            <button
              onClick={() => startQuiz("review")}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-3 px-5 flex items-center justify-between transition-colors"
            >
              <span className="font-semibold">要復習の問題のみ</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-100 text-sm">{reviewCount}問</span>
                <ChevronRight size={18} />
              </div>
            </button>
            <button
              onClick={() => setScreen("history")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 px-5 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <List size={18} />
                <span className="font-semibold">履歴・一覧</span>
              </div>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "quiz" && currentQ) {
    const qState = quizState[currentQ.id] || {};
    const isReview = qState.review || false;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setScreen("start")} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
              <Home size={18} />
              <span className="text-sm">ホーム</span>
            </button>
            <span className="text-sm text-gray-500">{currentIdx + 1} / {quizQueue.length}</span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
                {currentQ.title}
              </span>
              {currentQ.type === "most_inappropriate" && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">最も不適切</span>
              )}
            </div>
            <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">{currentQ.question}</p>
          </div>

          <div className="space-y-3 mb-4">
            {currentQ.choices.map((c) => {
              let cls = "bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
              if (answered) {
                if (c.label === currentQ.correct) {
                  cls = "bg-green-50 border-2 border-green-500";
                } else if (c.label === answered && answered !== currentQ.correct) {
                  cls = "bg-red-50 border-2 border-red-400";
                } else {
                  cls = "bg-white border-2 border-gray-200 opacity-60";
                }
              }
              return (
                <button
                  key={c.label}
                  onClick={() => !answered && handleAnswer(c.label)}
                  className={`w-full rounded-xl p-4 text-left transition-all ${cls}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-indigo-700 shrink-0 w-5">{c.label}</span>
                    <span className="text-gray-800 text-sm leading-relaxed">{c.text}</span>
                    {answered && c.label === currentQ.correct && (
                      <Check size={18} className="text-green-600 shrink-0 ml-auto" />
                    )}
                    {answered && c.label === answered && answered !== currentQ.correct && (
                      <X size={18} className="text-red-500 shrink-0 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {answered === currentQ.correct ? (
                    <span className="flex items-center gap-1 text-green-600 font-bold"><Check size={20} />正解！</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 font-bold"><X size={20} />不正解</span>
                  )}
                  <span className="text-gray-500 text-sm">正解：{currentQ.correct}</span>
                </div>
                <button
                  onClick={() => toggleReview(currentQ.id)}
                  className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full border transition-colors ${
                    isReview
                      ? "bg-amber-100 border-amber-400 text-amber-700"
                      : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-amber-50"
                  }`}
                >
                  <BookOpen size={14} />
                  {isReview ? "要復習 ✓" : "要復習"}
                </button>
              </div>

              <p className="text-indigo-700 font-semibold text-sm mb-3">【解説のポイント】</p>
              <p className="text-gray-600 text-sm mb-4">{currentQ.explanation.summary}</p>

              <div className="space-y-3 mb-4">
                {currentQ.explanation.details.map((d, i) => (
                  <div key={i} className="flex gap-2">
                    <span className={`text-xs font-bold shrink-0 mt-0.5 ${d.label.includes("○") ? "text-green-600" : d.label.includes("×") ? "text-red-500" : "text-indigo-600"}`}>
                      {d.label}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{d.text}</p>
                  </div>
                ))}
              </div>

              {currentQ.explanation.table && (
                <div className="overflow-x-auto">
                  <p className="text-xs text-gray-500 font-semibold mb-2">📋 {currentQ.explanation.table.title}</p>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-indigo-50">
                        {currentQ.explanation.table.headers.map((h, i) => (
                          <th key={i} className="border border-indigo-200 px-2 py-2 text-left text-indigo-700 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentQ.explanation.table.rows.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="border border-gray-200 px-2 py-2 text-gray-700 leading-snug">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={goNext}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {currentIdx + 1 < quizQueue.length ? (
                  <><ChevronRight size={18} />次の問題へ</>
                ) : (
                  <>結果を見る</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === "result") {
    const correct = quizQueue.filter((q) => quizState[q.id]?.lastResult === true).length;
    const total = quizQueue.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">結果発表</h2>
          <div className="text-6xl font-bold text-indigo-600 my-6">{pct}<span className="text-3xl">%</span></div>
          <p className="text-gray-600 mb-2">{total}問中 <span className="text-green-600 font-bold">{correct}問</span> 正解</p>
          <p className="text-gray-400 text-sm mb-8">モード：{mode === "all" ? "すべての問題" : mode === "wrong" ? "前回不正解" : "要復習"}</p>
          <div className="space-y-3">
            <button
              onClick={() => startQuiz(mode)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />もう一度
            </button>
            <button
              onClick={() => setScreen("start")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
            >
              <Home size={18} />ホームへ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "history") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setScreen("start")} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
              <Home size={18} />
              <span className="text-sm">ホーム</span>
            </button>
            <h2 className="text-lg font-bold text-gray-800 ml-2">履歴・一覧</h2>
          </div>
          <div className="space-y-3">
            {QUESTIONS.map((q) => {
              const s = quizState[q.id] || {};
              const attempts = s.attempts || 0;
              const correctCount = s.correctCount || 0;
              const lastResult = s.lastResult;
              const isReview = s.review || false;
              return (
                <div key={q.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {lastResult === true && <span className="text-green-500"><Check size={16} /></span>}
                        {lastResult === false && <span className="text-red-400"><X size={16} /></span>}
                        {lastResult === undefined && <span className="text-gray-300 text-xs">未挑戦</span>}
                        <span className="text-sm font-semibold text-gray-800">{q.title}</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        挑戦: {attempts}回 / 正解: {correctCount}回
                        {attempts > 0 && ` (${Math.round((correctCount / attempts) * 100)}%)`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const prev = quizState[q.id] || {};
                        const newState = { ...quizState, [q.id]: { ...prev, review: !prev.review } };
                        updateState(newState);
                      }}
                      className={`text-xs px-2 py-1 rounded-full border shrink-0 transition-colors ${
                        isReview
                          ? "bg-amber-100 border-amber-400 text-amber-700"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                      }`}
                    >
                      {isReview ? "★要復習" : "☆"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
