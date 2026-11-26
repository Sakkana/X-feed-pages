---
signal_strength: weak
---

# stcUSD 新期 YT：已有成交，CAP 仍待锁定与分摊

主类型：激励  
标签：Pendle、stcUSD、YT、CAP  
报告发送：2026-11-27 00:58:51（北京时间）  
观察及评级：2026-11-26 16:58 UTC；**弱**，奖励资格的细节、兑现深度与双向报价均有缺口。

## 奖励条款与实际成交

[Pendle 原帖](https://x.com/pendle_fi/status/2125880192103285210)在 11 月 26 日发布；[公开存档](https://coindar.org/en/event/pendle-to-unlock-15-million-cap-in-rewards-on-march-18th-157263)转录其细则：计划把 1,500 万枚 CAP 按合格 YT 持仓量与持有时间分摊，只有在 Pendle 买入的 YT 计入，直接铸造不计；计划在 2027 年 3 月 18 日到期申领，由多签控制的时间锁承接。尚无核实的入锁余额、个人累计分、全体合格总分或买入后转手的计分细则。持有旧期限 YT 不等于持有本期合格资产，不能假设自动迁移。

Ethereum 市场 `0xAFBdAe1Ec53df0478eD2345D6C11E3f1F39e72e0` 对应 YT `0x1114C3a315C7C3fD183c4e7A11e4e46B53F32C8d`。链上历史样本：[0.0059 ETH 买入约 172.41 YT](https://ethereum.atomicwallet.io/tx/0x82eb124c16e48e0e73f0d27899967de36e9afb2a390bbc2f88a5b705bb0e4196)；[33.18096 sUSDD 买入约 811.17 YT](https://ethereum.atomicwallet.io/tx/0x3895cb4629f7261e33e98cd7ee6ba13acd5c92a73adc7a1fd240695d64d69570)，后一笔区块 26,499,247，浏览器显示 Gas 约 0.30 美元。第二笔中间路由的 USDC 不是用户额外付出的本金。两笔不是同一金额、同一输入币或同一区块，不能用来估计深度或退出滑点，也不能仅据转账证明参与计分。

## 到期不返本金，CAP 奖励也不按买入金额固定计息

按 [Pendle YT 机制](https://docs.pendle.finance/pendle-v2/ProtocolMechanics/YieldTokenization/YT)，YT 持有者取得到期前的底层浮动收益，而不是本金；到期后剩余未来收益权归零。持有到期的收益条件是：底层实际收入 + 可领取、可售出的 CAP 净值，覆盖 YT 买入成本和买入、领取、卖出所需费用。提前退出须另计 YT 卖出深度、滑点，以及卖出后是否保留已赚计分，不能把未核实的分数当应收现金。

[KuCoin 现货上市公告](https://www.kucoin.com/announcement/en-world-premiere-cap-cap-listed-on-kucoin)核实 CAP 已交易，但今天能成交的头寸与明年个人可领币量是两件事。假设有 100 美元待覆盖成本、底层收益按 0、CAP 到时每枚净售 0.09 美元，则至少需要约 1,112 枚 CAP；这只是盈亏阈值，不是获配估算。奖励分母和未来价格不明，无法固定对冲数量；即便用永续，也有基差、资金费、清算和保证金成本。未获得同期多金额的 YT 买入和退出报价，净收益无法估算。
