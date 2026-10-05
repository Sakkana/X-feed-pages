---
type: 套利
tags: [套利, Artizen, 赎回套利]
report_sent_at: "2026-10-05T18:30:29+08:00"
first_findings_sent_at: "2026-10-05T18:15:43+08:00"
title: Artizen ART 市场买入与国库退出价差核查
date: 2026-10-05
observed_at: "2026-10-05 10:13–10:30 UTC"
chain: Base
project_id: 6
protocol_version: V6
signal_strength: weak
status: 当前可执行价差未证实
budget_reference: 1000 USDT
net_profit_estimate: 不可估
---

# Artizen ART 市场买入与国库退出价差核查

**结论：当前价差未证实，1,000 USDT 预算的净利润不可估。** Artizen 出现小额市场买入单价低于另一笔历史国库退出单价的线索，且有普通退出的公开记录。但两笔流量异时、异量，尚缺同一时点、同一数量的有效买入报价和退出净额，不能把约 30.9% 的历史单价差当作可赚幅度。

观察窗口为 2026-10-05 10:13–10:30 UTC；下列成交发生时间与观察时间分别列示。

研究假设是以 USDC 在市场买入 ART，再通过项目的现金退出机制销毁代币、取回 USDC。它依赖可执行的两端价格及退出规则，而非 ART 后续上涨；现金退出权也不构成固定价格或本金保障。

## 标的与版本

