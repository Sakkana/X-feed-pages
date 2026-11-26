# Ronin 国库准备加深 RON/USDC，新增的是 rETH 池，不是持币分红
主类型：DEX｜标签：DEX、流动性、国库  
报告发送：2026-11-24 15:05:57（北京时间）  
观察：2026-11-24 07:04 UTC

[11 月 10 日最终提案](https://blog.roninchain.com/p/rgp-1-the-vote-is-live)把[10 月 23 日草案](https://blog.roninchain.com/p/rgp-1-putting-the-treasury-to-work)的 RON/WETH 换成 RON/rETH。国库拟把 40,054.4 USDC 投入现有 Katana V2 RON/USDC 池，并将 22.34 WETH 换成约 19.01 rETH，加上已有 0.66 rETH 投入新池；配对约 196 万枚库存 RON，合计约 17.7 万美元流动性，不等于新增 RON 市价买单。[正式投票](https://pod.roninchain.com/governance/RGP-1)按当时安排于 11 月 24 日 18:00 北京时间截止，至少 2,000 万 RON 参与且赞成占赞成加反对至少 66%；买入新 RON 不会改变快照权重。未取得实时票数；即使通过也不等于池已到账，国库有 14 天执行。

真正的变化在手续费怎么分。官方估算 1 万美元 RON/USDC 单腿冲击从 5.4% 降到 4.5%；新 RON/rETH 池 1,000 美元单腿约 2% 冲击。这是提案模型，不是当前报价。[Katana V2](https://docs.roninchain.com/apps/katana/swap-tokens)每跳收费 0.30%，其中 0.25% 按 LP 份额分，0.05% 进国库。对既有 LP，若成交额不变而池加深，单位资金分到的费用会下降；成交增长要快过增资才抵消稀释。若走 rETH→RON→USDC，两跳池费的比例损耗约 0.599%，另计两池冲击和 gas；直接 RON/rETH 池有深度不代表完整稳定币退出便宜。还需比较 V3 路由。

官方按历史成交估计 9,400 美元/年回国库（8,400 交易费、1,000 rETH 质押收益），不是 RON 持有人分红或普通 LP 的 APR。计划用 CCIP 将 WETH 转至以太坊换成 rETH，转换成本上限 0.5%；rETH 还有桥和脱锚风险。没有执行后的池储备、同步双向报价或真实路由，不能推算净收益。
