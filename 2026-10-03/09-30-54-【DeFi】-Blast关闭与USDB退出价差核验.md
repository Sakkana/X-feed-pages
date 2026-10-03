---
type: DeFi
signal_strength: weak
report_sent_at: "2026-10-03T09:30:54+08:00"
observed_at: "2026-10-03T09:22:00+08:00"
observed_until: "2026-10-03T09:26:00+08:00"
quoted_observed_at: "2026-10-03T09:22:00+08:00"
quoted_observed_until: "2026-10-03T09:23:00+08:00"
---

Blast出现值得留意的新公告：计划关闭，退出Lido资产期间提款暂停，恢复时间预计约一周；之后才计划采用24小时提款延迟。10月26日是普通界面截止，后续L1退出的具体说明仍待补齐，[官方公告](https://x.com/blast/status/2106032805280891073)

USDB折价研究暂评「弱」。北京时间10月3日09:22–09:23，1000U预算留20U费用，980 Arbitrum USDT报价买977.1544 USDB；即乐观假设日后按1:1兑成DAI，再按当时换汇报价，也只回977.10 USDT，约亏2.90U再扣提款、证明、领取等额外成本

已有Blast ETH的另一条路径，当时约976.96美元ETH买到978.92 USDB，只有约1.96美元面值差。它不是完成USDT进出的净利润，也没有足够空间覆盖尚未测全的退出成本

更重要的是，公开合约代码包含提款队列及checkpoint.sharePrice，实际兑付可能受负收益和可用资金影响；当前部署与参数尚未独立验证。因此不能把关闭公告理解为保证按面值、按时拿回现金。新买入者的退出权在代码机制上有依据，但关闭后的完整路径仍需确认

代码参考：[收益管理](https://github.com/blast-io/blast/blob/b82105486bfe33c8b12986e7cd42388fbab7d1d2/blast-optimism/packages/contracts-bedrock/src/mainnet-bridge/YieldManager.sol#L333) · [提款队列](https://github.com/blast-io/blast/blob/b82105486bfe33c8b12986e7cd42388fbab7d1d2/blast-optimism/packages/contracts-bedrock/src/mainnet-bridge/withdrawal-queue/WithdrawalQueue.sol#L201) · [普通余额提现入口](https://github.com/blast-io/blast/blob/b82105486bfe33c8b12986e7cd42388fbab7d1d2/blast-optimism/packages/contracts-bedrock/src/universal/StandardBridge.sol#L185)