核查对象是 [Artizen 官方项目页](https://revnet.money/base:6) 对应的 Base（chain ID 8453）Juicebox／Revnet V6 project 6。ART 为 18 位精度，地址为 `0x44c4516768e47cd97cfF2561B81a74699F23f8Ec`。买入与退出均指这一个 ART，结算资产为 Base 原生 USDC，地址 `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`，精度 6 位。

官方部署记录将 ART 的 JBERC20 与 JBMultiTerminal 绑定到 `@bananapus/core-v6@1.0.2`，REVOwner 绑定到 `@rev-net/core-v6@1.0.1`。两份 npm 发布包的 SHA-512 与注册表完整性字段相符，相关源码已核对；索引规则的 data hook 亦对应该 REVOwner。**这建立的是部署记录与发布版源码的对应关系，尚不等于对当前链上运行字节码和全部状态的独立证明。** 见[官方部署记录与发布包](#公开来源)。

## 两笔历史流量

官方项目索引给出以下同链、同币种记录，单价按原始数量计算：[项目活动与市场](https://revnet.money/base:6)、[官方索引接口](https://bendystraw.up.railway.app/graphql)。

| 发生时间 UTC | 流向 | 精确数量 | USDC／ART |
| --- | --- | --- | --- |
| 2026-10-05 10:02:35 | 国库退出 | 164991.646743123389372726 ART → 20.218430 USDC | 约 0.000122542143 |
| 2026-10-05 10:05:57 | 市场买入 | 0.610809 USDC → 6524.849700187657261662 ART | 约 0.000093612731 |

退出单价比后续买入单价高约 30.9033%，但买入只有约 0.61 USDC，退出数量约为其 25 倍，两笔也不是同一个买入再退出的闭环。

20.218430 USDC 的含义已按发布版核实：JBMultiTerminal 先扣核心协议费、向受益人转款，再发出 CashOutTokens 事件；[索引实现](https://github.com/peripheralist/bendystraw/blob/29181339b206b7e106be68c66e1a0c7e13eca2ed/src/JBMultiTerminal.ts) 直接保存事件的 reclaimAmount。因此，该历史值按已核对的实现是 **terminal 实际净付款**，不是扣费前估值；它仍未扣此前买入成本及 gas，也不能替代现在的同额退出预览。

## 普通持有人资格与账面口径

发布版正常路径允许持有人本人或其授权操作人退出，不检查是否为最初出资人，也没有按二级市场买入日起计算的持有期。REVOwner 的 cashOutDelay 是项目级绝对时间；本次未读到其当前精确值。当日有带 10% cash-out tax 的正额退出记录，支持当时普通退出路径已开放，不能据此保证任何后续数量都能退出。[规则](https://juicebox.money/base:6#terms)、[Revnet 发布版](https://registry.npmjs.org/@rev-net%2fcore-v6/1.0.1)

索引总供给为 958270670.587691297119093005 ART，**已含** reserved 427688.947667353804972724 ART，不能再加一次。[供给索引实现](https://github.com/peripheralist/bendystraw/blob/29181339b206b7e106be68c66e1a0c7e13eca2ed/src/JBController.ts) 显示预留份额发行时计入总供给，分配时只减少 reserved。另有贷款本金 603.574083 USDC、可复铸抵押 5021013.808099320584995347 ART；计算有效退出分母须计入该抵押供给，有效资产口径亦须处理贷款本金及适用的跨链状态。旧约 959.6M ART 自动发行额度与唯一对应领取事件数量相等，已经领取，不是新空投或待领取增量。[贷款页面](https://revnet.money/base:6/owners?subtab=loans)、[官方索引](https://bendystraw.up.railway.app/graphql)

观察到的账面余额约 137381.054580 USDC 不是固定兑付保障，也不是精确可退出容量。已有退出、借贷、供给变化及本地流动性约束均会影响结果。

以有效资产 S、有效供给 T、参与曲线计算的 ART 数量 c 表示，在 10% 税参数下，忽略整数取整的曲线金额为 S×(c/T)×[0.9+0.1×(c/T)]。实际还要结合费用、贷款、hook 和本地限额。因此，不能直接用账面余额除以流通供给，所得数字既不是固定地板价，也不能作为任意成交规模的兑付承诺。

## 费用与容量仍未闭合

发布版在正常非免手续费路径下，先从退出 ART 数量划出 2.5% 作为 Revnet 费用，剩余数量再按退出曲线估值；核心协议标准 2.5% 则作用于相应 USDC 退出金额。两者基数不同，不能直接合并成固定 5% 扣减；10% cash-out tax 也是曲线参数。费用部分有独立曲线计值，超出本地流动性时会按比例约束，buyback hook 还可能选择市场路径。当前项目的完整 hook 选择、费用豁免、同额净付款及实际容量仍需核实。[核心发布版](https://registry.npmjs.org/@bananapus%2fcore-v6/1.0.2)、[Revnet 发布版](https://registry.npmjs.org/@rev-net%2fcore-v6/1.0.1)

官方市场显示的 1% Uniswap V4 池 ID 为：

`0x760dee01ca4afcf02e6aaa16a59d809c08e16895652b01c4306f5536760bb77d`

该池与最近索引成交一致。页面的 33.31M ART、946.4481 USDC 仅表示**覆盖当前价格的价带流动性**，不是全池流动性，更不是交易硬容量上限。[官方市场](https://revnet.money/base:6/owners?subtab=market)

10:22:51 的 100 USDC Velora 响应却选择了另一只 fee=700000、即 70% 的池：

`0x18777bcd772d2f956b05592a9e28059d47564dbe9f9e87839b0b1a041fb973cf`

响应报出 99.72% 影响并返回 HTTP 400，没有有效报价。错误体中的代币数量不是成交结果，也不能据此判断上述 1% 目标池买入失败。[Velora 价格接口](https://api.velora.xyz/prices?srcToken=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&destToken=0x44c4516768e47cd97cff2561b81a74699f23f8ec&srcDecimals=6&destDecimals=18&amount=100000000&side=SELL&network=8453&version=6.2&includeDEXS=UniswapV4&excludeRFQ=true&otherExchangePrices=false) 是动态数据源；本次观察也未从 Uniswap 页面取得补充报价。

因而尚不能外推 1,000 USDT：除目标池的真实滑点、费用和可买数量外，还缺同量退出净额、买入与退出 gas，以及 USDT→USDC、最终 USDC→USDT 两段资金转换的成本。稳定币面值接近不代表这些成本为零。

## 升级与失效条件

- **升级为可执行候选：** 同一近实时状态下取得目标 1% 池有效买入数量，并为该数量确认普通持有人资格、实际退出路径、全部费用及容量；将两段稳定币转换和 gas 计入后仍有正净额，且覆盖目标预算规模
- **价差失效：** 匹配数量后的净退出收入不高于全成本买入支出，或当前规则、hook、退出时间条件、流动性阻止该路径完成
- **保留弱信号：** 只有历史小额成交或图表参考价，仍缺任一关键执行环节；本次属于这一状态

## 公开来源

1. [Artizen 项目与活动](https://revnet.money/base:6)、[项目规则](https://juicebox.money/base:6#terms)、[市场](https://revnet.money/base:6/owners?subtab=market)、[贷款](https://revnet.money/base:6/owners?subtab=loans)
2. [ART 部署记录](https://github.com/Bananapus/deploy-all-v6/blob/main/deployments/base/JBERC20__ProjectART.json)、[JBMultiTerminal 部署记录](https://github.com/Bananapus/deploy-all-v6/blob/main/deployments/base/JBMultiTerminal.json)、[REVOwner 部署记录](https://github.com/Bananapus/deploy-all-v6/blob/main/deployments/base/REVOwner.json)
3. [核心协议 1.0.2 发布元数据](https://registry.npmjs.org/@bananapus%2fcore-v6/1.0.2)、[Revnet 1.0.1 发布元数据](https://registry.npmjs.org/@rev-net%2fcore-v6/1.0.1)；其中 dist.tarball 与 dist.integrity 对应本次核对的发布包
4. [固定版本供给索引实现](https://github.com/peripheralist/bendystraw/blob/29181339b206b7e106be68c66e1a0c7e13eca2ed/src/JBController.ts)、[固定版本退出事件索引实现](https://github.com/peripheralist/bendystraw/blob/29181339b206b7e106be68c66e1a0c7e13eca2ed/src/JBMultiTerminal.ts)、[项目官方前端采用的公开索引接口](https://bendystraw.up.railway.app/graphql)
5. [Velora 本次参数对应的动态价格接口](https://api.velora.xyz/prices?srcToken=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&destToken=0x44c4516768e47cd97cff2561b81a74699f23f8ec&srcDecimals=6&destDecimals=18&amount=100000000&side=SELL&network=8453&version=6.2&includeDEXS=UniswapV4&excludeRFQ=true&otherExchangePrices=false)
