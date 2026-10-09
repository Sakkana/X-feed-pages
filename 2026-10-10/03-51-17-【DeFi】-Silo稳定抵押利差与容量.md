---
title: Silo稳定抵押利差与容量
type: DeFi
tags: [Silo, 稳定币, 借贷]
signal_strength: weak
report_sent_at: "2026-10-10T03:51:17.926202+08:00"
observed_at: "2026-10-10T03:43:24+08:00"
observed_until: "2026-10-10T03:45:33+08:00"
result: capacity_constrained_or_negative_incremental_carry
---

# Silo：稳定抵押的借款利差与容量约束

报告时间：2026-10-10 03:51:17 北京时间。以下市场数据观察于 03:43:24–03:45:33（2026-10-09 19:43:24–19:45:33 UTC），信号 weak，完整 USDT 净收益未知。

假设总预算 1000 USDT，其中 980 是购入后抵押资产的美元价值，20 USDT 留作费用缓冲，借款最多 500 USDC。980 不是收益型代币数量，也未证明 1000 USDT 可按这些假设完成进出；缓冲是否足够尚未核实。

## sUSDp：显示零借息，容量仅约 18 美元

[Silo V3 Avalanche sUSDp/USDC](https://app.silo.finance/markets/avalanche-0xcd0d510eec4792a944E8dbe5da54DDD6777f02Ca?mode=borrow)显示借 USDC APR 0%，即时 USDC 流动性约 $18，无法容纳 500 USDC。sUSDp 存款显示的 7.5% APY 全来自底层资产，借贷利息部分为 0%。

假设最多约 18 USDC 能借出，并投入同链 6.9% APR 的 USDC 基础利息基准，30 天乐观毛收益约 0.102372 USDC；借息上升 5 个百分点时约 0.028247 USDC，均未扣费用。输入 10 USDC 后界面仍显示 0%，同时有抵押不足警告，不能证明实际借款后利率或可成交额度。用尽小池流动性还会改变利用率。

该市场最大 LTV 90%、清算阈值 93%、清算费 3.5%，界面整体风险及预言机风险均为 High。反向以 USDC 抵押的最大 LTV 为 0%。

## savUSD：追加借款的收益率低于成本

[Silo V2 Avalanche savUSD/USDC #142](https://v2.silo.finance/markets/avalanche/savusd-usdc-142?action=borrow)显示：

- USDC 借款 APR 8.7%，输入 500 USDC 后仍显示 8.7%
- savUSD 底层 APY 7.6%，借贷利息部分 0%；1x Avant 积分未计现金价值
- USDC 存款 APR 6.9%，帮助文字说明已扣协议费用
- USDC 可用 27,688，利用率约 89%
- 最大 LTV 92%、清算阈值 95%、清算费 3.5%；反向 USDC 抵押最大 LTV 为 0%

若借入 500 USDC 再配置 savUSD，按利率不变、APY 等效增长与借款连续复利模型，30 天追加收益约 −0.568783 USDC；借款 APR 升至 13.7% 时约 −2.642582 USDC，尚未计购入、赎回、换汇及 gas。V2 精确链上计息方式未读取，连续复利仅为模型约定；即使用简单利息，8.7% 借息也高于 7.6% 年 APY。

6.9% USDC 存款基准同样低于 8.7% 借息。同一隔离仓位能否把借出的基础资产再存入尚未验证，不能把基准比较视为可执行路线。界面“Stable rate”不代表锁定利率；显示的 10% 协议费不能按本金再扣，也不能对已扣费的供应收益重复扣减。

980 抵押本金本来就能取得的底层收益，属于不借款的基线，不能再次算成新增套利收入。

## 清算、退出与费用缺口

以抵押估值 980、债务 500 计算，LTV 约 51.02%；savUSD 的条件健康因子约 1.862。这只是预言机估值算术，不保障抵押资产兑付、提现流动性或免受脱锚影响。

[供应说明](https://docs.silo.finance/docs/users/using-silo/supply/)与[借款说明](https://docs.silo.finance/docs/users/using-silo/borrow/)要求考虑可用流动性，并在全额释放抵押前偿清债务和利息。[利率机制](https://docs.silo.finance/docs/users/core-concepts/silo/interest-rates/)说明利率随利用率变化。

sUSDp、savUSD 是美元关联的收益资产，不能按面值视作 USDT。两端实际购入/赎回价格、发行方资格与队列、退出费用、批准及供借还款 gas、原生 gas 获取、跨链或提款成本、抵押物退出到 USDT 报价均缺失；V3 借入 USDC 与 V2 目的端的代币地址也未完成匹配。当前显示容量不保证未来可取，清算费、发行方损失或冻结、预言机偏差及价格冲击仍可能放大损失。

这两条分别受容量和负增量利差约束，没有建立全成本正收益。
