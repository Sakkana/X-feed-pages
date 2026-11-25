---
title: "五只 bStocks 开盘实测：3.7 bp 的盘口，1,000 U 往返可能差 107 U"
type: "套利"
tags: ["TradFi","代币化股票","订单簿"]
signal_strength: weak
observed_at_utc: "2026-11-25T12:04:55Z"
sent_at_beijing: "2026-11-25T20:07:06+08:00"
---

# 五只 bStocks 开盘实测：3.7 bp 的盘口，1,000 U 往返可能差 107 U

原报告发送时间：2026-11-25 20:07:06（北京时间）。

**类型：套利｜标签：TradFi、代币化股票、订单簿**  
**信号：弱。** 观察时间：2026-11-25 20:04:55 和约 20:05:54（北京时间）。这是发售后实测，不是一次成交，也不是和美股做成了套利。

Binance 20:00 上线的五个现货对均已出现真实小额成交。例：ARTYB 20:05:04.988 成交 0.13 股等价，54.12 USDT；FRHCB 20:05:14.848 成交 0.198，172.09 USDT。[成交记录接口](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#recent-trades-list)

[公开聚合成交接口](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#compressedaggregate-trades-list)的首笔编号均为 0，时间均为 20:00:00.000：ARTYB 57.12 × 0.09，FRHCB 171.29 × 0.03，IBITB 33.76 × 0.15，IGVB 95.35 × 0.06，SOXXB 122.61 × 0.041。首笔太小，不能代表开盘公允价。首份深度更新编号依次 11495、5094、6180、5980、4704；次份依次 11813、5735、7222、7302、5299。

从 [Binance 100 档深度](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#order-book)按每次快照中间价换算固定数量，在同一本簿分别扫买卖两侧。以下为换回 USDT 的静态盘口摩擦，未计交易费：

| 标的 | 首次 250 U | 首次 1,000 U | 约一分钟后 1,000 U |
|:--|--:|--:|--:|
| ARTYB | 2.23 U | 88.75 U | 106.71 U |
| FRHCB | 6.04 U | 42.37 U | 26.31 U |
| IBITB | 2.33 U | 10.68 U | 10.41 U |
| IGVB | 8.01 U | 85.80 U | 77.41 U |
| SOXXB | 1.83 U | 8.59 U | 8.12 U |

ARTYB 两次最优买卖仍是 54.12 / 54.14，表面价差约 3.7 bp；但第二次 1,000 U 的卖出/买入均价是 53.20233 / 58.97848。这解释了为什么用盘口第一档筛选会严重低估退出成本。两次快照不等于这种摩擦会持续，也不证明 100 档之外的容量。

**跨市场这笔账还没闭合。** 标的美股尚未进入北京时间 22:30 的常规交易时段；未取得同一时点、两边同向可成交的原股报价，也未核验提现或转换路径已可用。[Binance 抵押品公告](https://www.binance.com/en/support/announcement/detail/bbad3eb0d13f4a90954a38797b9077de)明确这批代币可作抵押、但代币本身不可借入；对没有库存的人，不能把「卖代币溢价、买原股」视为已经具备空头腿。已经持有代币的库存调仓是另一件事，仍要看卖出深度、原股准入和换回成本。只有同股数、同一时点的双腿报价减去真实手续费、调资和退出成本仍为正，才有依据估算净收益。
