# Morpho P2P Orders：选定成交对手，为什么还要看整个市场

观察日期：2026-10-10 UTC｜类型：DeFi 借贷机制研究

Morpho在10月8日月报中宣布：Midnight的P2P Orders允许用户设定条款、发给选定对手方并直接成交；官方列出Ethereum、Base、Arc和Robinhood Chain支持。本次未逐链核验。这里的10月日期是月报日期，不是Midnight协议首发日期。[官方月报](https://morpho.org/blog/the-morpho-effect-september-2026)

## 固定利率，未必是长期双边借条

Midnight是固定期限市场，不能套用旧P2P Optimizer或Blue浮息机制。记账单位（units）的成交价决定固定利率。

成交后，贷方债权（credit）与借方债务（debt）都按市场记账，不构成只对那位对手方的持续双边贷款。[Midnight机制](https://docs.morpho.org/learn/concepts/midnight/)

因此，挑选成交对手不能替代审查市场允许的抵押品和预言机。官方开发文档明确，贷方承担整个可接受抵押品集合的敞口；同一市场若清算后仍有坏账，损失会按比例减记贷方credit，其他市场则隔离。[风险范围](https://docs.morpho.org/developers/midnight/get-started/)、[坏账规则](https://docs.morpho.org/learn/concepts/midnight/liquidations/)

## 签出报价，不等于锁定一笔资金

协议offer可设生效时间、过期时间和最大量，也可部分成交。报价签出本身不锁资金，没有协议强制的价格时间优先级；资金可以到成交时才通过callback调取。因此，拿到报价不等于一定能成交。[Offer规则](https://docs.morpho.org/learn/concepts/midnight/offers/)、[路由与资金](https://docs.morpho.org/developers/midnight/concepts/mempool-router/)

指定对手方也有合约层支持：10月8日版本的PriceRatifierV1、RateRatifierV1会检查allowedTaker，零地址表示不限定，否则必须匹配实际taker。但本次未核App实际采用的验证器与配置。[固定版本源码](https://github.com/morpho-org/midnight/blob/2d22210472f34d5589a3b6a7abfe3bc062f3188c/src/ratifiers/PriceRatifierV1.sol#L86-L96)、[Rate验证器](https://github.com/morpho-org/midnight/blob/2d22210472f34d5589a3b6a7abfe3bc062f3188c/src/ratifiers/RateRatifierV1.sol#L90-L104)

报价有效期与贷款到期日不同。源码支持让未成交报价失效；撤销余单不会消除已成交形成的credit或debt，已有头寸仍需退出或偿还。[报价与取消逻辑](https://github.com/morpho-org/midnight/blob/2d22210472f34d5589a3b6a7abfe3bc062f3188c/src/Midnight.sol)

固定利率也不等于净收益固定：协议可收taker结算费及贷方持续费，另有gas与损失风险；本次没有核实具体市场费率。[费用设计](https://docs.morpho.org/developers/midnight/concepts/fees/)

## 到期与退出也要分开看

贷方提前退出依赖反向成交及可用报价；直接兑回贷款币还受市场已有可提款资金限制，并扣除费用和损失。到期不自动创造现金流动性。[退出规则](https://docs.morpho.org/developers/midnight/get-started/)

借方可直接用一单位贷款币偿还一单位债务。抵押不足可触发清算；到期后仍欠款，即使抵押健康，也进入逾期清算范围。[还款机制](https://docs.morpho.org/learn/concepts/midnight/)、[清算条件](https://docs.morpho.org/learn/concepts/midnight/liquidations/)

还要看市场gate：它可以限制新增借贷或清算参与者；不阻止符合正常协议条件的退出，但不保证退出流动性。[准入规则](https://docs.morpho.org/learn/concepts/midnight/gates/)

官方 App 设有金融使用条款及地区、制裁资格要求。当前参与资格、App 实际配置、实时可成交量、费用和净收益均未核实。[App提示](https://markets.morpho.org/fixed)

主类型：DeFi；标签：DeFi、Morpho、固定期限借贷。
