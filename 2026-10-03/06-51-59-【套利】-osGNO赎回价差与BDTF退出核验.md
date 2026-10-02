---
type: 套利
signal_strength: weak
report_sent_at: "2026-10-03T06:51:59+08:00"
observed_at: "2026-10-03T06:24:00+08:00"
observed_until: "2026-10-03T06:36:00+08:00"
---

osGNO 找到约12.89U的条件价差，但兑付时间和对冲缺口使它暂时只能评为「弱」

按1000U预算，已有Gnosis链USDT，980U买入、20U预留费用：980 USDT → 7.196546 osGNO → 按协议汇率约8.535430 GNO → 当时出售报价992.89 USDT。净结果约12.89U减额外成本，报价观察于北京时间10月3日06:36，现已过期

成立条件是：赎回能够配对到账，且等待期间GNO价格、兑换率和退出成本没有吃掉价差。当前赎回合约现金全部对应旧待领取款，新请求可靠到账时间未核实；Aave新借GNO额度为零，这条对冲路径不成立。GNO下跌约1.30%就会吃掉未扣成本的价差，若额外成本3U，约跌1%即可转亏。12小时只是检查点间隔，不是到账承诺

[官方原帖](https://x.com/stakewise_io/status/2092968594430718230) · [赎回规则](https://docs.stakewise.io/docs/ostoken/ostoken-redemptions) · [Aave额度](https://app.aave.com/reserve-overview/?underlyingAsset=0x9c58bacc331c9aa871afd802db6379a98e80cedb&marketName=proto_gnosis_v3)

另一个现金篮子BDTF也做了金额核验：已有Base USDC，980 USDC → 4,138.86 BDTF → 975.09 USDC，先亏4.91 USDC，尚未计gas及USDT转换，因此评为「弱」。观察于06:24–06:25，[买入预览](https://app.reserve.org/base/index-dtf/0xb8753941196692e322846cfee9c14c97ac81928a/issuance) · [赎回预览](https://app.reserve.org/base/index-dtf/0xb8753941196692e322846cfee9c14c97ac81928a/issuance/manual)
