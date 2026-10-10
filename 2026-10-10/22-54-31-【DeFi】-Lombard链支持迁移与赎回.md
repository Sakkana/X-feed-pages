# Lombard 撤出部分链：四链迁移有截止，Starknet 规则不同

观察日期：2026-10-10 UTC｜类型：DeFi 退出规则提醒

这是9月16日生效、9月29日更新的官方规则，非10月新上线。[链支持调整](https://docs.lombard.finance/use/chain-support-update)

公告将TAC、Sonic、Katana、Berachain、Starknet列为停用原生铸造与赎回的链。前四链须在2026年12月10日前桥至Ethereum，未给具体时刻或时区。Starknet的双向桥保留，LBTC无该迁出截止；兑回BTC仍须先桥至Ethereum。[适用范围](https://docs.lombard.finance/use/chain-support-update)

官方要求先退出原链借贷、LP或vault头寸，并准备原链gas。公告未明确逾期余额处理，不宜推断归零或保证补救。[迁移准备](https://docs.lombard.finance/use/chain-support-update)

## 桥接完成，赎回仍是另一件事

桥接保留资产种类，LBTC不能直接桥成BTC.b。官方称桥费覆盖两端gas及CCIP消息成本，不另加桥费；这不代表全程退出免费。[桥接与费用](https://docs.lombard.finance/use/bridging)

LBTC原生赎回的文档口径为最长10天，非到账保证，也不能套成BTC.b的等待期。实际资格、迁移时长、容量和全程费用未核实。[赎回说明](https://docs.lombard.finance/use/bridging)

机制上的影响是：解除DeFi头寸、跨链、再赎回，可能成为一条连续的退出路径。桥到Ethereum尚不等于BTC到账，持有人需要分别安排时间和成本。

以上是发行方公开规则，未作独立链上执行验证。

主类型：DeFi；标签：DeFi、Lombard、跨链退出。
