---
title: "Stellar 两个 USDC 金库：补贴到期不同，赎回也不是倒计时"
type: "激励"
tags: ["Stellar", "Upshift", "Merkl", "USDC", "金库赎回"]
signal_strength: weak
observed_at_utc: "2026-11-20T08:05:00Z"
sent_at_beijing: "2026-11-20T16:04:58+08:00"
---

# Stellar 两个 USDC 金库：补贴到期不同，赎回也不是倒计时

原报告发送时间：2026-11-20 16:04:58（北京时间）。

[Gami Merkl](https://app.merkl.fr/opportunities/12848640496271100237)显示每天 3,673 USDC、奖励 APR 6.04%、协议 APR 3.96%、合格活动 TVL 约 2,219 万美元，剩约 28 天。[Gami 金库页](https://app.upshift.finance/vaults/stellar/gami-earnusdc)另显示 30 天口径总 APY 10%、绩效费 10%、赎回 2 日。该金库至少可追溯到 [2026 年 6 月 2 日公告](https://www.upshift.finance/blog/upshift-on-stellar-earnusdc-earnxlm)，不是新上线。

[Sentora Merkl](https://app.merkl.fr/opportunities/4371175873812070012)显示奖励 APR 8%、每天 10,988 USDC、剩约 6 天；[Sentora 金库页](https://app.upshift.finance/vaults/stellar/sentora-usdc)显示 7 天口径总 APY 7.56%、绩效费 0%、赎回 24 小时。奖励 APR 与不同窗口的总 APY 不相加，活动 TVL 不是产品净资产，剩余天数是取整而非精确结算时间。绩效费是否以及如何计入补贴未核实，不能从本金直接扣 10%；积分按零计。

假设 1,000 原生 Stellar USDC 全程合格、APR 不变，按日简单折算：Gami 28 天约 4.63 USDC、6 天约 0.99 USDC；Sentora 6 天约 1.32 USDC。两者六天的未舍入差额仅约 **0.32 USDC**，未计基础收益、gas、换币、桥接、领取及等待。若 Gami 合格 TVL 翻倍而日分发不变，同规模持仓的费前奖励约减半。已有原生 Stellar USDC 与专门跨链或用 USDT 换入的成本需分开计。

[Upshift Stellar 架构](https://docs.upshift.finance/vault-architecture/stellar)及[赎回说明](https://docs.upshift.finance/sdk/stellar-actions)显示，链上没有赎回队列；金库合约本身的底层资产余额充足才可即时赎回，否则要等策略回款。24 小时或 2 日不是合约到账保证。Gami 产品页 11 月 20 日 07:52:22（未标时区）显示净资产约 3,219 万美元，其中 USDC 995 万、USPC 821 万、deJTRSY 750 万；持仓分类不是可赎额度。Sentora 页约 5,013 万美元已部署、闲置额为 0，也不能替代链上可用余额。

**收益信号：弱**，观察约 2026 年 11 月 20 日 08:05 UTC。未取得同区块入金、可赎回额度、赎回净额和完整跨链成本；若余额不足或活动提前结束，满额兑现假设失效，不能认定套利。
