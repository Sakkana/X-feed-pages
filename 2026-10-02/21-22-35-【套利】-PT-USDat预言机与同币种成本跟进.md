# 【套利】PT-USDat × Morpho 跟进：25分钟TWAP已核实，净优势仍很薄

- 报告发送时间：2026-10-02 21:22:35（北京时间，UTC+08:00）
- 标签：DeFi、融资利差、预言机
- 观察时间：2026-10-02 13:07–13:17 UTC（北京时间21:07–21:17）

主类型：套利｜标签：DeFi、融资利差、预言机  
观察：2026-10-02 13:07–13:17 UTC；循环报价13:09–13:11，现货对照13:14–13:15。自己的云浏览器只读，X仍登录@Ur3arings；未连钱包、签名、交易或社交互动

**本轮没有新增已确认净套利。新增的是两项关键证据：USDT入金的三档预览，以及该市场实际采用25分钟PT价格TWAP。** 便宜融资窗口还在，但利率已变；1万美元档若融资回到7日均值，相对不循环的粗略增量仅约16美元，出口成本仍未计全。

## 1. 从同一种入金币比较，避免漏掉换币

[Pendle循环市场](https://app.pendle.finance/trade/markets/0x4ccf6deb3d1895373f604b418ff55d8adae8b846/loop/deposit?mmAddress=0x8fc5f14ff891f59851c5c53d00f6227b6838c5b0&debtToken=0xdac17f958d2ee523a2206206994597c13d831ec7&chain=ethereum&view=pt&chart=pt-looping&trades=loop-positions)固定APY约9.27%，剩余103天。路径仍是USDT换USDat买PT → 抵押Morpho借USDT → 买更多PT → 到期兑USDat、换USDT还债。收敛来自PT兑底层单位，浮息和USDat/USDT基差没有锁定；未加永续对冲，积分计零。

统一Ethereum、3x、Mint Mode关闭。依次取得的真实“Preview Only”读数：

| 输入USDT | 借入USDT | 抵押PT | 预估APY | 103天预估回报 |
|---:|---:|---:|---:|---:|
| 1,000 | 1,989.35 | 3,058.86 | 16.33% | $35.95 |
| 10,000 | 19,932.2 | 30,648.1 | 16.38% | $431.89 |
| 100,000 | 199,055 | 306,071 | 15.37% | $4,127.77 |

三档gas图标估计分别约$7.84、$7.42、$7.05，不能当成全部费用；每轮自动滑点容忍0.17%／0.10%／0.10%，也不是实际损失。报价非同一区块、未做链上成功模拟，不能保证成交。

新增[直接买PT对照](https://app.pendle.finance/trade/markets/0x4ccf6deb3d1895373f604b418ff55d8adae8b846/swap?mmAddress=0x8fc5f14ff891f59851c5c53d00f6227b6838c5b0&debtToken=0xdac17f958d2ee523a2206206994597c13d831ec7&chain=ethereum&view=pt&chart=pt-looping&trades=loop-positions)：同样输入1千／1万／10万USDT，分别得1,024.35／10,245.1／102,446 PT；交易详情Fee为$0.5276／$5.28／$52.77，有效固定APY约9.04%／9.07%／9.07%。这比拿首页9.27%直接算收益更接近实际入口，费率应以具体路线核算，不能机械扣上一轮Specs的0.19%。

## 2. 利差在，增量回报不宽裕

[Morpho市场](https://app.morpho.org/ethereum/variable/0xd8dd3e1d051eee97d1353a113982afac90612c775f393edea45ef7f20caec489/usdt-pt-usdat-14jan2027)13:07读取瞬时5.01%、7日平均8.04%；13:13官方API已是瞬时约5.116%、可借240.71万USDT、利用率74.66%。这是浮息窗口变化，不能把5.01%锁到到期。

1万美元档，以报价时约5.01%为基准，假设103天融资均为8.04%，额外利息一阶近似：19,932.2×3.03%×103÷365≈170.43美元。网页回报敏感性约261.46美元。

直接买入的10,245.1 PT，到期兑10,245.1 USDat；仅在USDat与USDT按1:1退出的假设下，相对本金约赚245.1。因此循环增量约16美元。若融资均为10%，循环敏感性约151美元，已低于该现货基准。

这不是精确净利润比较：页面美元估值、两次报价时间、借款复利与入场后的利率变化均有差异；直接买入基准未扣额外gas及出口成本。[官方说明](https://docs.pendle.finance/pendle-v2/AppGuide/PTLooping)另有动态服务费（循环名义本金最高10bp）、PT交换费和gas，不能重复扣预览已计费用。

## 3. 预言机补全：会受PT市场价格影响

[官方API方法](https://docs.morpho.org/developers/api/morpho/)查到本市场oracle为0x1f741cB8E43e82C0abD66bb2A724b013ee2fc26c，类型ChainlinkOracleV2；基础feed为[这份合约](https://etherscan.io/address/0x9e2BD3D67754DcD4014aB48a496F0f24C24C9Bd2#readContract)。现场Read Contract显示：

- market匹配0x4ccf…b846；baseOracleType=1，即PT_TO_ASSET
- twapDuration=1500秒，亦即25分钟
- 报价分母接[Chainlink USDT/USD](https://etherscan.io/address/0x3E7d1eAB13ad0104d2750B8863b489D65364e32D)；其余feed和vault为空

结合[官方实现文档](https://docs.pendle.finance/pendle-v2-dev/Contracts/Oracle/ChainlinkOracle)，这是PT兑底层的TWAP，**不是线性只涨预言机**。隐含收益率跳升会压低抵押估值。配置没有独立USDat/USD市价feed，因此不能把健康指标当成USDat脱锚的完整预警；SY偿付调整等机制仍需分开考虑。

LLTV91.5%、3x粗略LTV66.67%，静态估值缓冲约27.14%；利息累积会侵蚀它。清算罚金2.61%不是最大亏损上限。

## 4. 仍未闭合的出口

提前卖PT换USDT的页面多次renderer超时，刷新后仍失败，未获得可用卖出输出。到期USDat兑换资格、兑换费／滑点、赎回与偿债gas、拥挤退出容量仍未核实；此前Saturn地域限制没有绕过。不能把240.71万可借额或约2,197万美元TVL当作策略容量，本轮仅测试到10万入口。

X成功打开[9月9日官方原帖](https://x.com/pendle_fi/status/2097701877098123728)，其3%底层APR属于旧公告，不额外加到PT收益；本轮未据此新增活动判断。

结论：保留有证据的DeFi融资利差候选，暂不升级为全成本净套利。借息抬升、主要供应者撤资、PT价格下跌、USDat出口受限或费用吞掉增量，均可使其失效。下一步价值在完整出口与循环费拆分，不在扩大杠杆。
