# sUSDD PT 到期：1000 PT 对应的是 USDD，不是 1000 USDC

- 主类型：DeFi
- 标签：DeFi、Pendle、稳定币、赎回
- signal_strength: weak
- 报告发送时间：2026-11-26 09:03:15（北京时间）
- 观察时间：2026-11-26 约 09:03（北京时间）；历史成交按区块注明

**11 月 26 日到期批次｜弱信号。** Pendle 的 sUSDD PT 以 **USDD** 计本金：规则所说的 1:1，是每 1 PT 到期可赎回价值 1 USDD 的 sUSDD，而不是 1 枚 sUSDD 或 1 USDC。sUSDD 在 Ethereum 可按份额兑换 USDD、不设锁期；再换 USDC 要另看 Ethereum 的 PSM 或 DEX 报价。官方 PSM 操作指南写的“免服务费”明确只适用于 TRON，不能照搬到 Ethereum。[Pendle 赎回规则](https://docs.pendle.finance/pendle-v2/ProtocolMechanics/YieldTokenization/PT) · [USDD Savings](https://docs.usdd.io/user-guide/usdd-savings) · [PSM 指南](https://docs.usdd.io/user-guide/psm-peg-stability-module)

**链上两段有历史记录，但不是同一笔退出。** 区块 26,492,137 的到期前成交，约 101,685.07 PT 卖出得到 94,682.11 sUSDD；较早区块 26,458,753 的另一笔约 50,400 PT 得到 46,919.50 sUSDD。两笔不同区块，sUSDD 是生息份额，不能直接用枚数差推亏损，也不能外推成千元档报价。另在区块 26,444,021，Ethereum 官方 PSM-USDC 有一笔 5,833.091226 USDD 换出等量 USDC 的历史记录；这是另一笔多市场交易中的单独一腿，不代表现在同价同容量。[大额 PT 成交](https://ethereum.atomicwallet.io/tx/0xe58e54872553f4eda5afc02052adfa82e739ec8c9a45488b4d688fb2b05102d4) · [另一次 PT 成交](https://ethereum.atomicwallet.io/tx/0xa8b050f1b33e6652ab128ec628b935bf208262732d3a4726829c8f1dc4c5f1b6) · [历史 PSM 回执](https://ethereum.atomicwallet.io/tx/0x024493d56c02ea2695a28bdab7ad4cbb2f899de94e574aa22de55bd4378e3479) · [发行方合约表](https://docs.usdd.io/introduction/collateral-asset-contract-addresses)

**1,000 PT 情景。** 已有仓位按约 1,000 USDD 面值做预算，不按 1,000 USDC 到账做预算；对新资金，以 1,000 USDC 为起点，最终保底出金必须超过本金、gas 与未计入报价的费用，才有正净收益。PSM 应核对的是 **USDCJoin 的 USDC 余额**、当期费用和可用额度，不是只看 PSM 合约地址。用 DEX 换出还要看同额最小输出和滑点。到期后单独用 PT 赎回的实际回执、当前 PSM 可出金额和同一区块的两条退出报价，本轮都未取得；没有可算的当前净收益。

**补证：Ethereum PSM 的两个方向并不对称。** 同一区块 26,495,887 的两笔独立交易中，50,000.000300 USDC 换得 49,900.0002994 USDD（约 **20bp**）；反方向另一笔把 49,906.874635 USDD 换出等量 USDC。区块 26,495,889 另有 69.228232 USDD 按 1:1 换出。随后查到的浏览器余额页面显示 USDCJoin 仅剩 **23.961721 USDC**；页面没给余额对应区块，不能当实时可用额度，但按该快照余额，未补库存时连 100 USDC 都不能走这条单一路径。大额历史成交证明曾有库存，不证明现在能兑。上述都不是到期 PT 的实际赎回。[入金回执](https://ethereum.atomicwallet.io/tx/0x558585a46e519166b5ee9e6ab041da8f6fcc71f25643b9e7ae53ce2e3128b7f8) · [出金回执](https://ethereum.atomicwallet.io/tx/0xf7fb78cca746292be5df280ed1a1ee7dd3e98eb4d2a255b796a3e59a3269cf3a) · [USDCJoin 余额页](https://ethereum.atomicwallet.io/address/0x9A7E1B324060dB7342aeA08c0dc56F55CEd6F519)

**USDT 是另一条出口，不等于 USDC 路径已经恢复。** 09:03:48 北京时间读取的地址页里，Ethereum 的 USDTJoin 显示约 **3,691 万 USDT**，但同样没有精确余额区块。另有区块 26,495,502 与 26,495,045 两笔历史执行，分别约 **89.77 万**、**21.37 万 USDD** 换得等量 USDT。对已有 USDD，这比只看 USDC 池更有参考价值；目标若是 USDC，还得另算 USDT→USDC 报价、费用和 gas。[USDTJoin 余额页](https://ethereum.atomicwallet.io/address/0x217e42CEB2eAE9ECB788fDF0e31c806c531760A3) · [较大回执](https://ethereum.atomicwallet.io/tx/0xeb8412bd28fe19c16c1a70b06b7999c3797e78fa4ed638a668650e924748c301) · [另一笔回执](https://ethereum.atomicwallet.io/tx/0x303d427888e1f41aa5d67a5b13ba560bbef4d49fa6fb851376b38509261ed751)
