---
title: "Apple 与 SpaceX 股票金库：收益增量与美元退出是两道账"
type: DeFi
tags: [Armitage, Superform, Base, 股票代币, TradFi]
signal_strength: weak
---

# Apple 与 SpaceX 股票金库：收益增量与美元退出是两道账

报告发送时间：2026-11-26 02:05:20（北京时间）。**收益证据：弱。** 观察窗口 2026-11-25 17:30–18:05 UTC。

[Armitage 11 月 25 日更新](https://armitage.wintermute.com/updates)单独确认在 Base 为 Apple、SpaceX SuperVault 提供策略管理，两只接受存款，不再只是一张迁移日程。[策略条款](https://armitage.wintermute.com/docs/vaults/stock-supervaults)列出标的为 AAPLc、SPCXc，均收 **20% 绩效费、0% 管理费**。这不是扣本金 20%，也不能在不知道显示收益口径时，再机械扣一次绩效费。

## 收益来源与成本门槛

策略设计并不是把股票涨幅变成利息。资产仍承受股价变动；在实际执行借贷时，金库可用股票代币作抵押借 USDC，再投放给更高利率的借贷市场，增量来自 USDC 两端的利差，按实际债务规模计。利差翻负、闲置资金或借贷容量不足时，显示收益不一定兑现；借贷清算、合约及发行方风险增加。Armitage 的上线和存款确认不等于已证明每只金库的具体债务规模、投放与净利息。

[Apple 产品](https://app.superform.xyz/vault/8453_0x301a1ceb684d62833101b373ab6c395349b24033)与 [SpaceX 产品](https://app.superform.xyz/vault/8453_0x02b12a394f0a98b80e53d85f6831041932f1b621)的可见读数分别是 3.76% 与 1.40% APY，无行情时间戳、构成或费后标识。同期可访问的 [Superform 首页](https://www.superform.xyz)另展示 Apple 15.98%，并说明首页包含促销奖励；两处无可比时标，不能把差值认成可领取奖励。按观察读数恒定、股票价格不动，用复利公式 `本金×((1+APY)^(30/365)−1)`，每 1,000U 等值约 **3.04U / 1.14U**，是粗略成本上限，不是预期收益保证。若新换入再退出总摩擦为 0.50%，千 U 是 5U，单靠上述显示水平两者约需 49 天和 131 天才能覆盖。这个成本是假设，不是报价。已有代币者可只算金库相对直接持币增加的存取、等待和风险；从 USDC 买入者还承担进出点差和整段股票价格风险，没有被这些利息对冲。

## 退出与奖励不能混算

[Superform 技术文档](https://docs.superform.xyz/llms.txt)说明 Base 金库采用异步赎回，需请求、待执行方处理后再领取；待处理时，未可领取部分不能立即退出。金库份额的退出请求和领取不等于把 AAPLc 或 SPCXc 按净值兑成美元。拿回股票代币后仍须找到可用的二级出口；[Coinbase Tokenize](https://www.coinbase.com/tokenize)的一级通道面向合资格参与方，不能假定所有持有人都能按 NAV 退出。未核实从请求到领取的时长、当前可退出规模及对应的两向 USDC 报价，也不能按显示存款额外推这些深度。

[Merkl 的同组活动](https://app-merkl.angle.money/opportunities/15450515078741636868)出现两只份额名称，但未核实各自活跃活动权重、每只可领取的实际分发率，或已包含在平台显示 APY 的程度；不把组池 APR 与产品 APY 相加。在都拿不到执行成本、净息和退出数据时，无法估算可兑现净收益。
