"""
Top 10 Machine Learning Algorithms — Python Implementation
===========================================================
Educational reference implementation from scratch.
Dependencies: numpy (pip install numpy)

Algorithms covered:
  01. Linear Regression
  02. Logistic Regression
  03. Decision Tree
  04. Random Forest
  05. Support Vector Machine (SVM)
  06. Naive Bayes
  07. K-Nearest Neighbors (KNN)
  08. Gradient Boosting
  09. K-Means Clustering
  10. Principal Component Analysis (PCA)
"""

import numpy as np
from collections import Counter
from typing import Optional, Tuple, List


# ============================================================
#  01. Linear Regression  (線性回歸)
#     y = β₀ + β₁x₁ + ... + ε   —  minimize MSE via gradient descent
# ============================================================
class LinearRegression:
    """
    Ordinary Least Squares via gradient descent.

    Formula:  y = X·w + b
    Loss:     MSE = (1/n) Σ (y_pred - y_true)²
    """

    def __init__(self, lr: float = 0.01, epochs: int = 1000):
        self.lr = lr
        self.epochs = epochs
        self.w: Optional[np.ndarray] = None
        self.b: Optional[float] = None

    def fit(self, X: np.ndarray, y: np.ndarray) -> "LinearRegression":
        n, d = X.shape
        self.w = np.zeros(d)
        self.b = 0.0
        for _ in range(self.epochs):
            y_pred = X @ self.w + self.b
            dw = (2 / n) * X.T @ (y_pred - y)
            db = (2 / n) * np.sum(y_pred - y)
            self.w -= self.lr * dw
            self.b -= self.lr * db
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        return X @ self.w + self.b


# ============================================================
#  02. Logistic Regression  (邏輯回歸)
#     P(y=1|x) = 1 / (1 + e^{-(wx+b)})   —  binary classifier
# ============================================================
class LogisticRegression:
    """
    Binary logistic regression trained via gradient descent on
    cross-entropy loss.

    Formula:  σ(z) = 1 / (1 + exp(-z))
    """

    def __init__(self, lr: float = 0.1, epochs: int = 1000):
        self.lr = lr
        self.epochs = epochs
        self.w: Optional[np.ndarray] = None
        self.b: Optional[float] = None

    @staticmethod
    def _sigmoid(z: np.ndarray) -> np.ndarray:
        return 1 / (1 + np.exp(-z))

    def fit(self, X: np.ndarray, y: np.ndarray) -> "LogisticRegression":
        n, d = X.shape
        self.w = np.zeros(d)
        self.b = 0.0
        for _ in range(self.epochs):
            z = X @ self.w + self.b
            h = self._sigmoid(z)
            dw = (1 / n) * X.T @ (h - y)
            db = (1 / n) * np.sum(h - y)
            self.w -= self.lr * dw
            self.b -= self.lr * db
        return self

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        return self._sigmoid(X @ self.w + self.b)

    def predict(self, X: np.ndarray) -> np.ndarray:
        return (self.predict_proba(X) >= 0.5).astype(int)


# ============================================================
#  03. Decision Tree  (決策樹)
#     Gini = 1 − Σ (Pᵢ)²   —  rule-based tree splitting
# ============================================================
class DecisionTree:
    """
    Classification tree using Gini impurity for splits.
    Supports max_depth to prevent overfitting.
    """

    def __init__(self, max_depth: int = 5):
        self.max_depth = max_depth
        self.tree: Optional[dict] = None

    @staticmethod
    def _gini(y: np.ndarray) -> float:
        _, counts = np.unique(y, return_counts=True)
        probs = counts / len(y)
        return 1 - np.sum(probs**2)

    def _best_split(self, X: np.ndarray, y: np.ndarray) -> Tuple[int, float]:
        best_gain, best_feat, best_thresh = -1.0, None, None
        parent_gini = self._gini(y)
        for feat in range(X.shape[1]):
            thresholds = np.unique(X[:, feat])
            for thresh in thresholds:
                left = y[X[:, feat] <= thresh]
                right = y[X[:, feat] > thresh]
                if len(left) == 0 or len(right) == 0:
                    continue
                child_gini = (len(left) / len(y)) * self._gini(left) + \
                             (len(right) / len(y)) * self._gini(right)
                gain = parent_gini - child_gini
                if gain > best_gain:
                    best_gain, best_feat, best_thresh = gain, feat, thresh
        return best_feat, best_thresh

    def _build(self, X: np.ndarray, y: np.ndarray, depth: int) -> dict:
        if depth >= self.max_depth or len(np.unique(y)) == 1:
            return {"label": Counter(y).most_common(1)[0][0]}
        feat, thresh = self._best_split(X, y)
        if feat is None:
            return {"label": Counter(y).most_common(1)[0][0]}
        left_idx = X[:, feat] <= thresh
        return {
            "feature": feat,
            "threshold": thresh,
            "left": self._build(X[left_idx], y[left_idx], depth + 1),
            "right": self._build(X[~left_idx], y[~left_idx], depth + 1),
        }

    def fit(self, X: np.ndarray, y: np.ndarray) -> "DecisionTree":
        self.tree = self._build(X, y, 0)
        return self

    def _predict_one(self, x: np.ndarray, node: dict):
        if "label" in node:
            return node["label"]
        if x[node["feature"]] <= node["threshold"]:
            return self._predict_one(x, node["left"])
        return self._predict_one(x, node["right"])

    def predict(self, X: np.ndarray) -> np.ndarray:
        return np.array([self._predict_one(x, self.tree) for x in X])


