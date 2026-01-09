import { useState, useCallback } from "react";
import { Shuffle, RotateCcw, Sparkles } from "lucide-react";

export default function Lottery() {
  const [candidates, setCandidates] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = useCallback(() => {
    const names = candidates
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) {
      return;
    }

    setIsDrawing(true);
    setWinner(null);

    let count = 0;
    const maxCount = 15;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setWinner(names[randomIndex]);
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * names.length);
        setWinner(names[finalIndex]);
        setIsDrawing(false);
      }
    }, 100);
  }, [candidates]);

  const handleReset = useCallback(() => {
    setWinner(null);
  }, []);

  const handleClear = useCallback(() => {
    setCandidates("");
    setWinner(null);
  }, []);

  const candidateCount = candidates
    .split("\n")
    .filter((name) => name.trim().length > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex flex-col">
      <header className="py-6 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            抽選アプリ
          </h1>
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          候補者の中からランダムで1名を選びます
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pb-8 gap-6 max-w-lg mx-auto w-full">
        {winner && !isDrawing ? (
          <div className="w-full flex flex-col items-center gap-6">
            <div className="relative w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
              <div
                className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-pink-100 animate-bounce-in"
                data-testid="result-container"
              >
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider font-medium">
                  🎉 当選者 🎉
                </p>
                <p
                  className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 break-all"
                  data-testid="text-winner"
                >
                  {winner}
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={handleDraw}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                data-testid="button-draw-again"
              >
                <Shuffle className="w-5 h-5" />
                もう一度
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-4 px-6 rounded-xl font-medium text-lg border border-border hover:bg-muted transition-colors"
                data-testid="button-reset"
              >
                <RotateCcw className="w-5 h-5" />
                戻る
              </button>
            </div>
          </div>
        ) : (
          <>
            {isDrawing && (
              <div className="w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-pink-100">
                  <p className="text-sm text-muted-foreground mb-2">抽選中...</p>
                  <p
                    className="text-4xl md:text-5xl font-black text-primary"
                    data-testid="text-drawing"
                  >
                    {winner || "..."}
                  </p>
                </div>
              </div>
            )}

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="candidates"
                  className="text-sm font-medium text-foreground"
                >
                  候補者を入力（1行に1名）
                </label>
                <span className="text-xs text-muted-foreground">
                  {candidateCount}名
                </span>
              </div>
              <textarea
                id="candidates"
                value={candidates}
                onChange={(e) => setCandidates(e.target.value)}
                placeholder={"田中太郎\n山田花子\n佐藤一郎\n鈴木二郎"}
                className="w-full h-48 md:h-56 p-4 rounded-xl border border-input bg-white text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none text-base leading-relaxed shadow-sm"
                disabled={isDrawing}
                data-testid="input-candidates"
              />
            </div>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={handleDraw}
                disabled={candidateCount === 0 || isDrawing}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                data-testid="button-draw"
              >
                <Shuffle className="w-5 h-5" />
                抽選する
              </button>

              {candidateCount > 0 && (
                <button
                  onClick={handleClear}
                  disabled={isDrawing}
                  className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 px-6 rounded-xl font-medium border border-border hover:bg-muted transition-colors disabled:opacity-50"
                  data-testid="button-clear"
                >
                  <RotateCcw className="w-4 h-4" />
                  クリア
                </button>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p>シンプルな抽選アプリ</p>
      </footer>
    </div>
  );
}
