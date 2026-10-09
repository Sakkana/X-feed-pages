---
title: BNB跨DEX报价与BOLD赎回门槛
type: 套利
tags: [BNB, 跨DEX, BOLD, 赎回]
signal_strength: weak
report_sent_at: "2026-10-10T04:17:53.000885+08:00"
observed_at: "2026-10-10T04:15:24.387758+08:00"
observed_until: "2026-10-10T04:16:31.123185+08:00"
result: four_negative_bnb_quotes_bold_mechanism_only
---

# BNB 跨 DEX 四组报价为负，BOLD 赎回仍缺有效入场价格

报告时间：2026-10-10 04:17:53 北京时间。BNB 报价窗口：04:15:24–04:16:31（2026-10-09 20:15:24–20:16:31 UTC）。信号 weak。

## BNB：同数量回程都低于投入

在 BNB Chain 的 WBNB/报价器标记 USDT 交易对，以 100、980 单位测试 PancakeSwap V3 与 Uniswap V3 双方向。每条回程严格使用首腿扣 partner fee 后的 WBNB 数量：

| 投入 | 买入 → 卖出 | 返回 | 额外成本前差额 | 扣提供方 gas 估算后的情景差额 |
| ---: | --- | ---: | ---: | ---: |
| 100 | Pancake → Uni | 99.975711 | −0.024289 | −0.035659 |
| 980 | Pancake → Uni | 979.489552 | −0.510448 | −0.532846 |
| 100 | Uni → Pancake | 99.960542 | −0.039458 | −0.050828 |
| 980 | Uni → Pancake | 979.569589 | −0.430411 | −0.447780 |

单位为该链对应稳定币。gas 原本是提供方美元估算，再按最终报价的代币美元标记价换算，没有直接假定代币等于 1 美元。最后一列不是实付 gas 或最终结算收益。

两腿各 0.01% partner fee 已扣，AMM 费用和报价价格影响也已包含，不重复扣费。批准、实际 gas、取得链上代币的兑换/跨链成本、执行滑点和 MEV 尚未核实；四条在这些额外成本前已为负。

1000 USDT 预算中的 980 投入、20 缓冲仅为假设，20 不是实测成本，也不能加回成利润。模型只覆盖已备妥链上指定代币的现货往返，无融资或对冲报价。

## 大额路线不是单一两池

100 规模每腿为直接单池。980 的 Pancake 入场 74% 走直接池、26% 经 BTCB；980 的 Uni 入场则在两个直接池按 42%/58% 拆分。因此大额结果是限定 DEX 的聚合路线，不能称纯粹两池套利。

八次价格请求是不同时间的独立报价，往返外层区块差 18–22，非原子或同块执行。内部字段语义未核，区块差本身不能证明陈旧。这些数值不是成交结果或最大容量证明。

## 资产身份与来源

报价代币地址 0x55d398326f99059ff775485246999027b3197955，18 位小数，chain ID 56；提供方标为 USDT，检索索引称 Binance-Peg BSC-USD。原生 Tether 发行、储备和兑付权利没有取得完整证明，不能把这个表示资产视作无条件等同其他链 USDT。直接代币页身份核验返回 403 后，该身份补证目标未完成。WBNB 为 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c。

来源：[980 Pancake 买入定额报价](https://api.velora.xyz/prices?network=56&version=6.2&side=SELL&srcToken=0x55d398326f99059ff775485246999027b3197955&srcDecimals=18&destToken=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&destDecimals=18&amount=980000000000000000000&includeDEXS=PancakeswapV3&excludeRFQ=true&otherExchangePrices=false)，响应于 20:15:45.974177 UTC，对应回程响应 20:15:54.516518 UTC；980 反方向响应分别为 20:16:23.265277、20:16:31.123185 UTC。

## BOLD：0.5% 赎回费只是起点

[Liquity 官方说明](https://docs.liquity.org/v2-faq/redemptions-and-delegation)中的普通赎回费为 min(0.005 + baseRate, 1)，最低 0.5%；baseRate 随赎回上升，并按六小时半衰期衰减。赎回抵押篮子包括 WETH、wstETH、rETH，按外部债务分配，不是赎回人任意挑选资产。

若简化假设 USDT=1 美元、抵押物按预言机价值无成本卖出、费率不再增加，则 BOLD 买价需低于 $0.995 才可能留下余量；实际还要覆盖 gas、授权、赎回费变化、篮子卖出价差和冲击、MEV 与美元/USDT 基差。这不是当前盈利报价。

[官方新版部署资料](https://docs.liquity.org/v2-documentation/technical-docs-and-audits)与[2025-05-19 上线说明](https://www.liquity.org/blog/liquity-v2-is-live)支持新版身份，但部分官方示例地址与现行资料不一致，社区前端所用版本尚未核清。本次没有可采用的入场价格、当前 baseRate、实际篮子或完整净收益；不把机制门槛当作交易机会。
