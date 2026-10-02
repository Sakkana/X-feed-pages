---
type: 套利
signal_strength: medium
report_sent_at: "2026-10-03T04:08:04+08:00"
observed_at: "2026-10-03T03:51:00+08:00"
observed_until: "2026-10-03T04:04:00+08:00"
---
## Pendle USDai限价奖励：中，值得继续核验
**观察：北京时间10月3日03:51—04:04**

这次直接从[Pendle官方奖励页](https://app.pendle.finance/limit-order)找到一条有条件正收益的路径：在指定收益率区间挂买入PT的限价单，合格的未成交驻留时间获得PENDLE奖励

### 1000U情景
按本金已在Arbitrum计算：980 USDT0换到约979.313 USDai，20U留作费用余量。设置11.2%隐含收益率、3天有效期，官方本单预览约 **0.05 PENDLE/小时**

若连续3天符合奖励条件、未成交，且奖励率和出售价格维持：
- 预计累计约3.6 PENDLE
- 本金换回约979.659 USDT0，奖励出售报价约7.875 USDT
- **合计净额约7.53U，再扣额外成本G**
- 如果G为2—5U，条件净收益约 **2.53—5.53U**；G尚未实测，这不是确定收益区间

### 必须满足的条件
1. 持续处于激励区间，本次显示10.54%—11.32%；竞争增加会稀释奖励
2. 满足最低合格驻留时间，该市场具体参数还未取得；0.05也是两位小数预估
3. 授权、撤单、Ethereum领奖、奖励批准及跨链归集等额外成本，3天合计须低于约7.53U。资金若尚未在Arbitrum，转入成本也要计入
4. 奖励统一在Ethereum领取，按本次周期预计约10月10日才能兑现，不能把3天持有写成3天到账

### 主要亏损情景
若很快成交，驻留奖励停止。按本次PT卖出预览及后续换回报价，可能先亏约 **0.33—2.33U，再扣额外费用**。若只拿到原计划三分之一的奖励，额外成本2U就已接近亏损

**评为中：本单奖励和奖励币退出报价已有依据，但真实额外成本、最低驻留参数及持续获奖条件未闭合。先补这些，再判断是否值得投入**

[对应市场](https://app.pendle.finance/trade/markets/0xa8a0dea40174cfc30fea9e3a77f182ab33f46e25/limit-order/buy?chain=arbitrum&view=pt&tab=info) · [奖励机制](https://docs.pendle.finance/pendle-v2/ProtocolMechanics/Mechanisms/Incentives) · [USD.AI最新铸造赎回规则](https://usd.ai/insights/usdai-mint-redeem-upgrade)

以上为独立采样的情景测算，报价现已过期；PENDLE价格下跌、出区间或提前成交都会改变结果