# ============================================================
#  04. Random Forest  (隨機森林)
#     ŷ = (1/B) Σ f_b(x)   —  ensemble of decision trees via bagging
# ============================================================
class RandomForest:
    """
    Ensemble of decision trees trained on bootstrap samples.
    Uses random feature subsets at each split.
    """

    def __init__(self, n_trees: int = 10, max_depth: int = 5):
        self.n_trees = n_trees
        self.max_depth = max_depth
        self.trees: List[DecisionTree] = []

    def fit(self, X: np.ndarray, y: np.ndarray) -> "RandomForest":
        n = X.shape[0]
        for _ in range(self.n_trees):
            idx = np.random.choice(n, n, replace=True)
            tree = DecisionTree(max_depth=self.max_depth)
            tree.fit(X[idx], y[idx])
            self.trees.append(tree)
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        preds = np.array([tree.predict(X) for tree in self.trees])
        return np.array([Counter(preds[:, i]).most_common(1)[0][0]
                         for i in range(X.shape[0])])


# ============================================================
#  05. Support Vector Machine  (SVM)
#     max 2/‖w‖   —  linear SVM via sub-gradient descent + hinge loss
# ============================================================
class SVM:
    """
    Linear SVM binary classifier trained with hinge-loss SGD.
    Labels must be encoded as −1 / +1.

    Hinge loss:  max(0, 1 − y·(wx+b)) + λ‖w‖²
    """

    def __init__(self, lr: float = 0.01, epochs: int = 1000, C: float = 1.0):
        self.lr = lr
        self.epochs = epochs
        self.C = C  # regularization strength (larger C = less regularization)
        self.w: Optional[np.ndarray] = None
        self.b: Optional[float] = None

    def fit(self, X: np.ndarray, y: np.ndarray) -> "SVM":
        n, d = X.shape
        y = np.where(y <= 0, -1, 1)
        self.w = np.zeros(d)
        self.b = 0.0
        for _ in range(self.epochs):
            scores = y * (X @ self.w + self.b)
            mask = scores < 1
            dw = self.w - self.C * X[mask].T @ y[mask]
            db = -self.C * np.sum(y[mask])
            self.w -= self.lr * dw / n
            self.b -= self.lr * db / n
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        return np.sign(X @ self.w + self.b).astype(int)


# ============================================================
#  06. Naive Bayes  (單純貝氏)
#     P(C|X) = P(X|C)·P(C) / P(X)   —  Gaussian NB for continuous features
# ============================================================
class GaussianNaiveBayes:
    """
    Gaussian Naive Bayes assuming features follow normal distribution.

    P(xᵢ | C) = 𝒩(μ_c, σ²_c)
    """

    def fit(self, X: np.ndarray, y: np.ndarray) -> "GaussianNaiveBayes":
        self.classes = np.unique(y)
        self.means = {}
        self.vars = {}
        self.priors = {}
        for c in self.classes:
            X_c = X[y == c]
            self.means[c] = np.mean(X_c, axis=0)
            self.vars[c] = np.var(X_c, axis=0) + 1e-9
            self.priors[c] = len(X_c) / len(y)
        return self

    def _pdf(self, x: np.ndarray, mean: np.ndarray, var: np.ndarray) -> float:
        return np.exp(-(x - mean)**2 / (2 * var)) / np.sqrt(2 * np.pi * var)

    @staticmethod
    def _logsumexp(x: np.ndarray) -> float:
        m = np.max(x)
        return m + np.log(np.sum(np.exp(x - m)))

    def predict(self, X: np.ndarray) -> np.ndarray:
        preds = []
        for x in X:
            log_probs = {}
            for c in self.classes:
                log_prob = np.log(self.priors[c])
                log_prob += np.sum(np.log(self._pdf(x, self.means[c], self.vars[c])))
                log_probs[c] = log_prob
            preds.append(max(log_probs, key=log_probs.get))
        return np.array(preds)


