---
title: bfUSD 非对称计价与两段赎回
category: DeFi
tags: [BitFi, bfUSD, 金库份额, 赎回]
signal_strength: weak
---

# bfUSD 非对称计价与两段赎回

原始发送：2026-11-24 17:02:38（北京时间）。

观察及评级：2026-11-24 09:00–09:02 UTC。

**BitFi 的 bfUSD：份额的账面升值，并不等于此刻能赎回的金额。** 11 月 24 日 17:00 后复核。11 月 20 日 Kraken 上的是治理代币 BFI；这次查的是另一种资产 bfUSD 和它的两只金库，不是新上线。

- **存取按不同汇率。** 官方文档写明，金库每轮目标汇率上调时，入场份额按目标值计算，退出参考值则用 24 小时逐步上升的当前汇率；若目标汇率下调，则立即反映。以旧值 1.000、目标 1.010 为例，存 1,000 bfUSD 得 990.10 份。若第 12 小时用 1.005 估算退出，折回约 995.05 bfUSD，尚未计费。这只是份额定价示例，不是实际结算承诺。[份额定价](https://docs.bitfi.one/developer/epoch-and-ratio/bfusd-epoch-vesting)
- **退出有两道门槛。** hbfUSD/pbfUSD 要先排队取回 bfUSD；再赎回 USDT。第二段标准赎回按文档等 3 个 epoch 并手动领取，无协议费；即时赎回收 0.5%，且受额度限制。若已持有 1,000 bfUSD、按 1:1 的 USDT 估值且额度足够，即时赎回约 995 USDT，未扣 Gas。24 小时是正收益摊入周期，不等于每个赎回 epoch 必然正好一天。[取回 bfUSD](https://docs.bitfi.one/developer/using-contract/unstake-bfusd) · [赎回 USDT](https://docs.bitfi.one/developer/using-contract/redeem-bfusd)

**信号弱。** 若想买折价 bfUSD 再即时赎回，1,000 枚的实付需低于 995 USDT 再扣买入费和 Gas；未取得实际额度、同区块报价或赎回实收。Pulsar 的资本还先承担部分压力损失，不能把高目标收益当现金利差。[两池关系](https://docs.bitfi.one/bitfis-cedefi/defi/bfusd)

在文档示例所述按当前比率估算的前提下，未计费回收比例为 CurrentRatio / EndRatio。取回份额与换回 USDT 分开，不能把 bfUSD 即时额度当成份额也可即时退出。文档一处用当前插值比率解释退出，另一处提示领取金额关联 epoch 比率；未核实请求至领取之间究竟在哪一步锁值，需实际请求与领取事件逐笔对账。没有市场买入深度和实收证据，不能估算净收益；额外风险包括管理人推进 epoch、稳定币兑换价值和可用资产量。
