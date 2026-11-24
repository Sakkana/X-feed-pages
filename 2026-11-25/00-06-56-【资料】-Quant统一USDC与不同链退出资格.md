# Quant Fusion：同一 uUSDC 余额与跨链退出限制

- 主类型：资料
- 标签：Quant、USDC、跨链、Rollup、退出
- 原报告：2026-11-25 00:06:56（北京时间）
- 观察：2026-11-24 16:06 UTC

[Quant 11 月 23 日公告](https://quant.network/news/quant-fusion-mainnet-is-now-open-for-public-access/)称 Fusion 主网从精选早期用户扩大到可公开注册 Quant Connect、通过 KYC 再接入。主网原在 6 月上线；这次不是重新上线。起始接入 Ethereum、Polygon、Besu。许可式 Besu 不能当作普通公链出金通道。

普通跨链包装中，不同来源的 USDC 可能形成不同凭证与流动性；Quant 把认可来源映射成同一 uUSDC 余额。[Fusion 文档](https://docs.overledger.dev/docs/fusion-rollup)描述通过 Rollup 状态证明释放资产，允许范围受具体网络和许可控制；将资产撤回原链的发行方表述，不等于任何用户可以任意选目标链或即时赎回。文档中 Ethereum Sepolia、Polygon Amoy 的映射为测试示例，不能作为主网合约、深度或到账时间的证据。

可研究的价格问题是同一底层 USDC 能否在两个来源链之间经同一余额完成等额转移，且实际费用、等候、额度、审批与技术风险优于外部路径。要用主网支持的 USDC 合约逐一核身份，测试小额和较大额路径的净到账及反方向恢复能力。当前未取得主网 API 实际路由、兑付额度、两端费用及同额退出报价；没有证实正净套利。官方 [Quant FAQ](https://quant.network/frequently-asked-questions/)列平台费用可用 USD 或 QNT，开放注册不能直接推导所有用户要去市场买 QNT。
