# Yearn 提议延长奖励领取期：到期不等于自动清零

主类型：DeFi；标签：DeFi、Yearn、奖励领取

观察时间：2026 年 10 月 10 日 13:53 UTC。类型：DeFi 机制研究。

Yearn 9 月 30 日提出延长五类 stYFI 奖励的领取期限，10 月 5 日公布新治理页。普通质押、委托质押、液体锁仓及投票加成奖励拟由 26 延至 52 个 epoch；每个 epoch 为 14 天，即 364→728 天。已迁移 veYFI 的奖励只拟延至 31 个 epoch，即 434 天。改变的是领取期限，不是奖励数量。[提案原文](https://gov.yearn.fi/t/proposal-extend-styfi-reward-expiry-periods/14699)

## 现在仍在投票

观察时，官方治理页显示 Voting、Not decided。投票窗口为 10 月 8 日 00:00 至 15 日 00:00 UTC；列示的执行窗口为 10 月 15 日 00:00 至 29 日 00:00 UTC。页面同时标注 Guarded execution。“Executable”是提案类型，不能读成已通过或已经执行；窗口也不保证最终执行。[治理页](https://dao.yearn.fi/proposals/0)

## “到期”先打开回收权限

公开源码中，普通质押奖励的 claim 不用到期参数判断能否领取；reclaim 才读取该参数，计算哪些旧奖励可被回收。真正回收时，合约推进领取账目并转出相应代币。因此，过期没有让余额自动消失，但也不能保证持有人能抢在回收前领取。[质押分发器](https://github.com/yearn/stYFI/blob/9395d5e6fffdfe21fda32af94d32fca1a4f7840b/contracts/StakingRewardDistributor.vy#L250-L343)

治理文本说，回收后的奖励拟重新分配给 stYFI 持有人，而非充作财政收入；回收和再分配仍需后续操作。[提案原文](https://gov.yearn.fi/t/proposal-extend-styfi-reward-expiry-periods/14699)

## 旧余额如何受影响？

委托质押分发器在回收当下读取全局期限，而不是给每笔入账永久固定期限。若同一合约执行这项参数变更，尚未领取、尚未回收的旧奖励也会按新期限判断；年龄仍从原奖励记录算起，并非执行日起再送两年。已回收部分的领取账目已被推进，单改期限不会使其复活。[委托分发器](https://github.com/yearn/stYFI/blob/9395d5e6fffdfe21fda32af94d32fca1a4f7840b/contracts/DelegatedStakingRewardDistributor.vy#L214-L270)

迁移 veYFI 的分发器则有明确代码边界：期限必须大于 1、且小于 32 个 epoch，所以现有 setter 不能直接设成 52。它还保留单次最多推进 32 个 epoch、普通领取须完成同步的限制；延期并不保证陈旧账户都能立即领取。[迁移奖励分发器](https://github.com/yearn/stYFI/blob/9395d5e6fffdfe21fda32af94d32fca1a4f7840b/contracts/VotingEscrowRewardDistributor.vy#L361-L552)

持有人需要区分“治理修改参数”和“把奖励领到自己地址”：后者仍通过 RewardClaimer 处理，并非提案通过后自动到账。[项目说明](https://github.com/yearn/stYFI/blob/9395d5e6fffdfe21fda32af94d32fca1a4f7840b/README.md)

以上代码解释基于链接所固定的仓库版本，不等于已核对链上部署字节码或每个钱包余额。具体可领金额、交易费用和参数实际切换仍须另行确认。研究价值在于读懂领取权何时可能被回收，而不是预测收益。

