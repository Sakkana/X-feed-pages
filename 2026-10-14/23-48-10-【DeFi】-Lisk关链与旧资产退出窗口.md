# Lisk关链与旧资产退出窗口

- 主类型：DeFi
- 标签：DeFi、资产退出
- 原公告时间：官方退出文章标注「Sep 2026」，未列具体日期；相关FAQ未显示发布日期
- 本轮观察：2026-10-14 15:47 UTC（北京时间23:47）

## 核验结论

Lisk官方确认，Lisk Chain将于2026年10月31日关闭，涉及链上所有资产，包括LSK、ETH、稳定币、桥接资产和DeFi仓位。官方未给出具体UTC时分，不能据此假定可等到当天23:59。

这项变化涉及既有资产退出。LSK已在Ethereum或交易所的持有人，按官方说明无需因本次关链操作；Ethereum上的LSK合约保持不变，没有换币或重定值。[来源：官方退出说明](https://lisk.com/blog/posts/withdraw-assets-from-lisk-chain/)、[LSK Token FAQ](https://support.lisk.com/faq/lsk-token)

## 最重要的时间成本

- 普通Lisk→Ethereum提取约8天；质押LSK先解锁、等待3天、解除质押，再跨链，合计至少预留约11天
- 初次发起提取后约一小时，还须在Ethereum提交prove交易；7天挑战期从prove开始，最后仍须执行claim
- DeFi仓位须先退出为底层资产；各协议可能另有更早期限。Ethereum端的prove和claim需要ETH支付gas
- 官方表示，关链后链上遗留资产没有恢复流程或补领窗口，应提前处理，不把估计耗时当保证

[来源：官方退出说明，Sep 2026](https://lisk.com/blog/posts/withdraw-assets-from-lisk-chain/)

## 权益与适用边界

新LSK质押已停止，现有仓位仍可在关链前获得奖励；未领取奖励需在关链前领取。解除质押已取消惩罚，但3天等待期仍在。官方未提供可凭新买入获得的迁移额外收益。[来源：LSK Token FAQ](https://support.lisk.com/faq/lsk-token)

WETH无法直接通过原生Lisk桥提回Ethereum，官方指引是先在Lisk解包为原生ETH，再桥接。官方列出的有效桥入口为bridge.lisk.com；具体资产的可执行路径和费用仍需逐项核实。[来源：Lisk Chain Closure FAQ](https://support.lisk.com/faq/lisk-chain-closure)

