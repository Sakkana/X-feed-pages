---
type: 套利
signal_strength: weak
---

# STORJ 和 TOWNS 永续下架：结算时间差，不能当成锁定价差

报告发送时间：2026-11-26 11:06:19（北京时间）

**类型：套利｜标签：永续、交割、订单簿｜收益信号：弱**  
观察：2026-11-26 约 03:06 UTC。

**STORJ：两条腿相差 21 小时。** [LBank](https://www.lbank.com/fil/support/articles/2125520154568695808)公告 11 月 26 日 12:00 UTC 下架并自动结算，未披露结算价算法；[Bybit](https://announcements.bybit.com/en/article/delisting-of-storjusdt-perpetual-contract--art8f76cda93234/)则在 11 月 27 日 09:00 UTC 下架，以此前 30 分钟的平均指数价结算。等量反向合约若各自等结算，第一腿关闭后，第二腿仍有 21 小时方向敞口。若在第一腿关闭时同步平掉第二腿，能否收敛要看当时盘口，而非明天的结算价。未取得两所同时可成交报价；本次 Binance 的 STORJ 现货和永续深度查询也未返回可用盘口，不能当备用对冲。

**TOWNS：同场对冲也有入场折价。** [Bybit 的 TOWNS](https://announcements.bybit.com/en/article/delisting-of-townsusdt-perpetual-contract--art2afa530da818/)同样明日 09:00 UTC 按前 30 分钟平均指数自动平仓。11 月 26 日 03:05:47.905–48.696 UTC 查询 Binance [现货深度](https://api.binance.com/api/v3/depth?symbol=TOWNSUSDT&limit=20)和[永续深度](https://fapi.binance.com/fapi/v1/depth?symbol=TOWNSUSDT&limit=20)，两边最优买/卖均为 0.000907／0.000909。用相同币量模拟买现货、卖永续，按参考名义 100／1,000／10,000 USDT，永续卖出名义相对现货成本少约 **0.23／4.42／136.96 USDT**。永续卖出名义不是当场可得现金；差额仅反映入场盘口，未计未来平仓、资金费、交易费和保证金。

已有对冲仓位要单独核对两腿停牌时间；新建仓则还缺同刻 Bybit 深度、可执行退场路线、结算差和完整成本。跨所指数、资金费、保证金及薄盘口都可能吞掉表面价差，净收益无法确认。
