---
type: DeFi
tags: [Ondo, Tempo, USDY, OUSD, 稳定币]
signal_strength: weak
---

# Tempo USDY 的两层退出：链上即时，不等于美元即时

观察时间：2026-11-25 17:56:06（北京时间）；深度原始快照为 2026-11-24。收益信号：弱。未取得同区块两边报价、管理器可用 OUSD 余额及账户剩余额度，不能估净收益。

## 第一层：USDY 与 Tempo OUSD

[Ondo 11 月 23 日公告](https://x.com/Ondo/status/2124921523462877451)和[合作方说明](https://joinopenstandard.com/customers/ondo)确认，合格非美投资者可在 Tempo 用 OUSD 即时申购、赎回 USDY，仍受维护及其他停机影响。[Ondo 额度表](https://docs.ondo.finance/general-access-products/usdy/rate-limits)列订单最低 $1；24 小时申购全局／单用户上限为 $1,000 万／$500 万，赎回为 $500 万／$200 万。上限不是库存：[管理器集成规则](https://docs.ondo.finance/developer-guides/usdy-instant-manager-integration)另要求地址符合资格、资金可用。Ondo 该路线不收申赎费，不代表没有网络费。

## 第二层：OUSD 与实际要用的资产

已持 OUSD 且退出后仍要用 OUSD，可以省下换币腿，但本金进入 USDY 后仍面临发行人、合约、停机和库存风险。若从 USDT0 或 USDC.e 起步并最终换回原币，需要按当时两边订单簿分别计价，并加每笔网络费、滑点及可能的跨链和兑换费。银行美元是不同出口，只适用于能使用发行方合作渠道并完成合规核验的客户；[风险评估引用发行方条款](https://governance.aave.com/t/openusd-ousd-on-aave-tempo-assessments/26493/2)的处理时间是确认合规后两个营业日内，不是即时到账。

LlamaRisk 的 11 月 24 日历史单向测试：约 1 bp 影响对应 498,962 OUSD→USDT0、598,604 OUSD→USDC.e，两个方向是两条不同卖出路线，当时合计约 109.8 万 OUSD 的输入容量。更大尺寸下，两种不同币种的名义输出合计约 130 万，不能当统一美元余额；当时可用卖出深度均依靠一名做市商，OUSD→pathUSD 无买盘。做市商可以撤单，历史截图不是现在的可执行价。Aave 当时只是评估将 OUSD 作为借款资产，不是已可借的融资腿。

## 1,000 美元什么情况下过线

[Ondo 面板](https://app.ondo.finance/assets/usdy)列示的参考 3.7502% APY 若维持不变，复利口径折算约 $0.10／天，不是锁定收益或 Tempo 可成交报价。纯算术情景：以 OUSD = $1 起算，若退出拿回 1,000 USDT0，且它跟随风险报告里的历史 USDT 均价 $0.99891，回款约 $998.91；差额 $1.09 约相当于 10.8 天毛收益，退出至少要约 1,001.092 USDT0 才能在该价格假设下覆盖本金，未含费用。若最终需要跨链后的原生 USDC，也要单算 USDC.e 换出和桥接后的实际到账。计算阈值应以同期美元报价和最终币种为基准；卖出深度、资格、资金上限或期限任一失效，就不能用广告 APY 代替净收益。
