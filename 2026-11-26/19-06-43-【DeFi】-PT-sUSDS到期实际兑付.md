---
title: "PT-sUSDS 到期：三笔实收 USDS，另一路收的是 sUSDS"
type: DeFi
tags: [DeFi, Pendle, PT, sUSDS, 赎回]
summary: "到期后以太坊实收显示，约 800、72,379、102,200 PT 实际兑成近等量 USDS；另一笔输出 sUSDS 生息份额，不要混同 stUSDS。"
observation: "2026-11-26 11:06 UTC 核验；交易以区块高度记录，并非同一区块报价"
---

# PT-sUSDS 到期：三笔实收 USDS，另一路收的是 sUSDS

报告发送时间：2026-11-26 19:06:43（北京时间）

[Pendle 11 月 26 日到期市场](https://app.pendle.finance/trade/markets/0x9c560ebaf78e596cbcc27411d633a74d628dd7dc/swap)的本金代币（PT）对应的是 sUSDS 储蓄路线。按照 [Pendle PT 赎回文档](https://docs.pendle.finance/pendle-v2/ProtocolMechanics/YieldTokenization/PT)，到期的 1:1 指会计单位，最终收到哪种资产还取决于赎回路线。此处不涉及 stUSDS 的 SKY 抵押借贷余额和共享现金限制。

| 以太坊区块 | 本金腿烧掉的 PT | 本金腿最终收到 | 实际 gas（ETH） |
| --- | ---: | ---: | ---: |
| [26,495,782](https://etherscan.io/tx/0x01fddf00520c858b7e4c278fc88ec73387a4f1996038c13d1723d3d2195f37c8) | 799.920148 | 799.920148 USDS | 0.00006132 |
| [26,496,374](https://etherscan.io/tx/0x051b640897092cc9211d8384e2c8af4b9512006a51a2a46bf6961e4b5bf6fa23) | 64,999.598373 | 58,158.256198 sUSDS | 0.00007839 |
| [26,496,439](https://etherscan.io/tx/0x86c34b853b726e93060e678f7b488e2b653dc072acf2723ee199d5e8653e6b9d) | 102,199.782754 | 102,199.782754 USDS | 0.00017381 |
| [26,496,524](https://etherscan.io/tx/0xcc3fff0ea5f856e8189640ccacf17dabd950248e060c430bf2860f1fcef02e21) | 72,378.667706 | 72,378.667706 USDS | 0.00005504 |

取交易最终接收者的本金输出，不将路由中间铸造、SY 销毁或单独的收益移动重复计入。记录中的本金赎回不消耗 YT；不能直接将收到的 58,158.256198 sUSDS 理解成只收到 58,158.256198 USDS，因为 sUSDS 每份累计储蓄利息；也不能将三笔不同规模已完成交易视作实时 gas 或未来容量报价。

- 已有到期 PT：观察证实有历史实际兑付；选 USDS 或 sUSDS 出口时区分最终资产、报价与 gas。抵押在其他协议里的份额能否取回，还受该仓位债务和抵押规则影响，本核验没有覆盖。二级兑换到 USDC、USDT 或法币不是本表的退出腿。
- 新资金：已到期市场的历史隐含年化不是现行买入价。没有把这组实际赎回与历史买入快照拼成已实现回报；交易证明的是退出机制和当时实付成本。