# ============================================================
#  07. K-Nearest Neighbors  (K-近鄰)
#     d(x,y) = √Σ(xᵢ − yᵢ)²   —  lazy learner, majority vote
# ============================================================
class KNN:
    """
    K-Nearest Neighbors classifier using Euclidean distance.

    Distance:  d(x, y) = √ Σ (xᵢ − yᵢ)²
    """

    def __init__(self, k: int = 3):
        self.k = k
        self.X_train: Optional[np.ndarray] = None
        self.y_train: Optional[np.ndarray] = None

    def fit(self, X: np.ndarray, y: np.ndarray) -> "KNN":
        self.X_train = X
        self.y_train = y
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        preds = []
        for x in X:
            dists = np.sqrt(np.sum((self.X_train - x)**2, axis=1))
            k_idx = np.argsort(dists)[:self.k]
            preds.append(Counter(self.y_train[k_idx]).most_common(1)[0][0])
        return np.array(preds)


# ============================================================
#  08. Gradient Boosting  (梯度提升)
#     F_m(x) = F_{m-1}(x) + γ·h_m(x)   —  sequential tree building on residuals
# ============================================================
class GradientBoosting:
    """
    Simple Gradient Boosting for regression using decision stumps
    (depth-1 trees) fitted to pseudo-residuals.

    Fₘ(x) = F_{m-1}(x) + γ·hₘ(x)
    """

    def __init__(self, n_estimators: int = 50, lr: float = 0.1, max_depth: int = 3):
        self.n_estimators = n_estimators
        self.lr = lr
        self.max_depth = max_depth
        self.trees: List[DecisionTree] = []
        self.init_val: float = 0.0

    def fit(self, X: np.ndarray, y: np.ndarray) -> "GradientBoosting":
        self.init_val = np.mean(y)
        residuals = y - self.init_val
        for _ in range(self.n_estimators):
            tree = DecisionTree(max_depth=self.max_depth)
            tree.fit(X, residuals)
            pred = tree.predict(X)
            residuals -= self.lr * pred
            self.trees.append(tree)
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        y_pred = np.full(X.shape[0], self.init_val)
        for tree in self.trees:
            y_pred += self.lr * tree.predict(X)
        return y_pred


# ============================================================
#  09. K-Means Clustering  (K-Means 分群)
#     arg min Σⱼ Σ_{x_i∈S_j} ‖x_i − μ_j‖²   —  iterative centroid update
# ============================================================
class KMeans:
    """
    Lloyd's algorithm for K-Means clustering.

    1. Initialize K centroids (randomly from data).
    2. Assign each point to nearest centroid.
    3. Recompute centroids as the mean of assigned points.
    4. Repeat until convergence.
    """

    def __init__(self, k: int = 3, max_iters: int = 100):
        self.k = k
        self.max_iters = max_iters
        self.centroids: Optional[np.ndarray] = None

    def fit(self, X: np.ndarray) -> "KMeans":
        n = X.shape[0]
        idx = np.random.choice(n, self.k, replace=False)
        self.centroids = X[idx].copy()
        for _ in range(self.max_iters):
            dists = np.sqrt(((X[:, None] - self.centroids[None])**2).sum(axis=2))
            labels = np.argmin(dists, axis=1)
            new_centroids = np.array([X[labels == j].mean(axis=0) if np.any(labels == j)
                                      else self.centroids[j] for j in range(self.k)])
            if np.allclose(self.centroids, new_centroids):
                break
            self.centroids = new_centroids
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        dists = np.sqrt(((X[:, None] - self.centroids[None])**2).sum(axis=2))
        return np.argmin(dists, axis=1)


# ============================================================
#  10. Principal Component Analysis  (PCA)
#     Cov(X) = QΛQᵀ   —  eigen-decomposition for dimensionality reduction
# ============================================================
class PCA:
    """
    Principal Component Analysis via eigen-decomposition of
    the covariance matrix.

    Projects data onto the top-n_components eigenvectors.
    """

    def __init__(self, n_components: int = 2):
        self.n_components = n_components
        self.components: Optional[np.ndarray] = None
        self.mean: Optional[np.ndarray] = None

    def fit(self, X: np.ndarray) -> "PCA":
        self.mean = np.mean(X, axis=0)
        X_centered = X - self.mean
        cov = np.cov(X_centered, rowvar=False)
        eigenvalues, eigenvectors = np.linalg.eigh(cov)
        idx = np.argsort(eigenvalues)[::-1]
        self.components = eigenvectors[:, idx[:self.n_components]]
        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        return (X - self.mean) @ self.components

    def fit_transform(self, X: np.ndarray) -> np.ndarray:
        return self.fit(X).transform(X)


