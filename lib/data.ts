export interface Algorithm {
  id: string;
  name: string;
  type: "supervised" | "unsupervised";
  icon: string;
  summary: string;
  use_case: string;
  formula: string;
  details: string;
}

export const algorithms: Algorithm[] = [
  {
    id: "01",
    name: "線性回歸 (Linear Regression)",
    type: "supervised",
    icon: "LineChart",
    summary: "尋找自變數與因變數間的最佳擬合直線",
    use_case: "房價預測、銷售額估計",
    formula: "y = \\beta_0 + \\beta_1 x_1 + \\dots + \\epsilon",
    details: "最基礎的預測模型。旨在建立一條數學直線，以最小化觀測值與預測值之間的平方誤差（MSE）。",
  },
  {
    id: "02",
    name: "邏輯回歸 (Logistic Regression)",
    type: "supervised",
    icon: "Activity",
    summary: "利用 Sigmoid 函數預測事件發生的機率",
    use_case: "垃圾郵件分類、疾病診斷",
    formula: "P(y=1|x) = \\frac{1}{1 + e^{-(wx+b)}}",
    details: "機率分類的基石。雖然名為回歸，但實質上是二分類器，透過函數將輸出限制在 0 到 1 之間。",
  },
  {
    id: "03",
    name: "決策樹 (Decision Tree)",
    type: "supervised",
    icon: "Network",
    summary: "規則導向的樹狀分支結構",
    use_case: "客戶流失預測、貸款審批",
    formula: "\\text{Gini} = 1 - \\sum (P_i)^2",
    details: "模擬人類決策思維。透過資訊增益或基尼不純度將資料不斷切割成樹狀結構。",
  },
  {
    id: "04",
    name: "隨機森林 (Random Forest)",
    type: "supervised",
    icon: "Trees",
    summary: "多棵決策樹並行投票的集成模型",
    use_case: "電子商務推薦、詐欺檢測",
    formula: "\\hat{y} = \\frac{1}{B} \\sum_{b=1}^{B} f_b(x)",
    details: "群體智慧的體現。採用 Bagging 技術建立多棵獨立決策樹並進行多數決，抗過擬合能力強。",
  },
  {
    id: "05",
    name: "支持向量機 (SVM)",
    type: "supervised",
    icon: "GitMerge",
    summary: "尋找最大化類別間距的最優超平面",
    use_case: "圖像分類、文本情感分析",
    formula: "\\max \\frac{2}{\\lVert w \\rVert}",
    details: "在高維空間尋找邊界。利用核函數技巧 (Kernel Trick) 將低維不可分數據映射到高維空間進行線性分割。",
  },
  {
    id: "06",
    name: "單純貝氏 (Naive Bayes)",
    type: "supervised",
    icon: "Calculator",
    summary: "基於條件機率與特徵獨立假設的快速分類器",
    use_case: "即時新聞分類、語義過濾",
    formula: "P(C|X) = \\frac{P(X|C)P(C)}{P(X)}",
    details: "極速且經典的文本分類。假設所有特徵在類別給定的情況下彼此獨立，計算後驗機率進行預測。",
  },
  {
    id: "07",
    name: "K-近鄰演算法 (KNN)",
    type: "supervised",
    icon: "Users",
    summary: "計算鄰近樣本距離進行分類或回歸",
    use_case: "相似圖像搜尋、簡易推薦",
    formula: "d(x, y) = \\sqrt{\\sum_{i=1}^{n} (x_i - y_i)^2}",
    details: "物以類聚的延遲學習。當新資料進來時，看離它最近的 K 個鄰居大多屬於哪一類，新資料就歸為那一類。",
  },
  {
    id: "08",
    name: "梯度提升演算法 (Gradient Boosting)",
    type: "supervised",
    icon: "Zap",
    summary: "序列化建立弱模型，針對殘差進行優化",
    use_case: "CTR 點擊預測、競賽表格數據預測",
    formula: "F_m(x) = F_{m-1}(x) + \\gamma_m h_m(x)",
    details: "追求極致準確度的王者。與隨機森林不同，它是循序漸進每建立一棵新樹去修正前一棵樹的殘差錯誤。",
  },
  {
    id: "09",
    name: "K-Means 分群演算法",
    type: "unsupervised",
    icon: "Shapes",
    summary: "自動將無標籤數據劃分為 K 個聚類",
    use_case: "市場客戶區隔、圖像顏色量化",
    formula: "\\arg \\min \\sum_{j=1}^{k} \\sum_{x_i \\in S_j} \\lVert x_i - \\mu_j \\rVert^2",
    details: "經典非監督學習。隨機指定中心點，計算各點與中心的距離並歸類，接著重複更新中心點位置直至收斂。",
  },
  {
    id: "10",
    name: "主成分分析 (PCA)",
    type: "unsupervised",
    icon: "Minimize2",
    summary: "在保留最大訊息量的前提下減少特徵維度",
    use_case: "高維數據視覺化、數據預處理去噪",
    formula: "\\text{Cov}(X) = Q\\Lambda Q^T",
    details: "特徵降維演算法。將原本高維度的資料投影到新坐標軸（主成分）上，用最少的新特徵保留原資料最大的變異量。",
  },
];

export function getAlgorithmById(id: string): Algorithm | undefined {
  return algorithms.find((a) => a.id === id);
}
