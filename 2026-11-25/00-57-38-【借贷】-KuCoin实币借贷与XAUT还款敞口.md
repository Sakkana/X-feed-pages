# KuCoin 实币借贷：XAUT 与 USDT 的还款敞口

- 主类型：借贷
- 标签：KuCoin、XAUT、实币融资、强平
- signal_strength: weak
- 原报告：2026-11-25 00:57:38（北京时间）
- 观察：2026-11-24 16:57 UTC

[KuCoin 11 月 23 日公告](https://www.kucoin.com/announcement/en-kucoin-crypto-loans-to-add-15-borrowable-assets)列出新增加的 BONK、CRV、WIF、JUP、SHIB、TRUMP、PENGU、PUMP、PEPE、WLD、GRAM、AAVE、HYPE、NEAR、XAUT。新增的是可借币种，不代表一定有额度、所有账户都可借，也不是新增固定期限收益。贷款按币种定限额，费率浮动。公告称合资格抵押资产可继续参加 Hold to Earn；如果本来就能赚同一笔奖励，不能重复计成策略现金流。

借 XAUT 后在现货卖出、到时买回还币，负债单位仍是 XAUT；借 USDT 买入 XAUT 则是相反方向的币价敞口。只有买回与卖出、融资和可能的对冲腿都核到时，才能评估净基差。以 1,000 USDT 等值债务、持有七天、币价固定为计算例：借款年化每多 1 个百分点，约多付 0.192 USDT；若现货往返总成本假设 20 bp，先耗 2 USDT。负债币上涨、借款费抬升、抵押折扣改变或发生清算时，以上近似不适用。

[KuCoin 条款](https://www.kucoin.com/support/48142946141615)按含利息总债务除以折扣后抵押价值算 LTV，未核实个人触发阈值或可借容量。费率和限额参数页未返回 XAUT 实值；KuCoin 现货与永续公开端未取得带时间戳的同步深度。Binance XAUTUSDT 永续约 16:57:28 UTC 买一 3,555.64、卖一 3,555.65，仅是另一个市场的盘口，不能用来对齐 KuCoin 别时点的展示价。净收益未知；不存在已验证的进出闭环。
