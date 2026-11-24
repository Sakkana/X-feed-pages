# PT-reUSD：10.98 万份卖单的退出路径与兑付单位

- 主类型：DEX
- 标签：DEX、Pendle、PT、reUSD
- signal_strength: weak
- 原报告：2026-11-23 04:00:59（北京时间）
- 观察：2026-11-22 20:00 UTC；历史成交为 11 月 21 日 00:07 UTC。

11 月 21 日 00:07 UTC，以太坊区块 **26459789**：109,797.312699 份 PT 换回 97,883.165988 reUSD，另付 0.000066606475 ETH gas。链上回执显示，109,775.353236 份 PT 与等量 YT 配对赎回，只有 21.959463 份进入 AMM。历史大单证明当时有 YT 限价单配合，不证明池子或今天的订单仍能接同等规模。[逐笔回执](https://ethereum.atomicwallet.io/tx/0xabf5365f720b5c5e4dac88756f6f746e9cac51cbd50fa1c35f6c464cc2644af5)

**到期单位也容易看错。** [Pendle 市场说明](https://app.pendle.finance/trade/pools/0x13285bcbc27f92b47b4edb99d744c07b48c977c0/zap/in)写的是 12 月 10 日每份 PT 兑付按其记账值等于 **1 USDC 的 reUSD**，不是 1 枚 reUSD，也不是 USDC 现金。持有到期仍需把 reUSD 卖出，或走发行方赎回转成 sUSDe 再换出；后者有资格、储备和限额，费率曾链上核验为 6bp，不是该观察时点的报价。[发行方条款](https://storage.googleapis.com/re-files-production/docs/ppm_v2.pdf) · [链上参数核验](https://github.com/yearn/risk-score/blob/master/reports/report/re-reusd.md)

算一个成本上限：如果 1,000 份 PT 的买入总价是 995 USDC，即使届时记账值足额，后续变现损耗、gas 和等待成本合计也只能吃掉 **5 USDC（50bp）**。这不是实际报价。提前卖出则要重看当时的 YT 买卖单与池子深度。**收益信号：弱**（11 月 22 日 20:00 UTC）；未取得同步进出及最终 USDC 报价。
