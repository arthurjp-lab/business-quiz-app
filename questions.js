const quizQuestions = [
    {
        id: 1,
        category: "strategy",
        question: "ポーターの競争戦略において、企業が競争優位を獲得するための基本戦略として正しくないものはどれですか？",
        options: [
            "コストリーダーシップ戦略",
            "差別化戦略",
            "集中戦略",
            "多角化戦略"
        ],
        correct: 3,
        explanation: "ポーターの基本戦略は、コストリーダーシップ、差別化、集中戦略の3つです。多角化戦略は基本戦略には含まれません。"
    },
    {
        id: 2,
        category: "marketing",
        question: "マーケティングミックスの4Pに含まれないものはどれですか？",
        options: [
            "Product（製品）",
            "Price（価格）",
            "People（人）",
            "Place（流通）"
        ],
        correct: 2,
        explanation: "マーケティングミックスの4Pは、Product（製品）、Price（価格）、Place（流通）、Promotion（プロモーション）です。People（人）は7Pの要素です。"
    },
    {
        id: 3,
        category: "finance",
        question: "ROE（自己資本利益率）を計算する正しい式はどれですか？",
        options: [
            "当期純利益 ÷ 総資産",
            "当期純利益 ÷ 自己資本",
            "営業利益 ÷ 自己資本",
            "売上高 ÷ 自己資本"
        ],
        correct: 1,
        explanation: "ROE（自己資本利益率）は、当期純利益を自己資本で割った値で、株主資本の収益性を示す指標です。"
    },
    {
        id: 4,
        category: "organization",
        question: "マズローの欲求階層説において、最も高次の欲求はどれですか？",
        options: [
            "安全の欲求",
            "承認の欲求",
            "自己実現の欲求",
            "所属と愛の欲求"
        ],
        correct: 2,
        explanation: "マズローの欲求階層説では、自己実現の欲求が最も高次の欲求とされています。"
    },
    {
        id: 5,
        category: "strategy",
        question: "SWOT分析のSWOTが表すものとして正しくないものはどれですか？",
        options: [
            "Strength（強み）",
            "Weakness（弱み）",
            "Opportunity（機会）",
            "Target（標的）"
        ],
        correct: 3,
        explanation: "SWOTはStrength（強み）、Weakness（弱み）、Opportunity（機会）、Threat（脅威）の頭文字です。Target（標的）は含まれません。"
    },
    {
        id: 6,
        category: "marketing",
        question: "顧客生涯価値（CLV: Customer Lifetime Value）について正しい説明はどれですか？",
        options: [
            "顧客の年間購入金額",
            "顧客が企業との関係を通じて生み出す総価値",
            "新規顧客獲得にかかるコスト",
            "顧客満足度の数値化"
        ],
        correct: 1,
        explanation: "顧客生涯価値（CLV）は、顧客が企業との関係継続期間中に生み出す総価値を表す指標です。"
    },
    {
        id: 7,
        category: "finance",
        question: "NPV（正味現在価値）がプラスの投資プロジェクトについて正しい説明はどれですか？",
        options: [
            "投資すべきでない",
            "投資価値がある",
            "リスクが高い",
            "収益性が不明"
        ],
        correct: 1,
        explanation: "NPVがプラスの投資プロジェクトは、投資により価値が創造されることを意味し、投資価値があります。"
    },
    {
        id: 8,
        category: "organization",
        question: "リーダーシップ理論において、状況に応じてリーダーシップスタイルを変える理論はどれですか？",
        options: [
            "特性理論",
            "行動理論",
            "コンティンジェンシー理論",
            "カリスマ理論"
        ],
        correct: 2,
        explanation: "コンティンジェンシー理論（状況適応理論）は、状況に応じて効果的なリーダーシップスタイルが変わるという理論です。"
    },
    {
        id: 9,
        category: "strategy",
        question: "ブルーオーシャン戦略について正しい説明はどれですか？",
        options: [
            "競合との激しい競争を前提とした戦略",
            "既存市場でのシェア拡大を目指す戦略",
            "競争のない新たな市場を創造する戦略",
            "低価格で市場参入する戦略"
        ],
        correct: 2,
        explanation: "ブルーオーシャン戦略は、競争の激しい既存市場（レッドオーシャン）を避け、競争のない新たな市場空間を創造する戦略です。"
    },
    {
        id: 10,
        category: "marketing",
        question: "イノベーター理論において、新製品を最初に採用する消費者層はどれですか？",
        options: [
            "アーリーアダプター",
            "アーリーマジョリティ",
            "イノベーター",
            "レイトマジョリティ"
        ],
        correct: 2,
        explanation: "イノベーター理論では、イノベーターが新製品を最初に採用する消費者層（全体の2.5%）とされています。"
    }
];

const categoryNames = {
    strategy: "戦略論",
    marketing: "マーケティング",
    finance: "財務",
    organization: "組織論"
};