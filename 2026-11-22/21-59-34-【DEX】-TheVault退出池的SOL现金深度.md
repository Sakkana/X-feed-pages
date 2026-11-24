---
title: "The Vault：退出池 TVL 与可兑 SOL"
type: "DEX"
tags: ["DEX", "Solana", "LST", "流动性"]
observation_time_beijing: "2026-11-22 21:59 UTC+08:00"
---

# The Vault：约 31 万美元 TVL，不等于有 31 万美元能即时兑出

原报告发送：2026-11-22 21:59:34 北京时间；历史 PR 测试为 2026-11-20。

2026 年 11 月 22 日观察到 [DefiLlama 合并统计修正](https://github.com/DefiLlama/DefiLlama-Adapters/pull/22333)：除了 liquid SOL，也计入快退池持有的、来自受支持质押池程序的 LST。旧统计只看 SOL；修正未回填历史。合并时间与测试取数时间不同。

## 11 月 20 日测试快照与实际资产流

| 测试组成 | 美元显示值 |
| --- | ---: |
| SOL | 70,510 |
| JUPSOL | 113,680 |
| BBSOL | 95,780 |
| vSOL | 16,640 |
| BNSOL | 14,600 |
| 总量（采用 PR 汇总） | 311,540 |

SOL 占约 22.6%，总量约为现金腿的 4.42 倍。小项与总量略有差异，使用 PR 的舍入值。修正记录引用[该笔历史交易](https://solscan.io/tx/QEHaBqvLGszYHwU82bqxUSDptGpVbrHAHyBbGyS5kWCH8XF3wHrs2GQg5m91HFFZ4y5pY9aQcvjVdAB3KGgyAjv)：池付出 1,142.38 SOL，收到 936.85 JUPSOL。约 1.21939 SOL/JUPSOL 是池腿资产流比率，不是整笔聚合换汇的用户净价或当前报价。修正计回了收到的资产，但不增加可立即支付的 SOL。

## 三个退出尺度不能混用

- **快退池**：[协议规则](https://docs.thevault.finance/products/unstake-pool)列出动态费 0.027% 至 1%。500 SOL 是收费曲线拐点，低于该点费率线性上升，另有对应 LST 的赎回费，常见约 0.1%。这不是保证能兑 500 SOL 的门槛。
- **聚合换出**：[vSOL 快退 API](https://docs.thevault.finance/power-users/direct-stake-api)说池子现金不足时回退至 Jupiter；同一界面返回的可用报价未必由同一池充当对手。
- **延迟赎回**：[vSOL 文档](https://docs.thevault.finance/stake/delayed-lst-unstaking-in-phantom-wallet)写明按池比例扣 0.1%，收到待解质押的 stake account；要等 epoch，在网络退质押限额下可能再等。不是当前可立即支用的 SOL。

11 月 22 日未取得当前池中 SOL、指定数量的同刻静态报价及其路由，不以数据修正或历史样本推断当前交易成本。