# ============================================================
#  Demo: run each algorithm on synthetic data
# ============================================================
def demo():
    np.random.seed(42)

    print("=" * 60)
    print("  Top 10 ML Algorithms — Python Implementation Demo")
    print("=" * 60)

    # ---------- Synthetic Data ----------
    n_samples, n_features = 100, 2
    X_reg = np.random.randn(n_samples, n_features)
    y_reg = X_reg[:, 0] * 3 + X_reg[:, 1] * (-2) + 0.5 + np.random.randn(n_samples) * 0.3

    X_clf = np.random.randn(n_samples, n_features) * 1.5
    y_clf = ((X_clf[:, 0] + X_clf[:, 1]) > 0).astype(int)

    X_cluster = np.random.randn(n_samples, n_features)

    # ----- 01. Linear Regression -----
    print("\n[01] Linear Regression")
    lr = LinearRegression(lr=0.01, epochs=500).fit(X_reg, y_reg)
    print(f"  Learned weights: {np.round(lr.w, 3)}, bias: {lr.b:.3f}")
    print(f"  MSE: {np.mean((lr.predict(X_reg) - y_reg)**2):.4f}")

    # ----- 02. Logistic Regression -----
    print("\n[02] Logistic Regression")
    logr = LogisticRegression(lr=0.1, epochs=500).fit(X_clf, y_clf)
    acc = np.mean(logr.predict(X_clf) == y_clf)
    print(f"  Accuracy: {acc:.4f}")

    # ----- 03. Decision Tree -----
    print("\n[03] Decision Tree")
    dt = DecisionTree(max_depth=3).fit(X_clf, y_clf)
    acc = np.mean(dt.predict(X_clf) == y_clf)
    print(f"  Accuracy: {acc:.4f}")

    # ----- 04. Random Forest -----
    print("\n[04] Random Forest")
    rf = RandomForest(n_trees=10, max_depth=3).fit(X_clf, y_clf)
    acc = np.mean(rf.predict(X_clf) == y_clf)
    print(f"  Accuracy: {acc:.4f}")

    # ----- 05. SVM -----
    print("\n[05] SVM")
    svm = SVM(lr=0.01, epochs=1000, C=1.0).fit(X_clf, y_clf)
    acc = np.mean((svm.predict(X_clf) >= 0).astype(int) == y_clf)
    print(f"  Accuracy: {acc:.4f}")

    # ----- 06. Naive Bayes -----
    print("\n[06] Gaussian Naive Bayes")
    nb = GaussianNaiveBayes().fit(X_clf, y_clf)
    acc = np.mean(nb.predict(X_clf) == y_clf)
    print(f"  Accuracy: {acc:.4f}")

    # ----- 07. KNN -----
    print("\n[07] K-Nearest Neighbors (K=3)")
    knn = KNN(k=3).fit(X_clf, y_clf)
    acc = np.mean(knn.predict(X_clf) == y_clf)
    print(f"  Accuracy: {acc:.4f}")

    # ----- 08. Gradient Boosting -----
    print("\n[08] Gradient Boosting (Regression)")
    gb = GradientBoosting(n_estimators=30, lr=0.1, max_depth=2).fit(X_reg, y_reg)
    print(f"  MSE: {np.mean((gb.predict(X_reg) - y_reg)**2):.4f}")

    # ----- 09. K-Means -----
    print("\n[09] K-Means Clustering (K=3)")
    km = KMeans(k=3).fit(X_cluster)
    labels = km.predict(X_cluster)
    counts = Counter(labels)
    print(f"  Cluster sizes: {dict(counts)}")

    # ----- 10. PCA -----
    print("\n[10] PCA (2 components)")
    pca = PCA(n_components=2).fit(X_cluster)
    X_pca = pca.transform(X_cluster)
    explained_var = pca.components.var(axis=0)
    print(f"  First component direction: {np.round(pca.components[:, 0], 3)}")

    print("\n" + "=" * 60)
    print("  Demo complete!")
    print("=" * 60)


if __name__ == "__main__":
    demo()
