# KPK ETH Prime 退役：停止策略，不是关闭赎回

主类型：DeFi  
标签：Morpho v2、KPK、WETH、金库赎回  
报告发送：2026-11-26 23:56:49（北京时间）  
观察：2026-11-26 15:56 UTC，应用页面未标注状态区块。

[KPK 的 11 月 26 日变更记录](https://docs.kpk.io/changelog#eth-prime)确认 Ethereum 上的 ETH Prime 金库 `0xBb50A5341368751024ddf33385BA8cf61fE65FF9` 退役，并说明存户仍可提取。公告所链接的[原帖](https://x.com/kpk_io/status/2123828656703504742)于 11 月 20 日发布；这里的变化不是关闭提现，也不是旧版同名金库。

[Morpho v2 金库页面](https://app.morpho.org/ethereum/vault/0xBb50A5341368751024ddf33385BA8cf61fE65FF9/kpk-eth-prime)显示总资产 335.74 WETH，其中闲置且可用 335.65 WETH，按前端四舍五入值约 99.97%。最大一笔剩余策略仓位，是 rETH 抵押的 WETH 市场约 0.08 WETH；市场利用率 100%，即时流动性显示为 0。Morpho 的交易列表显示 11 月 25 日有一笔 17.306 WETH 赎回（[交易链接](https://etherscan.io/tx/0xa31ac170b64fa53ff4d2aaccebd1733a0d45fe6a508d2fe3c7344038cdf43287)）；该记录不是全部账户的提现上限或当前区块的保证。

**已有份额与新存款不是同一个判断。** 已有份额的退出是金库份额兑换 WETH，应按实际持有份额核对提现上限、当时闲置余额和主网 Gas。如果要 ETH 或稳定币，还需解包或兑换；稳定币退出另有手续费、滑点和 ETH 波动。新存款并不延续旧策略，页面即时净 APY 低于 0.01%，历史曲线不能替代退役后的预期收益。
