# Origin赎回套利与退出成本核验

- 报告发送时间：2026-10-02 18:14:06（北京时间，UTC+08:00）
- 标签：赎回套利、USDe、流动性、退出成本

## 【DeFi】Origin sUSDe ARM：赎回套利，有收益来源，但退出条件还没核清

观察时间：2026-10-02 18:03–18:09，北京时间
主类型：DeFi｜标签：赎回套利、USDe、流动性、退出成本

### 结论
新增一个研究候选，暂未确认可执行净盈利。它赚的是帮别人提前退出 sUSDe 的折价，以及闲置资金的借贷收益；当前收益已低于旧推文，赎回规则还存在官方资料冲突。

### 1. 旧推文与当前数据
[Origin 官方原帖](https://x.com/OriginProtocol/status/2097338712308748590)发表于9月8日，当时宣传7日 APY 11.4%、30日 APY 7.75%。这不是今天的报价，也不是今天上线的新项目。

本轮读取[产品应用](https://app.originprotocol.com/#/arm/1:ARM-sUSDe-USDe)和[Analytics](https://analytics.originprotocol.com/arm/1:ARM-sUSDe-USDe)：
- 30日 APY：6.51%
- [7日 APY](https://analytics.originprotocol.com/arm/1:ARM-sUSDe-USDe?ma=7)：3.82%
- TVL：238,316.28 USDe，不代表即时可退出额度
- Vault availability：0 USDe；Total pending：0 USDe
- 历史提款 P95：15小时，但统计定义尚未独立核实，不能当作到账保证

这些是观察时的前端快照，没有逐项对应到同一区块。availability=0也不足以证明发生提现故障。

### 2. 怎么赚钱
按[官方机制](https://docs.originprotocol.com/automated-redemption-manager-arm/susde-arm)：用户存入 USDe，金库接收急于退出者出售的折价 sUSDe，等待 Ethena 赎回后赚取差额；闲置 USDe 配置到 Aave V3。

sUSDe 是生息份额，不能机械地按1 sUSDe=1 USDe计算套利。LP同时承担 ARM、Ethena、USDe 和 Aave 的风险。

### 3. 小资金能剩下多少
假设投入1,000 USDe、收益率未来30天不变、USDe价格不变，按复利 APY 换算：
- 使用6.51%：30天约赚5.20 USDe；总外部成本5 USDe后，只剩0.20
- 使用3.82%：30天约赚3.09 USDe；同样成本后亏1.91

这里的5 USDe只是成本情景，并非现场报价。尚缺买卖USDe的滑点、授权/存款/赎回/领取gas，以及可能的跨链成本；目标金额容量也没有验证。

[官方FAQ](https://docs.originprotocol.com/resources/faq)说明展示APY已扣协议费用，因此没有重复扣费。积分、空投、未核实奖励均按零计价。仅1%的资产折价或金库损失，就可能超过上述一个月收益。

### 4. 最大缺口在退出
[集成文档](https://docs.originprotocol.com/resources/guides/arm-integrations)规定先申请、再领取。最短延迟10分钟，但流动性不足时依赖底层赎回及资金流入，没有最长等待保证。

另有两处重要问题：
- 提款表某记录提交与领取相隔数天，却显示等待16小时，可能分别统计“可领取时间”和“实际领取时间”；本轮尚未核清，不能用P95推算实际到账
- [9月4日官方风险文章](https://www.originprotocol.com/blog/arm-risk-exposure)说申请后净值上涨不归退出者；[当前风险文档](https://docs.originprotocol.com/automated-redemption-manager-arm/arm-risk-controls-and-redemptions)却说可获得更高的领取时净值。两份一手资料相反，尚未验证当前部署实现究竟采用哪一种

两份资料一致指向：申请赎回不代表价值锁定，等待期间的下跌可能仍由退出者承担。

### 5. 风险、容量与失效条件
[官方合约目录](https://docs.originprotocol.com/registry/contracts/arm-registry/ethena-susde-usde.md)对应 Ethereum 金库：0xCEDa2d856238aA0D12f6329de20B9115f07C366d。本轮只完成地址对应，没有验证当前实现、全部参数和余额。

主要风险包括 USDe 脱锚、Ethena托管及交易所风险、Aave流动性、ARM定价与升级权限，以及赎回排队。[Ethena风险说明](https://docs.ethena.fi/protocol-overview/risks)

价差缩小、收益下降、费用超过收入、提款拥堵或资格不符，都可能让机会失效。没有核实限时奖励或截止日，也没有确认读者的参与资格。

### 本轮范围与下一步
已验证云浏览器中的X登录，检查关注流首屏、定向搜索、官方原帖、Origin应用与数据面板，并对照机制、费用、风险及Ethena资料。没有把旧宣传收益当当前收益，也未将此前候选重复报成新发现。

下一步优先补齐：当前合约的净值结算规则、同一区块可退资金与队列、1,000／10,000 USDe的完整进出成本。补齐前维持观察，不作为入场建议
