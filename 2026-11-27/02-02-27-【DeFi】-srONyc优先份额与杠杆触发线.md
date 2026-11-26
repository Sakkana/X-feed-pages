---
signal_strength: weak
---

# Kamino srONyc：优先份额的保护与杠杆触发线

主类型：DeFi  
标签：Kamino、OnRe、Exponent、USDC、风险分层  
报告发送：2026-11-27 02:02:27（北京时间）  
观察与评级：2026-11-26 18:02 UTC，**弱**；尚未建立按规模、退出价格和奖励实收计算的收益。

## 优先份额不等于保本

[OnRe 11 月 25 日原帖](https://x.com/onrefinance/status/2125685406859731065)介绍 Kamino 的 [srONyc 独立借贷市场](https://kamino.com/borrow/sronyc-stables)。这不是普通 ONyc 的旧市场。根据 [OnRe 分层条款](https://docs.onre.finance/onyc-in-defi/defi-opportunities/risk-tranching-markets)，srONyc 将一部分底层收益让给 jrONyc，以换取按覆盖率决定的第一损失保护。jrONyc 资本不足以吸收损失时，剩余损失可以传导到 srONyc；这与借贷平台的抵押阈值是两个不同机制。

## 借款、杠杆和退出各有一条线

用 srONyc 抵押借 USDC，市场最高 LTV 89%，自动还款触发 LTV 94%（[上线数据与公告交叉核对](https://solanacompass.com/news/kamino-opens-onre-sronyc-market-its-first-to-accept-senior-tranche-collateral)）。借到顶时，保持债务与 USDC 价格不变，抵押品相对下跌 `1−0.89/0.94≈5.32%` 即至该触发线；利息或 USDC 走强会缩小缓冲。不能把 94% 当作硬清算线，也不能把自动偿还等同于每个账户必定执行。LTV 循环的几何上限约 9.09 倍；1,000U 自有资金在该纯模型下对应约 9,091U 抵押、多约 8,091U 债务，借款成本每增加 1 个百分点，年化约多 81U。没有把这个上限写成实际仓位或收益。

[Kamino USDC 储备快照](https://kamino.com/borrow/reserve/B8zJcFyc6qH5BeVthzaptq1hZP4BN9XkS16hym4iG7w5/HoKeMdZ9WhgwZXed74ypBJK98tXZRzkbuETtaTw8MX8G)显示约 269 万 USDC 存入、248 万借出、借款 APY 2.25%；按显示精度净余约 21 万 USDC。储备页没有状态区块；其他 Kamino 页面快照的流动性与借款 APY 不同，不能将这组读数与不同页面、不同时间的底层 APY 或补贴估算相减。剩余可借资金与 srONyc 变现深度无关。不能把瞬时低借息和宣传补贴拼成固定利差。

已有 srONyc 的持有者可比较借 USDC 与卖掉份额的不同成本。新开收益循环的收入来自杠杆后的 srONyc 收益及实际可兑补贴，成本来自浮动债务、买卖偏差、Gas、拆仓深度、潜在清算或止损成本；退出须偿还 USDC、解除抵押，再卖出或按份额条款兑换。市场方的[激励公告](https://x.com/kamino/status/2125690600267936209)未能提供账户实际分配和退出时点的可兑现报价，未计分、未到期不可兑现的激励不作现金收入。缺同一时点的进出报价和可核实的到账量，不能给净收益。
