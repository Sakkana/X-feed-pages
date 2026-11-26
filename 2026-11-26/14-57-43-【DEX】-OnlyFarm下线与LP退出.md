---
title: "OnlyFarm 11 月 30 日下线：撤出底层 LP 和取回钱包是两步"
type: DEX
tags: ["OnlyFarm","Meteora","Solana","流动性退出"]
---

# OnlyFarm 11 月 30 日下线：撤出底层 LP 和取回钱包是两步

主类型：DEX  
标签：OnlyFarm、Meteora、Solana、流动性退出  
报告发送时间：2026-11-26 14:57:43（北京时间）  
观察时间：2026-11-26 14:57:43（北京时间）

[OnlyFarm 11 月 25 日原帖](https://x.com/onlyfarmai/status/2125476142216102150)宣布应用 11 月 30 日下线，并要求在此之前关闭头寸并提取资金。公告没有给出停机时刻、时区或停机后的独立退出入口。它是 Meteora 上方的 LP 自动化层；公告说的是 OnlyFarm，不是 Meteora 池整体关停。仅停止代理不等于已经撤出 LP，更不等于两种资产都回到自有钱包。

**为什么不能把 Meteora 页面当成兜底。** [DLMM 官方账户说明](https://github.com/MeteoraAg/docs/blob/main/developer-guides/dlmm/program/accounts.mdx)区分持仓 owner 和锁定释放时间；[DAMM v2 官方说明](https://github.com/MeteoraAg/docs/blob/main/developer-guides/damm-v2/program/accounts.mdx)说明持仓 NFT 是所有权凭证、委托权限有各自范围。只有在确认实际 LP 的 owner、NFT 托管地址和提款权限后，才能判断是否能经底层直接退出。若持仓由应用金库控制，普通钱包有金库提款权也不必然能直接动底层 NFT；没有核实任何一个 OnlyFarm 金库的停机后备用入口。

对现有持仓，核对两层结果：底层头寸的流动性与未领费用是否已处理、两种返还资产是否确实到达本人地址。即使撤 LP 成功，双币返还也不是等值稳定币到账；若另有换币，还受当时滑点、交易费用和池深制约。普通的 [DAMM v2 退出说明](https://github.com/MeteoraAg/docs/blob/main/user-guides/how-to-use-damm-v2/damm-v2-pool-detail.mdx)只覆盖可撤流动性，不能证明 OnlyFarm 特定路径可用。
