---
title: "stUSDS：2,500 万 USDS 拟提前拨款，折价买入仍缺兑付窗口"
type: DeFi
tags: [DeFi, stUSDS, Sky, Curve, 退出流动性]
summary: "Sky 提议提前向基金会拨付 2,500 万 USDS 偿债；Curve 实际成交有折价，持有人何时可按账面价退出仍未知。"
observation: "2026-11-26 07:52、08:50、10:05 UTC；历史成交、金库快照与治理核对分开"
signal_strength: weak
---

# stUSDS：2,500 万 USDS 拟提前拨款，折价买入仍缺兑付窗口

报告发送时间：2026-11-26 18:05:06（北京时间）

**弱信号（2026-11-26 10:05 UTC）：市场成交证明有折价，但未证实能按账面价、在确定时间和规模内退出。**

## 拨款、偿债、能提现，是三件事

[11 月 25 日 Sky 核心治理声明](https://forum.skyeco.com/t/declaration-of-out-of-schedule-executive-vote-sky-frontier-foundation-genesis-capital/28499)提议以临时执行投票提前拨付已预留的 2,500 万 USDS。拟由 Amatsu、Ozone 和 CCEA1 分别划出 600 万、400 万和 1,500 万 USDS 到 Sky Frontier Foundation 多签，目的是偿债。它不是新增资金预算，也不是[社区 4,000 万–5,000 万 USDS 买 SKY 后偿债提案](https://forum.skyeco.com/t/proposal-to-resolve-the-stusds-liquidity-crisis-immediately-40-50m-atomic-otc-debt-for-sky-buyback/28473)。截至评级，未核实这笔提前拨款的执行投票通过、实际偿还至 stUSDS 相关头寸的规模或持有人提现分配规则。论坛有人建议分时回购 stUSDS，另有人建议建立赎回队列；两者都只是讨论。即使 2,500 万全进入金库可提现金，按约 1.585 亿美元规模也仅约 15.8%，不能代表每个地址可按这一比例取回。

## 二级市场真实成交，以及不能从成交推出什么

[Spark 08:50:02 UTC 快照](https://data.spark.finance/savings/stusds)：TVL 约 1.585 亿美元，即时可提约 6,680 USDS（约 0.0042% TVL），显示 APY 50%。以两组大地址的四舍五入持仓金额推算，同一快照账面价值约 1.094 USDS/份；不是逐笔成交同区块的 `convertToAssets` 读取，也不是该份额的可兑现承诺。

[Curve 历史成交 API](https://prices.curve.finance/v1/trades/all/ethereum/0x2C7C98A3b1582D83c43987202aEFf638312478aE?include_state=true&per_page=10) 记录如下：

| 2026-11-26 UTC | 方向 | 实际数量 | 成交均价 |
| --- | --- | --- | --- |
| 07:52:23 | 卖出 | 2,017.47746 stUSDS → 2,043.40482 USDS | 1.01285 USDS/份 |
| 同一交易 | 卖出 | 588.77508 stUSDS → 594.92282 USDS | 1.01044 USDS/份 |
| 07:52:47 | 买入 | 2,711.829584 USDS → 2,664.217297 stUSDS | 1.01787 USDS/份 |

[卖出交易](https://etherscan.io/tx/0x88e9ef3eaee7b42a8fe441b48bdf4c4049038dc2fa009df4f7406c6fbc25673d) · [买入交易](https://etherscan.io/tx/0x32a7ae5f575f82926de12fafe7f912b306da42d279be85360306040991bfdab3)。这些成交不是同一笔往返、同档报价或当前容量；成交金额已反映该成交路径的价格影响和池费，不含链上 gas。不能用历史买卖双向直接锁定利润。

## 1,000 USDS 情景

- **已有仓位：** 以约 1.094 的账面份额估算，历史卖价 1.01285 对应账面 1,000 USDS 换回约 926 USDS，另扣 gas；不是千元执行报价。若能抢到金库可用现金，可以比较相同份额实际净赎回额，不能以 6,680 总额视作个人额度。
- **新买入：** 用历史 1.01787 的平均买价线性示例，若日后能按 1.094 全额兑现，账面毛差约 75 USDS；若只能按历史 1.01285 卖，假设同等价格适用于该规模，示意毛损约 4.9 USDS。两者均不含 gas、等待资金成本、可能的 MEV 与失败重试、跨链或 USDS/USDT 换币成本。更不把 50% 年化额外叠进收益。若可兑现单价不高于买入价加完整单位成本，折价策略失效；没有到期回归或不受损兑付保证，也没有已核对的完整对冲腿。净收益无法估算。
