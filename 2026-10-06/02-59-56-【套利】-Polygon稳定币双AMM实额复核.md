---
type: 套利
tags: [套利, Polygon, 稳定币]
signal_strength: weak
report_sent_at: "2026-10-06T02:59:56+08:00"
observed_at: "2026-10-06T02:58:53+08:00"
observed_until: "2026-10-06T02:59:15.943965+08:00"
quote_basis: "980 USDT已在Polygon；两方向为独立方案，20 USDT为未使用费用余量"
---

# Polygon稳定币跨AMM现金闭环

**980 USDT本金的两向样本均为负：UniswapV3买入、QuickSwapV3卖回，差额−0.397937 USDT；反方向差额−0.303088 USDT。** 金额已扣报价中的交易费，尚未扣网络、审批及入金等成本。观察窗口为2026-10-05 18:58:53–18:59:15 UTC，只排除这组报价样本，不代表全市场无套利。

模型假设980 USDT已在Polygon；1000 USDT总预算中的剩余20 USDT只是费用余量，不计作利润。两方向是各用980 USDT评估的独立方案，不能同时用同一笔本金执行。

|方向|起点USDT|中间native USDC|终点同地址USDT|交易费后差额USDT|provider gas估算合计USD|
|---|---:|---:|---:|---:|---:|
|UniswapV3 → QuickSwapV3|980|979.795276|979.602063|−0.397937|0.016854|
|QuickSwapV3 → UniswapV3|980|979.884651|979.696912|−0.303088|0.017614|

两方向差额分别占本金−0.04060582%、−0.03092735%。中间金额均按第一腿真实扣费后raw整数衔接：979795276 → 979795276，以及979884651 → 979884651。最终差额只计算同一USDT合约的起止金额。

## 资产与报价来源

Polygon chain ID为137，USDT始末地址 `0xc2132d05d31c914a87c6611c10748aeb04b58e8f`；中间资产为[Circle主网表](https://developers.circle.com/stablecoins/usdc-contract-addresses)列出的native USDC，地址 `0x3c499c542cef5e3811e1192ce70d8cc03d5c3359`。两币均6位，全部报价请求和响应地址一致，没有把USDC.e当成native USDC。上述地址与单位核验不构成1:1现金赎回保证。

报价供应商为Velora，两AMM分别为UniswapV3和QuickSwapV3。供应商[Algebra class](https://raw.githubusercontent.com/VeloraDEX/paraswap-dex-lib/master/src/dex/algebra/algebra.ts)及[网络配置](https://raw.githubusercontent.com/VeloraDEX/paraswap-dex-lib/master/src/dex/algebra/config.ts)明确注册Polygon的QuickSwapV3配置；四个响应也各自只包含指定venue。价格按[公开Market schema](https://www.velora.xyz/docs/api-reference/market/prices.md)取得，RFQ被排除，默认价格影响保护保留。

|独立报价腿与公开动态链接|响应时间（2026-10-05 UTC）|顶层block|内部route block|gas估算USD|
|---|---|---:|---|---:|
|[UniV3 entry](https://api.velora.xyz/prices?srcToken=0xc2132d05d31c914a87c6611c10748aeb04b58e8f&srcDecimals=6&destToken=0x3c499c542cef5e3811e1192ce70d8cc03d5c3359&destDecimals=6&amount=980000000&side=SELL&network=137&excludeRFQ=true&otherExchangePrices=false&version=6.2&includeDEXS=UniswapV3)|18:59:00.346048|95014393|95014388，落后5|0.003841|
|[QuickSwapV3 entry](https://api.velora.xyz/prices?srcToken=0xc2132d05d31c914a87c6611c10748aeb04b58e8f&srcDecimals=6&destToken=0x3c499c542cef5e3811e1192ce70d8cc03d5c3359&destDecimals=6&amount=980000000&side=SELL&network=137&excludeRFQ=true&otherExchangePrices=false&version=6.2&includeDEXS=QuickSwapV3)|18:59:05.272312|95014396|未返回|0.013805|
|[QuickSwapV3 exit](https://api.velora.xyz/prices?srcToken=0x3c499c542cef5e3811e1192ce70d8cc03d5c3359&srcDecimals=6&destToken=0xc2132d05d31c914a87c6611c10748aeb04b58e8f&destDecimals=6&side=SELL&network=137&excludeRFQ=true&otherExchangePrices=false&version=6.2&includeDEXS=QuickSwapV3&amount=979795276)|18:59:09.917042|95014399|未返回|0.013013|
|[UniV3 exit](https://api.velora.xyz/prices?srcToken=0x3c499c542cef5e3811e1192ce70d8cc03d5c3359&srcDecimals=6&destToken=0xc2132d05d31c914a87c6611c10748aeb04b58e8f&destDecimals=6&side=SELL&network=137&excludeRFQ=true&otherExchangePrices=false&version=6.2&includeDEXS=UniswapV3&amount=979884651)|18:59:15.943965|95014403|95014388，落后15|0.003809|

动态链接再次打开可能得到不同价格；本报告只使用以上观察时刻的响应。

## 费用、容量和失效条件

每腿anon partnerFee字段均0.01%，上表采用destAmountAfterFee，已扣该费，不再重复扣除。AMM池费包含在供应商报价计算中；Uni路径fee/currentFee原值100，QuickSwap数值费率未单独返回。gasCostUSD是供应商美元估算，不能当作实际支付的USDT；审批、原生gas购入、入金/桥和实际执行滑点仍未知，20 USDT费用余量是否足够也未验证。不能据此给出完整净收益。

- 非原子顺序：两方向entry至exit响应分别间隔9.570994秒、10.671653秒，未锁定同时成交价格；实际顺序执行会承受滑点与MEV风险
- 区块与缓存：Uni两腿内部状态均为95014388，与顶层block不同；Quick内部block缺失，新鲜度未知，不能将这些快照视为同一时点
- gas和审批：具体gas资金准备、授权状态及实际费用未核；四条均无minReceived，无法保证最低到账。maxImpactReached=false也不等于价格影响为零，独立priceImpact字段均缺失

仅取得980 USDT及其对应中间数量的指示性报价，不证明实际可执行容量或更大规模可复制。两条完整样本在额外成本前已为负，因此不作为当前现金套利候选。
