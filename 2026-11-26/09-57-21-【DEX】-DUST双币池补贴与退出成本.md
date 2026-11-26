---
type: DEX
signal_strength: weak
---

# DUST/USDC 奖励压力测试：180% APR 不等于可兑现收益

报告发送时间：2026-11-26 09:57:21（北京时间）

**类型：DEX｜标签：Monad、Uniswap V2、Merkl、Neverland｜收益信号：弱**  
观察：2026-11-26 09:57（北京时间）。Merkl 页面与池储备并非同一时点，未取得实时双向报价。

[Merkl 活动页](https://app.merkl.fr/opportunities/7327295532519788406) 的一个快照显示：Monad 的 DUST/USDC V2 池每日分配 **193.14 nUSDC**，用于计算的 TVL 约 **39,160 美元**，页面年化 **180%**。奖励对象为指定 UNI-V2 LP，页面列有一个排除地址。不同页面对剩余时间显示不一致，不能把任何一个倒计时当成已核实的新一期截止时间。

**1,000 USDC 情景。** 假设新增头寸全额计入，按金额占比且其他资金不变，每天约 **4.81 nUSDC**；连续七天同速才约 **33.66 nUSDC**，并非已确认有七天。若 DUST 跌 10%、USDC 不变，等值双币 V2 LP 的美元市值下跌约 **51.32 USDC**（不计手续费收入）；只计上述七天补贴且假设可按面值兑现、零成本，DUST 跌约 **6.6%** 就会抵消补贴。这是相对全持 USDC 的价格损益，不是相对持有两币的无常损失。

**进出成本。** 用 [DUST/USDC 池的历史储备快照](https://dexscreener.com/monad/0x86dbf00485871c901c5129bd525348db96c2eb2d)（约 18,996 USDC／1,593,931 DUST，无精确区块）和 [V2 的 0.30% 手续费](https://developers.uniswap.org/docs/get-started/concepts/fees) 估算：50／500 USDC 单腿分别约换到 4,172／40,759 DUST；把各自数量卖入独立假设的同一初始储备，回款约 49.44／472.26 USDC。这是两条独立的容量测试，不是一次往返报价，也不是精确 LP 建仓成本。结果未计 LP 自身改变储备、路由差异、gas、MEV 或外链资金成本。

已有合格 LP 仓位可单独看增量奖励，不用重付建仓成本，但仍承受 DUST 波动。只有 USDC 的新资金则需建立 DUST 暴露；退出要先拆 LP，再卖回 DUST，并单独领取、赎回 nUSDC。[Neverland 提款规则](https://docs.neverland.money/faq) 要求池中有可用未借出流动性，所以 193.14 nUSDC 不能直接当到手现金。未核实本期截止、实际分配、赎回余量、同步退出报价或可用对冲，净收益无法估算。
