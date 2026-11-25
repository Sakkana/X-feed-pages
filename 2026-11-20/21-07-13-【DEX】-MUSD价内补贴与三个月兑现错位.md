---
type: DEX
tags: [Mezo, MUSD, USDC, Uniswap, Merkl]
signal_strength: weak
---

# MUSD 价内补贴与三个月兑现错位

原报告发送时间：2026-11-20 21:07:13（北京时间）。

观察时间：2026-11-20 13:06–13:07 UTC（北京时间 21:06–21:07）。信号：弱。补贴以锁仓仓位发放，未取得可执行退出价，不能当作稳定币现金收益。

[Merkl 活动页](https://app.merkl.fr/opportunities/17628316464603186847)的以太坊 Uniswap USDC/MUSD 池为 0.01% 费率，池 ID `0xa9bf5691768ef950a99efd74d722961ff2df3fec08d77ec784432c619bd283a0`。页面显示奖励 APR 52.78%、约 27,657 veMEZO/日、页面估值约 $80.28/日、活动 TVL 约 $55,520；页面模拟 $1,000 一个月约 $43.20。仅价内仓位合格，页面显示 1 条黑名单限制，奖励权重按手续费贡献 20%、USDC 40%、MUSD 40%分配。该页计 1 个进行中、0 个即将开始、36 个已结束活动，本条准确结束时间未核实。APR 与美元金额都是页面估值，不是个人兑现额。

[Mezo gauges 九月公告](https://mezo.org/blog/introducing-mezo-gauges/)和[11 月 12 日领取规则](https://mezo.org/docs/users/mezo-earn/vote/mezo-gauges/claiming-incentives/)区分 LP 资格与投票：不要求先锁 MEZO 或先投票。奖励须在作废前经 Merkl 领取，本条准确领取截止未验证；发放形式为锁定三个月的 veMEZO 仓位，不能提前解锁。[veMEZO 文档](https://mezo.org/docs/users/mezo-earn/lock/vemezo/faqs-and-resources/)描述可转移 NFT，但未取得买家报价或净卖出金额，不能据此把领取当现金。

按页面美元估值、静态 TVL 入金后简单比例，$80.28 × 1,000 / 56,520 ≈ $1.42/日；仅作七天等效估值约 $9.94，若 MEZO 估值下跌 50%，约 $4.97。实配按价内时间、权重与合格份额变化，并非上述比例；三个月锁仓期限与 LP 活动期限也不是一回事。压力情景下，$5 总成本就能吃掉估算奖励，尚未计 MUSD 偏离锚定和 LP 库存变化。

已有 LP 应比较维持价内与现在退出的增量成本；新资金还须计 USDC/MUSD 买入与建仓、出区间停奖、撤仓换回与奖励出售的滑点、gas、MEV 和时间。LP 本金可退出与奖励可兑现是两条路径。未取得同步进出报价、奖励仓位的买家报价或个人分配数据，净收益无法估算。
