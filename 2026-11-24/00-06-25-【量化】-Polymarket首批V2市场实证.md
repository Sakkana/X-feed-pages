---
type: 量化
tags: [量化, Polymarket, 市场结构]
---
# Polymarket 首批 V2 市场实证

**原报告发送：** 2026-11-24 00:06:25 北京时间  
**历史快照：** 数据仅对应正文列出的观察时点。

**Polymarket V2：首批市场已出现新结算合约，不再只停留在迁移日程。** 11 月 23 日 16:06 UTC 核对，SOL 的 [13:30–13:35 UTC 市场](https://polymarket.com/event/sol-updown-5m-1795440600)已结束，页面显示约 187 美元成交额，Resolver 链接与官方代码库的 Polygon V2 OracleAggregator 地址一致。[14:20–14:25 UTC 市场](https://polymarket.com/event/sol-updown-5m-1795443600)也指向同一地址。

这验证了至少这些 SOL 场次已使用 V2 结算入口，不代表所有市场都已迁移。页面成交额不是盘口深度，结果显示也不等于已核验实际兑付。旧 CTF 与 V2 凭证仍应按各自市场识别，不能因抵押品同为 pUSD 就互换。[迁移文档](https://docs.polymarket.com/migrate/polymarket-v2/overview) · [官方合约目录](https://github.com/Polymarket/polymarket-v2-external)

比对场次页面 Resolver 与代码库 Polygon 主网 OracleAggregator proxy：`0x0a0a0a0a8b00c51b7d810501b03f230028c04a87`。13:30 UTC 前的 [13:25–13:30 场次](https://polymarket.com/event/sol-updown-5m-1795440300) 同样的页面观察中没有 Resolver 字段，但仅凭字段缺失不足以认定其合约版本。官方的分批日程不等于 BTC/ETH 或其余类别已经完成迁移。
