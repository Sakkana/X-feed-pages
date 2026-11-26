---
title: "同为 PYUSD：三只金库的现金退出与强制撤资费用"
type: "DeFi"
tags: ["PYUSD", "Morpho", "Sentora", "金库"]
signal_strength: weak
observed_at_utc: "2026-11-20T01:06:00Z"
sent_at_beijing: "2026-11-20T09:06:36+08:00"
---

# 同为 PYUSD：三只金库的现金退出与强制撤资费用

原报告发送时间：2026-11-20 09:06:36（北京时间）  
观察时间：2026-11-20 09:06（北京时间，历史快照）  
主类型：DeFi  
标签：PYUSD、Morpho、Sentora、金库

[Sentora 在 Morpho 的公开列表](https://app.morpho.org/curator/sentora)显示下列快照，未取得同步区块：

| 金库 | 存款 / 流动性（百万 PYUSD） | 流动性／存款 | APY | 页面所示强制撤资费 |
|---|---:|---:|---:|---:|
| [Paypal USD Main](https://app.morpho.org/ethereum/vault/0xb576765fB15505433aF24FEe2c0325895C559FB2/paypal-usd-main) | 368.45 / 86.71 | 23.53% | 5.52% | 0.01% |
| [Sentora PRIME Main](https://app.morpho.org/ethereum/vault/0xC21b08C16458202593D4D9B26b9984Ee67b38BbD/sentora-prime-main) | 171.29 / 22.26 | 13.00% | 6.88% | 1% |
| [Sentora Huma PST Main](https://app.morpho.org/ethereum/vault/0x8381a156958711E230f325428B5eb4b6555C75D9/sentora-huma-pst-main) | 81.81 / 9.14 | 11.17% | 7.07% | 1% |

Huma 约 98% 配置集中于单一 PST 市场，LLTV 86%，页面显示增加限额有三日时间锁。列表流动性是组合指标，不是个人即时最高提款承诺。

[普通与强制撤资说明](https://docs.morpho.org/developers/earn/tutorials/force-deallocate/)：普通提款先用闲置资产和指定适配器；其他市场有现金时，才可能用强制撤资补足，适配器各自计费。若底层市场没有现金，[实物赎回](https://docs.morpho.org/developers/earn/tutorials/in-kind-redemption/)取回底层头寸，不等于即时拿回 PYUSD。

以 1,000 PYUSD 持有七天、当前有效 APY 不变为情景，三者分别约产生 1.03／1.28／1.31 PYUSD，未计执行及奖励变现成本。若其中 500 PYUSD 必须强制撤资，按 0.01% 和 1% 费率分别约付 0.05 与 5 PYUSD，未计 gas，且只对强制撤资金额计费。已有 PYUSD 可比较增量成本；新换入还要计入进出兑换、价差与脱锚风险。**收益信号：弱**（北京时间 11 月 20 日 09:06），未验证同区块退出或净收益。
