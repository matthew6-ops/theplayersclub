export function detectArbitrageWithStakes(best: Record<string, number>) {
  const teams = Object.keys(best);
  if (teams.length !== 2) return null;

  const [t1, t2] = teams;
  const o1 = best[t1];
  const o2 = best[t2];

  const imp1 = 1 / o1;
  const imp2 = 1 / o2;

  const sumImp = imp1 + imp2;

  if (sumImp >= 1) return { exists: false };

  const profitPercent = (1 - sumImp) * 100;

  function stake(total: number) {
    const s1 = (total * imp1) / sumImp;
    const s2 = (total * imp2) / sumImp;
    return {
      stake1: s1,
      stake2: s2,
      guaranteedProfit: total - (s1 + s2)
    };
  }

  return {
    exists: true,
    profitPercent,
    stakeCalc: stake,
    teams: [t1, t2]
  };
}
