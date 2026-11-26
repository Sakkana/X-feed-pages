---
title: sUSDe 冷却归零：即时拿回 USDe，不是即时兑美元
category: DeFi
tags: [Ethena, sUSDe, USDe, 赎回]
---

# sUSDe 冷却归零：即时拿回 USDe，不是即时兑美元

报告发送：2026-11-27 06:59:21（北京时间）

**观察：2026-11-26 22:58 UTC。** [Ethena 11 月 26 日公告](https://x.com/ethena/status/2125891305691873746)称 sUSDe 冷却从一天降为零。[以太坊 sUSDe 合约状态快照](https://smarts.md/susde-eth)显示地址 `0x9d39a5de30e57443bff2a8307a4256c8797a3497` 的 `cooldownDuration()` 为 0。本轮读到的是公开快照，不是精确变更交易回执或钱包到账记录。

**两个退出步骤不能混算。** [Ethena 公布的 StakedUSDeV2 代码](https://github.com/ethena-labs/bbp-public-assets/blob/main/contracts/contracts/StakedUSDeV2.sol)在参数为零时走 ERC‑4626 的赎回或提取，从 sUSDe 得到 **USDe**；已有 silo 队列可以在零冷却期间用原领取路径取回，不会自动到账。对已有持有人，最大变化是少等一天，不是凭空新增利息。对新买入，只在折价覆盖购入池费、滑点和 gas，加上 USDe 换出给的净价后，才可能有交易差额。官方 [USDe 直兑文档](https://docs.ethena.fi/video-guides/how-to-buy-usde)仍区分获准白名单直兑和普通用户走二级交易；零冷却不消除 USDe 脱锚、链上拥堵或界面地域限制。没有同期双向价，不把份额账面比率当稳定币兑出报价。

[风险委员会 11 月 24 日披露](https://gov.ethenafoundation.com/t/proposal-adopt-a-dynamic-cooldown-period-for-susde-unstaking/759/5)以 11 月 23 日数据为依据：一日可结算 Tier 1 资产约 12.5 亿美元，sUSDe 对应规模约 11.4 亿，约 1.10 倍；一日/三日压力缓冲比为 4.15 倍/1.94 倍，后者离 1.5 倍最低线更近。这是日尺度缓冲，不能直接证明同时赎回的即时美元流动性。8 小时线性奖励归属不变。恢复冷却的量化触发值仍待披露，不能把今日入口当作永续承诺。
