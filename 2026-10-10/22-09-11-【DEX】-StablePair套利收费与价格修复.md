# StablePair 给套利机会加价：LP 收费与价格修复的取舍

观察日：2026 年 10 月 10 日。本文解读 9 月机制，并非 10 月新上线消息。

Uniswap Labs 在 9 月 10 日宣布 StablePair Hook 上线，以太坊首批为 USDC/USDT、USDC/USDG 池。它想解决的问题是：价格偏离后，能否把部分套利空间收成 LP 手续费，而不是全留给纠偏交易者？这是收费设计，不是额外奖励池。[上线公告](https://blog.uniswap.org/stablepair-hook-a-fee-that-moves-with-the-market)

## 先问“相对什么价格纠偏”

USDC/USDT 的参考价在建池时设为 1:1，并非持续追踪外部市场的预言机。[9 月 16 日机制说明](https://blog.uniswap.org/keeping-value-in-the-pool-how-stablepair-hook-works)

参考价也不是永远不可改：它与费带、衰减系数等一起存于池配置，官方文档将上线后的改参权交给 Uniswap 治理。所谓“稳定”，首先是一项定价假设。[配置规则](https://developers.uniswap.org/docs/protocols/uniswap-labs-hooks/stable-pair/concepts/pool-creation)

## 两个方向，收不同的费

带内，动态 LP 费试图维持一组稳定的买卖报价；带外，继续偏离参考价的方向，hook 的 LP 费为零。把价格拉回参考价的方向，则先收高费，再按区块衰减，等交易者愿意接受。衰减速度和目标值由池参数决定，不保证何时有人成交。费用有目标下界，价格变化也可使其上调，并非等得够久就免费。[动态费规则](https://developers.uniswap.org/docs/protocols/uniswap-labs-hooks/stable-pair/concepts/dynamic-fees)、[衰减规则](https://developers.uniswap.org/docs/protocols/uniswap-labs-hooks/stable-pair/concepts/fee-decay)

源码走的是 v4 的 LP fee override，并返回零自定义记账差额，不是另设一笔 hook 抽成。费用计算还排除了可能启用的协议费，所以“零 LP 费”不能理解为整笔交易免费。[固定版本源码](https://github.com/Uniswap/v4-hooks-public/blob/e4eabe526f9b516fff78d98ba781251747f0fd6e/src/stable/StablePairHook.sol)

## 同一块、同一方向，费率和成交价仍是两回事

正常同配置状态下，第一笔 swap 前的池价会被缓存，用于该区块后续收费。这能阻止交易者把纠偏交易拆成多腿、逐步压低费率；代价是缓存可能过时。若池价块内跨过参考价，两个方向的收费身份甚至会暂时倒置，下一块才重算。[价格缓存](https://developers.uniswap.org/docs/protocols/uniswap-labs-hooks/stable-pair/concepts/block-price-caching)

费率不依赖订单金额，也不代表大单和小单拿到同样成交价。大单仍沿流动性曲线成交，承受价格冲击；getFee 不是完整成交报价。[报价边界](https://developers.uniswap.org/docs/protocols/uniswap-labs-hooks/stable-pair/security)

## 真正的取舍

下面是机制推论：纠偏费越高，LP 能尝试截留的价差越多，但套利者也可能等费率下降，或者改去别处交易。它没有消灭套利，而是在争取套利利润的分配。

更重要的是，若某币真正脱锚，回到 1:1 未必还是正确的市场修复方向。固定参考价不会自动识别信用变化；零费吸收偏离方向的交易，也可能让 LP 积累贬值资产。这项设计不能代替对两种资产兑付风险的判断。

普通 LP 可沿标准 v4 流程提供和移除流动性，无该 hook 的专属白名单；但创建新池受限。能退出头寸，也不等于退出所得代币能按面值卖出。[LP 规则](https://developers.uniswap.org/docs/protocols/uniswap-labs-hooks/stable-pair/guides/provide-liquidity)

以上核对的是官方规则与固定版本源码，没有验证当前部署字节码、实收费收入、完整交易报价或个人 LP 收益。设计目标是改善价值分配，实际效果仍取决于成交量、流动性、参数和资产是否守住参考关系。


主类型：DEX；标签：DEX、Uniswap、动态手续费。

原始观察时间：2026-10-10 14:04–14:06 UTC（固定版本源码核验）；官方规则与公告日期见正文链接。发布时间不代表重新核验部署或行情。
