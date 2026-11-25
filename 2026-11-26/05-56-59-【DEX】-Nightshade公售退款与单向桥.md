# Nightshade 上线不等于 SHADE 公售完成，也不等于 NIGHT 可退出

主类型：DEX  
标签：Midnight、Nightshade、Cardano、SHADE、跨链  
报告发送时间：2026-11-26 05:56:59（北京时间）  
观察：2026-11-26 约 05:57（北京时间）；主网与公售日期见正文

## 上线与募资是两件事

[主网公告](https://forum.midnight.network/t/nightshade-dex-is-live-on-midnight-mainnet-an-order-book-you-trade-from-the-browser/1384)日期为 11 月 11 日；[Midnight 11 月 25 日更新](https://midnight.network/blog/state-of-the-network-november-2026)再次列出 Nightshade。现有 Public Book 不等于未来的私密订单簿。平台有公开市场，并不证明同名代币已通过这次公售分配。

[公售记录](https://docs.nightshade.finance/tokens/sale/)称，11 月 16 日 20:00 UTC 收盘时收到 25,109 NIGHT，不足最低 1,190,476 NIGHT 的 2.11%，公售取消，买家未获配 SHADE。0.285714 NIGHT/SHADE 是原报价，不是二级市场成交。[项目安全说明](https://docs.nightshade.finance/reference/security/)区分了托管合约的退款和上限规则、结算工具的最低募集门槛，以及管理员的取消和退款权限。正常规则是把 NIGHT 和随押款存入的 ADA 退给原 Cardano 付款地址，交易费用不等于押款。若某笔在截止后 30 天仍未结算，任何人可触发退给原付款人，折算为 12 月 17 日 04:00 北京时间；不代表已退到任何具体账户。本次未核验退款交易或完成比例。

## 公开报价、排队成交与出链也要分开

[排队规则](https://docs.nightshade.finance/trade/queue/)中，排队兑换先把付款资产留在合约里，报价成为限价而不是成交回执；批次可以只成交部分，未成交余额可取消，等待时间不保证。[费率](https://docs.nightshade.finance/reference/fees-and-limits/)列公开簿 taker 0.2%、maker 0%，穿价限单的成交部分按 taker 计，DUST 另算。额度、对手深度及实际清算等待不能从费率表推断。

[桥接说明](https://docs.nightshade.finance/wallet/bridge/)列出的 NIGHT 方向是 Cardano→Midnight，社区报告约 12–24 小时，并非承诺；反向暂未上线。USDM 可经 VIA 双向桥接，文档举例约 50 分钟仅指 Cardano→Midnight；反向依赖 VIA 工具与确认，DUST 和 ADA 费用分别计。[公开首发币对](https://docs.nightshade.finance/trade/markets/)列 SHADE/USDM 和 MOTH/SHADE，不含 NIGHT/USDM；不能把一般的 USDM 出链路径当作已经验证的 NIGHT 退出路线。没有同一时点的可成交价、实际桥出时间或最终外部卖出成交证据。
