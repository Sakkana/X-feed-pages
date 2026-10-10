# evaUSDC 折价重评：2,000 USDC 报价只留3.88 USDC条件余量

2026-10-11（北京时间）｜主类型：套利｜标签：套利、赎回、信用风险、利率｜信号弱

evaUSDC 的赎回门槛为2,000 USDC。以下以2,000 USDC本金观察买入与赎回路径，链上gas另备；USDC与USDT是不同资金，不直接混用。

**先看真实买腿。** 2026年10月10日17:42:18 UTC，[金额报价](https://api.velora.xyz/prices?network=1&version=6.2&side=SELL&srcToken=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&srcDecimals=6&destToken=0x741bD193B6b40f8703d2e116FD1965421f290F58&destDecimals=6&amount=2000000000&includeDEXS=CurveV1StableNg&excludeRFQ=true&otherExchangePrices=false)给出2,000 USDC→2,003.882071 evaUSDC，已计入池内费用并扣除provider费，不能重复扣费。路线经过Curve三池，途中持有USDT和evaUSDT，增加了相应资产与合约风险；这是一笔参考报价，没有实际成交。

**兑现仍有条件。** 官方将Ethereum上的evaUSDC列为Wildcat—Wintermute USDC信贷产品包装，称二级买入者可在赎回周期后收回原资产。[产品与赎回文档](https://www.eva.markets/docs) 当前[赎回页](https://www.eva.markets/mint)写最低2,000 USDC、通用1:1汇率、7天周期；7天不能视为保证到账期限，信用损失和合约风险仍在。

**余量到底多薄？** 仅在未来足额按1:1兑付的假设下，面值差额为3.882071 USDC，约本金的0.1941%，还不是净收益。若恰好等待7天，并假设替代资金年率为5%，机会成本约1.917808 USDC，只剩1.964263覆盖其余成本；若拖到14天，仅剩0.046455，均尚未扣gas。这是压力测试，不是实际收益率或排队预测。

买腿API给出的gas估计为0.119982美元，仅覆盖该买腿估值，不能代表授权、赎回请求、领取及资金调入的全程费用。全部额外成本与信用损失合计超过3.882071 USDC，就耗尽条件差额；采用上述7天机会成本假设时，其他成本阈值降至1.964263 USDC。

官网对应金额只显示“≈$2,003.6”，没有金额专属净收款、赎回费或队列报价；它不是已证实到账额。可提款资金、当前资格及实际兑付状态仍未知，故维持weak，不升级为可执行套利。[金额页](https://www.eva.markets/mint)

金额页观察于2026年10月10日17:43:09 UTC；报价与页面并非同一时刻或原子执行证明。
