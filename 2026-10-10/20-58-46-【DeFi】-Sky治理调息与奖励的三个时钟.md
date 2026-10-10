# Sky 的三个时钟：授权 Keeper、调息与质押奖励

类型：DeFi

标签：Sky、stUSDS、协议治理、Keeper、利率机制、质押奖励

摘要：读协议升级，不能只看“通过”或一个利率数字。这篇从 Sky 的新提案拆解治理执行、调息和奖励三个时钟，说明各自控制什么，以及为何它们不能直接变成收益承诺。

截至 **2026 年 10 月 10 日 12:52 UTC**，Sky 官方门户显示：10 月 8 日提案已于 10 月 9 日 19:02 UTC 通过，最早 **10 月 12 日 14:00 UTC** 可执行，尚不是执行完成。[官方状态](https://vote.sky.money/executive)

## 治理时钟 通过之后还差什么

**直接规则：** 提案设有 48 小时延迟，只能在周一至周五 14:00—21:00 UTC 执行。最早可执行窗口，不是承诺上线时间。[执行提案](https://vote.sky.money/executive/template-executive-vote-stusds-keeper-launch-monthly-settlement-cycle-for-september-2026-treasury-management-function-parameter-updates-adjust-allocator-grove-a-dc-iam-parameters-update-safe-harbor-agreement-prime-agent-proxy-spells-october-8-2026)

这次 Keeper 将人工参数更新转向授权自动提交，采用链下计算、链上限制的结构，计算算法未完全公开。指定运营地址获得授权后，团队仍需协调启动，并提交首次 `set`。截至观察时点，尚无此次升级执行完成或首次更新成功的证据。[Keeper 上线说明](https://forum.skyeco.com/t/stusds-keeper-launch/28282)

**机制解读：** 公告、授权、执行和实际运行分别回答不同问题。一个“已通过”标题，不能证明产品行为已经改变。

## 调息时钟 500 bps 究竟限制什么

`stepStrBps` 对应 stUSDS 利率，`stepDutyBps` 对应 SKY 抵押借款的稳定费。二者单次调整上限由 1500 降到 500 bps，16 小时最短更新间隔不变。BA Labs 将缩小步长定位为自动化过渡期防护，代价是急变时可能多等一至两次更新。[风险参数说明](https://forum.skyeco.com/t/stusds-beam-rate-setter-configuration/27161/99)

**单位核验：** 官方 `Conv` 模块把每秒 RAY 利率与年化 bps 相互转换；Rate Setter 在转换后的 bps 上比较差值。因此这里是年化利率参数单次最多变化 **15→5 个百分点**，不是相对变化 5%，更不是 RAY 原值相减。[利率转换定义](https://github.com/sky-ecosystem/rates-conv)、[检查逻辑](https://github.com/sky-ecosystem/stusds/blob/a262fdf86c59a8c0891fdd8e5bc9140beb7cdf4d/src/StUsdsRateSetter.sol)

代码限制新旧参数的绝对差，涨跌均受约束，仍须满足利率上下界；若旧值越界，先以区间边界作为比较基准。成功提交相同值也重置冷却计时。因此，16 小时不是必定调息的频率。[Rate Setter 代码](https://github.com/sky-ecosystem/stusds/blob/a262fdf86c59a8c0891fdd8e5bc9140beb7cdf4d/src/StUsdsRateSetter.sol)

**算术示例：** 在同时满足其他利率上下界的假设下，参数从 4% 移到 10%，可分成先到 9%、再到 10%，但不能一步跳完；两次更新仍至少相隔 16 小时。这仅示范规则，不代表当前利率或自动化实际路径。

**机制解读：** 缩小步长限制单次错误的幅度，却不会消除模型、操作者或连续调整的风险。

## 奖励时钟 44 分 53 秒不是提现期限

提案把 `splitter.hop` 与 `REWARDS_LSSKY_USDS.rewardsDuration` 从 2504 秒改为 2693 秒，针对回购分配和 SKY 质押者的 USDS 奖励流。它们不是 stUSDS 调息冷却或提现期限。[奖励周期变更](https://vote.sky.money/executive/template-executive-vote-stusds-keeper-launch-monthly-settlement-cycle-for-september-2026-treasury-management-function-parameter-updates-adjust-allocator-grove-a-dc-iam-parameters-update-safe-harbor-agreement-prime-agent-proxy-spells-october-8-2026)

**算术与推断：** 41 分 44 秒变成 44 分 53 秒，增加 3 分 9 秒，约 7.55%。但这不足以推出个人收益下降 7.55%，也不保证每周期向钱包转账；预算、合格质押份额及参与时间仍影响结果。

## 奖励预算 改看实际回购数量

10 月财库配置改以此前完整自然月实际回购的 SKY 计算质押奖励和销毁量，替代此前基于时间加权均价的方法。约 3317.53 万 SKY 对应本次月度奖励。**99,525,882 SKY／90 天**则将总量和时长同步扩展，给执行偏差留缓冲，奖励速度没有翻三倍。[财库配置依据](https://forum.skyeco.com/t/treasury-management-function-tmf-configurations/28153/8)

**机制解读：** 分配预算更贴近已经发生的回购，但实际买到多少 SKY，仍不等于个人最终能换回多少美元。

## 持有人需要读懂的风险

stUSDS 为 SKY 质押借款提供隔离风险资本。官方说明明确涉及坏账、治理和流动性风险；可赎回资金还受到现有借款及拍卖占用影响。自动化更新没有让它变成保本或随时可退出的产品。[产品与风险说明](https://github.com/sky-ecosystem/stusds/tree/a262fdf86c59a8c0891fdd8e5bc9140beb7cdf4d)

读这类治理新闻，可以先分清：改的是哪个产品、当前利率还是调整边界、奖励金额还是时间参数、已获批准还是已实际运行。本文的价值在于读懂这些区别，不在于预测一个收益数字。

### 日期与证据边界

状态观察时点为 2026 年 10 月 10 日 12:52 UTC。依据包括正式提案、官方说明和链接代码，未独立核验运行合约或执行交易。实际切换时间、首次 Keeper 更新、届时利率及个人回报仍未确认。这些治理参数不足以推出个人收益。
