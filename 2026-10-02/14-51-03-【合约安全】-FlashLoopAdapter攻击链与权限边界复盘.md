# FlashLoopAdapter / Aave V3 Loop Safe 事件研究报告

- 报告发送时间：2026-10-02 14:51:03（北京时间，UTC+08:00）
- 研究截止：2026-10-02 06:43 UTC（北京时间 14:43）
- 主类型：合约安全
- 标签：合约安全、Aave V3、Safe、FlashLoopAdapter、访问控制、Confused Deputy、闪电贷
- 研究主题：FlashLoopAdapter / Aave V3 Loop Safe 事件：伪造调用者、任意外部调用与跨钱包权限复用
- 事件日期：2026-10-01（UTC）
- 链：Ethereum mainnet
- 状态：公开证据复盘；未执行主网 fork 重放；修复部署状态未确认


## 一、核心结论

**这是部署于 Ethereum 的 FlashLoopAdapter 自定义 Safe 模块发生的跨钱包权限滥用。当前证据不支持将它定性为 Aave V3 核心借贷合约被攻破，也不支持“Safe 的多签密码学被破解”。**

漏洞链由三个信任错误串联而成：

1. 入口把调用者自己返回的 `isModuleEnabled(adapter) == true` 当作其可信身份依据，攻击者可以用伪造 Safe 通过检查
2. 闪电贷来源 `providerAddr` 也由该调用者指定；回调只校验“来自刚才指定的地址、参数哈希一致”，不能证明这个地址是真实、受信的闪电贷提供方
3. `_swap()` 以具有真实 Safe 模块权限的 adapter 身份，对任意 `swapRouter` 执行任意 `swapCalldata`。攻击者把目标换成受害 Safe，再让 Safe 执行模块交易

真正发生权限提升的位置是：**adapter 以自己的地址向真实 Safe 发起调用。真实 Safe 看到的是已启用的 adapter，而不是最外层攻击者。** 这是典型的 confused deputy（有权限的代理被不可信调用者驱使），同时包含调用者自证身份、任意外部调用和跨租户权限隔离失败。

已核实的一笔成功交易，从两个 Safe 取得合计 **1,312.908411991068573623 weETH**，其中卖出 **1,312.9 weETH**，偿还原仓位的 **1,335.255802777509633370 WETH** 债务后，向攻击者地址转出 **114.096151469674448809 ETH**。另有 **0.008411991068573623 weETH** 的本笔未卖余额差额，不应被约 114.09 ETH 的标题数字掩盖。详见第六节。

以上结论由[漏洞地址的已验证源码](https://etherscan.io/address/0x16bb8b912da187870c23ec6756bb3fad061283d8#code)、[攻击交易及其 48 条日志](https://etherscan.io/tx/0x75328f916b1a0878724d364da5eb12b255160b894cb36c63ed5d718efc616fc4)、[SlowMist 原始告警](https://x.com/SlowMist_Team/status/2105855276536725599)及[Defimon 原始分析](https://x.com/DefimonAlerts/status/2105695635647144370)交叉支持。金额采用链上原始整数而非新闻摘要或区块浏览器顶部自动摘要。

## 二、事件来源与时间线

研究入口是用户给出的两则 BlockBeats 快讯：[创始人澄清](https://m.theblockbeats.info/flash/370032)、[慢雾攻击通报](https://m.theblockbeats.info/flash/370006)。移动版页面在本次检索中未能直接取得全文，因此技术定论回溯至原始公告、已验证部署源码及链上日志，不将新闻转述当作代码证据。

所有时间均为 UTC；北京时间为 UTC+8。

| 时间 | 事件 | 证据含义 |
|---|---|---|
| 2026-10-01 15:08:47 | 攻击交易所在区块时间，区块 26,098,264 | 链上执行时间；北京时间 10 月 1 日 23:08:47 |
| 2026-10-01 15:08:57 | Defimon 在告警正文中写出的 detected 时间 | 监测系统报告的发现时间，不应替代区块时间 |
| 2026-10-01 16:25:36 | Defimon 原帖发布 | 原始技术通报发布时刻 |
| 2026-10-02 02:59:57 | SlowMist 原帖发布 | 次日披露，故中文快讯的“10 月 2 日”不是攻击执行日期 |
| 2026-10-02 05:25:05 | Stani Kulechov 澄清 | 声明该合约是建立在 Aave 之上的第三方外部适配器，对 Aave V3 无影响 |
| 2026-10-02 06:28:36 | Defimon 回复 Stani | 表示与其原先报告的边界一致 |

[Stani 原帖](https://x.com/StaniKulechov/status/2105891800959598896)与[Defimon 后续回复](https://x.com/DefimonAlerts/status/2105907784743276787)支持“第三方集成层”的边界说明。这里的“对 Aave V3 无影响”应理解为声明及现有证据所指的核心协议边界，不能延伸成“任何使用 Aave 的钱包或集成都没有风险”。

## 三、地址、仓库与模块责任边界

### 3.1 本案关键地址

| 角色 | 地址 | 已确认用途 |
|---|---|---|
| 攻击发起 EOA | `0x42c2633438609881c8fBAb82414eb9A0c45F9353` | 攻击交易发送者及最终 ETH 接收者 |
| 攻击执行合约 | `0xF09168963ac7b31917A02Aa82fA9Cd667F4B67ff` | 外层 Morpho 闪电贷借入者、Aave 债务偿还者、weETH 接收与出售者 |
| 漏洞 adapter | `0x16bb8B912da187870C23eC6756bB3FAd061283d8` | FlashLoopAdapter；两个受害 Safe 的模块成功事件均指向它 |
| Safe A，余额被转出 | `0xE3b23E47dF7cD85876aC6cB05BDb9d7cd5b28520` | 直接转出约 6.426087 weETH |
| Safe B，杠杆仓位被解除 | `0xCFeDF95a3653a128dFC2E4288758A1a1850D169f` | 被代还 WETH 债务，随后退出约 1,306.482325 weETH 抵押物 |
| Aave V3 Pool | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` | 发出 Repay、Withdraw 等日志 |
| Morpho | `0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb` | 真正提供外层 WETH 闪电流动性 |
| WETH | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` | 借入、还债、归还闪电贷及转 ETH 的资产 |
| weETH | `0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee` | 被转走的持仓／抵押资产 |
| Aave aEthweETH | `0xBdfa7b7893081B35Fb54027489e2Bc7A38275129` | 销毁 Safe B 的 aToken 并转出底层 weETH |
| Aave variableDebtEthWETH | `0xea51d7853eefb32b6ee06b1c12e6dcca88be0ffe` | WETH 债务记账代币；Burn 日志需结合利息理解 |
| Velora Augustus V6.2 | `0x6A000F20005980200259B80c5102003040001068` | 本笔变现阶段的聚合交易合约，非漏洞 adapter |

地址和交易角色可在[交易的 Logs / Overview](https://etherscan.io/tx/0x75328f916b1a0878724d364da5eb12b255160b894cb36c63ed5d718efc616fc4)逐条核对。Defimon 称两 Safe 为同一单一 owner 控制；本报告没有历史区块 `getOwners()`/threshold 读取证据，故仅记录为来源声明，不升级为独立链上核实。

### 3.2 代码仓库：查到了什么，没有查到什么

| 代码对象 | 可核验来源 | 对本案的作用与限制 |
|---|---|---|
| **本案 FlashLoopAdapter** | [Etherscan 已验证部署源码](https://etherscan.io/address/0x16bb8b912da187870c23ec6756bb3fad061283d8#code)，文件 `src/FlashLoopAdapter.sol`，207 行 | 本案根因的主要代码证据。页面为 **Exact Match**；solc `0.8.28+commit.7893614a`、优化 200 runs、EVM Cancun；源码 SPDX 标注 MIT |
| FlashLoopAdapter 的原始 GitHub 仓库／提交 | **截至研究截止时间，未找到可以可靠归属到该部署的原始仓库与 commit** | 不把同名示例、第三方复现仓库或 Aave 主仓库冒充它的来源；也不伪造补丁 commit |
| Safe 模块管理 | [safe-fndn/safe-smart-account，v1.4.1 的 ModuleManager.sol](https://github.com/safe-fndn/safe-smart-account/blob/v1.4.1/contracts/base/ModuleManager.sol) | 解释模块白名单与无逐笔 owner 签名执行。Safe B 的当前浏览器页面显示 implementation 为 Safe 1.4.1：`0x41675C099F32341bf84BFc5382aF534df5C7461a`；未做历史存储证明 |
| Aave V3 核心 | [aave-dao/aave-v3-origin 的 Pool.sol](https://github.com/aave-dao/aave-v3-origin/blob/main/src/contracts/protocol/pool/Pool.sol)、[BorrowLogic.sol](https://github.com/aave-dao/aave-v3-origin/blob/main/src/contracts/protocol/libraries/logic/BorrowLogic.sol)、[SupplyLogic.sol](https://github.com/aave-dao/aave-v3-origin/blob/main/src/contracts/protocol/libraries/logic/SupplyLogic.sol) | 用于理解 repay、withdraw、债务与抵押记账的协议语义；这些 `main` 链接可变，本报告**没有证明它们逐字节等于事发区块的 Pool implementation** |
| Morpho 闪电贷 | [morpho-org/morpho-blue，v1.0.0 的 Morpho.sol](https://github.com/morpho-org/morpho-blue/blob/v1.0.0/src/Morpho.sol)及[接口说明](https://github.com/morpho-org/morpho-blue/blob/main/src/interfaces/IMorpho.sol) | 解释 transfer → callback → transferFrom 的外层借还闭环；不表示假 provider 是 Morpho 官方地址 |
| 攻击合约 | [部署地址代码页](https://etherscan.io/address/0xF09168963ac7b31917A02Aa82fA9Cd667F4B67ff#code) | 截止时没有已验证 Solidity 源码，只显示 bytecode。不能声称取得了攻击者原始代码 |

**归属提醒：**漏洞地址页面把创建者 `0x3cbded22f878afc8d39dcd744d3fe62086b76193` 标注为 “Aave: Deployer 21”。这是区块浏览器标签，不等于仓库作者、公司责任或正式产品归属证明。该标签与 Stani 的第三方模块说明不能被草率合并为组织归责结论。本报告的确定结论是代码层级和权限边界；作者、部署运营主体、审计责任仍需额外证据。页面显示“No Contract Security Audit Submitted”也仅代表没有向该页面提交审计，不足以证明“从未审计”。

### 3.3 正常设计应如何工作

正常调用者是持仓 Safe 本身，adapter 作为其已启用模块，原子地完成杠杆循环：

- OPEN：闪借债务资产 → 换成抵押资产 → 为 Safe supply → 可选设置 eMode → Safe 借款 → Safe 把借款交给 adapter → 还闪电贷 → 尘额回 Safe
- CLOSE：闪借债务资产 → 代 Safe 还债 → 由 Safe 调用 Pool.withdraw，把抵押物提到 adapter → 卖抵押物 → 还闪电贷 → 余款回 Safe

正常设计中的关键不变量应是：**本次有权被操作的唯一持仓主体，就是明确授权本次操作的 Safe。** 本案虽然把 `_safe` 设为入口 `msg.sender`，但 `_swap` 的自由目标使执行流可以离开 `_safe`，进入另一个真实 Safe 的权限域。

## 四、逐函数代码分析

以下关键片段直接依据部署地址的 MIT 源码，省略部分以注释标明；行号为 `src/FlashLoopAdapter.sol` 编辑器行号。它们是根因讲解片段，不是可执行攻击程序。

### 4.1 参数全部来自调用方，且入口名未绑定实际操作

`Params` 在约 56–69 行，包括 `op`、`provider`、`providerAddr`、`pool`、`collateral`、`debt`、`flashAmount`、`swapRouter`、`swapCalldata`、`minOut`、`emodeId`、`withdrawAmount`。

87–95 行：

```solidity
function open(Params calldata p) external { _start(p); }
function close(Params calldata p) external { _start(p); }

function _start(Params calldata p) internal {
    if (!ISafe(msg.sender).isModuleEnabled(address(this))) revert ModuleNotEnabled();
    _safe = msg.sender;
    _pending = keccak256(abi.encode(msg.sender, p));
    bytes memory data = abi.encode(p);
    // 随后按 p.provider 调用 p.providerAddr
}
```

问题不是“忘记写 `require`”，而是**检查对象和信任来源不成立**。`ISafe(...)` 只改变 Solidity 的接口视图，不会验证地址是否为真实 Safe。攻击合约只要对这个查询返回 true，就能通过。

`NotSafeOwner()` 虽在源码中声明，但不参与这里的授权。另一个审计细节是 `open()` 与 `close()` 都只做 `_start(p)`，实际分支由 `p.op` 决定；函数名本身不能保证执行 OPEN 或 CLOSE。这是应修正的语义约束，并非本案最核心的盗取原语。

### 4.2 回调哈希保证一致性，不保证授权真实性

`_start()` 根据 `p.provider` 选择 Morpho、Balancer V2 或 Aave Simple 接口，但目标地址仍是调用者提供的 `p.providerAddr`。139–148 行：

```solidity
function _validate(bytes memory data) internal returns (Params memory p) {
    p = abi.decode(data, (Params));
    if (msg.sender != p.providerAddr) revert UntrustedCallback();
    bytes32 h = keccak256(abi.encode(_safe, p));
    if (h != _pending) revert UntrustedCallback();
    _pending = bytes32(0);
}
```

`_pending` 使用 transient storage，且回调消费时清零。它可以防止某些没有对应待执行操作的回调和参数篡改，但验证的是“刚才承诺过同一组参数”。如果承诺的入口、provider 与参数本来就是攻击者控制的，哈希再准确也不会让它们变成授权。

必须区分两层闪电贷：

- **外层真实 Morpho 闪电贷**提供偿还受害仓位债务的真实 WETH，本笔日志可验证
- **内层 adapter 回调流程中的假 provider**是访问控制绕过的一部分；不应把它误写成 Morpho 本身绕过验证或遭到攻击

Aave 回调 `executeOperation()` 另查 `initiator == address(this)`，但这仍不能替代 provider 固定地址／白名单，也不能修复任意 router 调用。实际完整回调子调用序列未由本报告独立 trace 重放，假 provider 机制由原始安全通报与上述源码共同支持。

### 4.3 `_swap()` 把模块执行权限暴露给任意目标

185–195 行：

```solidity
function _swap(address tokenIn, address tokenOut, address router,
               bytes memory data, uint256 minOut)
    internal returns (uint256 got)
{
    IERC20(tokenIn).approve(router, type(uint256).max);
    (bool ok, bytes memory ret) = router.call(data);
    if (!ok) {
        assembly { revert(add(ret, 0x20), mload(ret)) }
    }
    IERC20(tokenIn).approve(router, 0);
    got = IERC20(tokenOut).balanceOf(address(this));
    if (got < minOut) revert SwapMinOut(got, minOut);
}
```

真正危险的是 `router.call(data)`：没有受信 router 列表，没有 selector 约束，没有接收者约束，没有限制目标不能是其他 Safe，调用者身份却是 adapter。

原始告警指出，攻击者将 `router` 指向受害 Safe，令 calldata 表示 `execTransactionFromModule(...)`。这不是在 DEX 上进行恶意报价，而是把“交换步骤”替换成一个钱包执行入口。

金额或滑点检查不能修复权限问题：

- `tokenIn`、`tokenOut`、`minOut` 都来自参数，未绑定受信市场和资产
- `got` 是 adapter 的**总余额**，不是本次交换的余额增量，已有余额可能污染结果
- 事后撤销 ERC-20 allowance，只撤回 token allowance；它不会撤销 adapter 在其他 Safe 内的模块权限
- 低级调用返回 `ok == true` 只说明目标 EVM 调用未回滚，不等同于任意 ABI 返回值为 true；本案两个 Safe 的成功事件另外证明了实际模块操作成功

上述余额增量、资产校验、返回值语义属于代码审计发现和加固点；不应未经重放就断言它们都被本次交易实际利用。

### 4.4 Safe 为什么会执行：身份没有伪造，权限被代理复用

Safe 1.4.1 的 `ModuleManager.execTransactionFromModule` 关键授权逻辑是：

```solidity
require(msg.sender != SENTINEL_MODULES && modules[msg.sender] != address(0), "GS104");
success = execute(to, value, data, operation, type(uint256).max);
```

此时 `msg.sender` 是真实 adapter 地址。只要受害 Safe 之前启用了它，Safe 按其模块设计即可执行，无须逐笔收集 owner 签名。[Safe v1.4.1 源码](https://github.com/safe-fndn/safe-smart-account/blob/v1.4.1/contracts/base/ModuleManager.sol)明确描述了模块的高权限性质。

因此应写作“adapter 的授权被第三方输入滥用”，不应写作“攻击者假装成 Safe owner 签名”或“Safe 接受了假 Safe 的身份”。这两种说法都错置了授权检查发生的位置。

还要注意：adapter 的正常 `_moduleExec()` 使用操作类型 `0`（CALL），但攻击者控制的 `_swap` calldata 进入的是另一个入口，不能因为正常辅助函数固定 CALL 就认定整个 adapter 没有更广的调用风险。本案已证明的资产转移无需推定发生 DELEGATECALL。

### 4.5 Aave 为什么允许解除仓位

正常 `_run()` CLOSE 分支在 171–182 行先 `repay`，再通过 Safe 发起 `withdraw`。本案日志显示攻击执行合约实际代 Safe B 还债，之后 Safe B 的身份发起抵押物提现。

Aave 的语义允许第三方代他人偿债；而提现归属于调用者的仓位。通过已启用模块让 Safe 自己调用 Pool 后，Aave 看到的提现主体就是持仓 Safe。**攻击先消除债务约束，再利用模块权限转出权益；不是绕过 Aave 的健康因子去无抵押提款。**

源码参考：[Pool 的 repay / withdraw 接口流](https://github.com/aave-dao/aave-v3-origin/blob/main/src/contracts/protocol/pool/Pool.sol)、[BorrowLogic 的偿债处理](https://github.com/aave-dao/aave-v3-origin/blob/main/src/contracts/protocol/libraries/logic/BorrowLogic.sol)。实际金额与事发行为以本案日志为准，而非当前主分支实现。

## 五、完整攻击链与模块交互

### 5.1 信任边界图

```text
攻击者 EOA
  │ 发起单笔交易
  ▼
攻击执行合约 ──真实闪电贷──► Morpho
  │                           │ 真实 WETH
  ◄───────────────────────────┘
  │ 用真实 WETH 代 Safe B 偿还 Aave 债务
  ├──────────────────────────► Aave Pool
  │
  │ 伪造 Safe 查询结果，控制 provider/参数
  ▼
FlashLoopAdapter.open/close → _start → 假 provider → callback → _validate
  │
  │ _swap: router.call(data)，此处 msg.sender 身份为 adapter
  ├──────────────► Safe A.execTransactionFromModule → weETH.transfer
  └──────────────► Safe B.execTransactionFromModule → Aave.withdraw
                      ▲
                      └─ Safe 检查并认可已启用的 adapter

取得 weETH → Velora 聚合交易 → Curve / Fluid / Uniswap 路由 → WETH
  │
  ├─ 归还 Morpho 闪电贷本金
  └─ WETH.withdraw → ETH → 攻击者 EOA
```

图中“假 provider → callback”的内部调用细节来自安全团队原始分析加部署源码验证；真实代币路径和两个 Safe 的模块成功则由日志直接确认。此图是语义重建，不冒充完整 opcode 级 call trace。

### 5.2 按链上顺序复盘

1. **取得流动性。**执行合约从 Morpho 借入 11,537.239738536922710940 WETH；日志 1014 的 FlashLoan 与 1015 的 WETH Transfer 一致
2. **偿还 Safe B 的债务。**日志 1021 中 user 为 Safe B、repayer 为攻击执行合约、`useATokens=false`，偿债 1,335.255802777509633370 WETH
3. **转走 Safe A 的钱包余额。**日志 1022 把 6.426087021311600894 weETH 从 Safe A 转到攻击合约；紧随其后的 1023 为 `ExecutionFromModuleSuccess`，module 是漏洞 adapter
4. **取出 Safe B 的抵押物。**日志 1025–1029 为 aToken 销毁、底层 weETH 转出、抵押启用状态关闭和 Withdraw；提现接收者是攻击合约，金额 1,306.482324969756972729 weETH。1030 再次证明该操作由漏洞 adapter 的模块权限完成
5. **变现。**聚合器获准使用 weETH，实际从攻击合约转出 1,312.9 weETH，拆分经 Curve、Fluid、Uniswap V3 和 Uniswap V4／wstETH 路径，最终 1,449.351954247184082179 WETH 回到攻击合约
6. **归还本金。**1059 的 WETH Transfer 向 Morpho 归还完整 11,537.239738536922710940 WETH
7. **提走剩余收益。**1060 将 114.096151469674448809 WETH 解包为 ETH；Internal Txns 显示同额 ETH 最终进入发起 EOA

其中 Safe A 是直接代币转账，Safe B 是解除 Aave 仓位。不能把两个 Safe 都描述为“从 Aave 提款”。

## 六、资金核算：四类数字必须分开

### 6.1 原始日志账本

下表均来自[同一笔交易](https://etherscan.io/tx/0x75328f916b1a0878724d364da5eb12b255160b894cb36c63ed5d718efc616fc4)；编号是浏览器显示的链上日志序号。

| 日志 | 项目 | 原始数量，按 18 位 decimals 换算 |
|---|---|---:|
| 1014、1015 | Morpho 闪电贷本金 | 11,537.239738536922710940 WETH |
| 1020、1021 | 实际支付给 Aave 的债务偿还 | 1,335.255802777509633370 WETH |
| 1022 | Safe A 转出的 weETH | 6.426087021311600894 weETH |
| 1027、1029 | Safe B 提现的底层 weETH | 1,306.482324969756972729 weETH |
| 1033 | 实际卖出的 weETH | 1,312.900000000000000000 weETH |
| 1058 | 变现后收到的 WETH | 1,449.351954247184082179 WETH |
| 1059 | 归还 Morpho | 11,537.239738536922710940 WETH |
| 1060及内部转账 | 转入攻击者 EOA 的 ETH | 114.096151469674448809 ETH |
| 交易费用字段 | 本笔 gas 成本 | 0.003920424526807740 ETH |

### 6.2 可复核等式

```text
取得的 weETH 总量
= 6.426087021311600894 + 1306.482324969756972729
= 1312.908411991068573623 weETH

本笔未卖出差额
= 1312.908411991068573623 - 1312.900000000000000000
= 0.008411991068573623 weETH

本笔兑现所得，未扣 gas
= 1449.351954247184082179 - 1335.255802777509633370
= 114.096151469674448809 ETH

仅扣本笔 gas 后的 ETH 净流入
= 114.096151469674448809 - 0.003920424526807740
= 114.092231045147641069 ETH
```

闪电贷本金同时进入并离开，不构成损失：未用于还 Aave 债务的本金为 10,201.983935759413077570 WETH，与变现收入一起足以归还 Morpho。不能将约 11,537 WETH 的临时流动性、约 1,313 weETH 的毛抵押物或约 1,335 WETH 的债务清偿直接写成攻击者利润。

“扣本笔 gas 后”不是完整犯罪收益核算：尚未计入部署、预备交易、其他交易成本，也不含剩余 weETH 的估值。剩余 weETH 是本笔账本差额；截止时攻击合约页面仍显示 1 种 token 持有，但未用历史余额证明和后续全量转账审计断言它永久停留于此。

### 6.3 为什么浏览器顶部摘要和 Burn 数字会误导

Etherscan 顶部自动行动摘要显示过“Burn 1,306.48 variableDebtEthWETH and Withdraw 1,306.48 weETH”。这个摘要不能用来代替原始事件。

- 债务 Burn（1018）`value = 1329.536830578102452349`
- 同一事件 `balanceIncrease = 5.718972199407181021`
- 两者相加恰等于 Repay 实际金额 **1335.255802777509633370 WETH**

这里应解释为结合利息增量理解债务销毁事件，不能无证据把 1,329.5368 称为“实际偿债额”或“scaled supply”。

aEthweETH 也有类似差异：1026 的 Burn.value 为 1,306.482262583889567736，balanceIncrease 为 0.000062385867404993，两者合计正好是底层实际 Withdraw 的 1,306.482324969756972729 weETH。

美元数字还会受到浏览器**查看时价格**影响。原始告警约 30.5 万美元只能作为当时估值；本报告不把当前浏览器的美元显示反推为事发成交估值。

### 6.4 变现路径细分

| 路径 | weETH 输入 | 主要输出／证据 |
|---|---:|---|
| Curve weeth-ng | 183.861141800000000000 | 202.977330356716748334 WETH；日志 1034–1036 |
| Fluid weETH–ETH | 945.295877400000000000 | 1,043.532304139726 ETH，再包装为 WETH；1038–1043 |
| Uniswap V3 weETH 2 | 157.484980800000000000 | 173.856897917080333842 WETH；1044–1046 |
| Uniswap V4 → wstETH → Fluid | 26.258000000000000000 | 23.292178706101257912 wstETH，再换 28.985421833661 ETH/WETH；1047–1057 |

四路 weETH 输入之和为 1,312.9。Curve 输出转入聚合器的日志与池输出存在 3 wei 差值，故总变现收入以聚合器最终向攻击合约的 1058 Transfer 为准，不靠四舍五入表格推导。上述 DEX 是变现路径；现有证据没有显示这些 DEX 的合约在本案存在漏洞。

## 七、风险范围与不应外推的结论

### 已被证据支持

- 部署地址的 adapter 具有可被不可信来访者触达的任意调用路径
- 两个 Safe 在攻击时认可该 adapter 的模块权限；两个模块成功事件是直接证据
- 本笔交易成功使用代还债务与模块提款结合，盗取仓位权益
- 无需取得受害 Safe 的逐笔 owner 签名，也无需以 ERC-20 allowance 作为唯一盗取通道

### 不能仅凭本案推定

- “全部 Aave 用户受影响”：未启用此模块的地址不满足相同前提
- “所有 Safe 都能被攻击”：攻击依赖对应 module 授权及其他执行条件
- “只有两 Safe 有风险”：本案只证明这两个实际受害对象，没有完成全网模块安装盘点
- “没有剩余风险、已经修复”：尚未核到官方补丁、停用清单、修复部署或用户完整迁移证明
- “Aave 官方仓库包含该 bug”：未找到与该部署对应的原始仓库 commit
- “多签密钥被盗、预言机被操纵、发生重入盗取”：现有证据不需要这些假设，不能为了套常见攻击模板而添加

从代码能力看，任意目标调用以高权限模块身份执行，可产生比本笔 ERC-20 转账和仓位退出更宽的风险。那是**潜在能力评估**，不是已经发生其他接管行为的证据。

## 八、修复建议与应急处置

本节为基于源码提出的修复设计，**不是已经发布、审计或部署的官方补丁**。

### P0：先撤掉危险权限，再谈界面暂停

- 受影响 Safe owner 应使用可信 Safe 管理界面或经审查的交易撤销该 adapter 的 module 授权，并确认链上状态变化
- 仅停止前端、撤 ERC-20 allowance 或把 adapter 当前余额清空都不够；真正能力位于 Safe 的模块列表
- 盘点启用同一部署及等价危险实现的 Safe，检查异常模块执行、资产余额、仓位状态和可能的设置变化
- 撤销／迁移本身也有签名和交易风险，应由真实 owner 按正常授权流程操作

### P1：消除高权限任意调用原语

优先把“具有 Safe 模块权限的执行器”和“处理外部 DEX calldata 的换币器”隔离：

1. 不允许有模块身份的 adapter 直接对任意地址调用任意 bytes
2. 将 router、pool、asset、selector 限定到经过验证的策略集合
3. 对允许 router 的 calldata 做结构化验证，包括 tokenIn/out、实际资金接收者、spender、amount、deadline 和嵌套命令
4. 对可自由转发／multicall 的路由尤其谨慎：仅白名单 router 地址，不校验它的内部执行能力，仍可能把任意调用重新引入
5. 操作必须绑定当前授权 Safe；任何其他 Safe 都不能成为该操作的权限受益或支出主体

仅禁止 `router == _safe` 不够，因为本案攻击的是**另一个**受害 Safe；仅验证“调用者是真实 Safe”也不够，攻击者可以拥有真实 Safe，仍不应能驱使 adapter 操作其他钱包。

### P1：建立可信会话与回调边界

- provider 按链和 Provider 类型映射到固定可信地址，不接受任意 `providerAddr`
- pool 与资产对采用受信配置，避免攻击者用伪造 IERC20／Pool 响应满足业务校验
- 将 Safe、操作类型、provider、资产、金额、参数、nonce 和 deadline 明确绑定授权
- 回调校验 `provider` 类型、地址、asset、amount、fee 以及 active session；消费会话后不允许重复使用
- 正常 OPEN/CLOSE 入口分别固定操作类型，不让函数名与实际路径分离
- 使用符合回调设计的状态机防止会话被并发／嵌套覆盖；普通 nonReentrant 不能不加区分地把合法闪电贷回调一并阻断

### P2：资金会计与可观测性

- `got` 应使用本次可信 tokenOut 的余额增量，不能使用总余额冒充 swap 产出
- 使用与 token 行为匹配的安全转账和授权封装；只给最小必要 allowance，并在完成后撤销
- 核对 repay 返回值、withdraw 实际到账及偿还义务，明确尘额归属，不能扫走其他会话的资产
- 记录足够的操作事件：Safe、session、provider、pool、资产、路由、实际输入输出和结果
- 针对 module 执行建立监控；只看 Safe 常规签名交易无法完整覆盖模块通道

特别是 Safe 1.4.1，不能直接照搬新版本主分支的“module guard”能力假设。需要按实际实现和可部署防护层设计限制，并经测试确认；模块自身限权和安全架构不能省略。

## 九、修复后的回归测试矩阵

推荐在本地隔离测试及固定历史区块 fork 中验证，不能只跑正常路径。以下是验收要求，**本报告没有宣称这些测试已经执行**。

| 测试 | 预期安全结果 |
|---|---|
| 伪造合约对 isModuleEnabled 恒返 true | 不能获得任何真实 Safe 的执行权限 |
| 攻击者持有真正 Safe，并启用模块 | 只能操作该次明确授权的自己的 Safe |
| router 设为另一 Safe | 在外部调用发生前拒绝 |
| router 支持 multicall／任意 target 命令 | 所有嵌套目标和接收者仍受策略限制 |
| providerAddr 换成攻击合约 | 拒绝，不进入受信回调状态 |
| provider 正确但 token／amount／fee 不匹配 | 回调拒绝 |
| 没有 pending session 的 callback | 拒绝 |
| 消费同一 session 后再次 callback | 拒绝 |
| 在 router 中重入 open/close 覆盖 _safe | 拒绝或由隔离状态机正确处理 |
| OPEN 入口携带 CLOSE op，反之亦然 | 拒绝或参数中根本不存在可变 op |
| swap 前预置 tokenOut 余额 | 不能用于虚报本次 minOut |
| 假 token 的 balanceOf/approve 伪造成功 | 不被受信资产配置接受 |
| Safe module 已停用 | 任意模块操作均失败，无资金残留 |
| 合法 Morpho / Balancer / Aave 回调流程 | 正常完成，同时保持所有负向测试有效 |
| 部分还债、部分提现和小额舍入 | 债务、aToken、底层资产、尘额与事件相符 |
| 调用目标返回 false 但不 revert | 上层按真实 ABI 语义判失败，不能仅依赖 CALL 成功位 |

核心属性测试应覆盖：对任意攻击者输入，其他 Safe 的余额、债务、owner、threshold、module 列表和执行结果都不得被无授权改变。单测只证明“交易不回滚”远远不够。

## 十、证据强度与未决事项

| 结论层级 | 本报告完成的核查 |
|---|---|
| 一级：部署与交易 | 直接读取漏洞部署 Exact Match 页面、代码编辑器关键函数及行号；直接读取攻击交易 Overview、48 条 decoded logs、内部 ETH 转账 |
| 二级：来源交叉确认 | SlowMist、Defimon 原始公开通报；Stani 原帖及 Defimon 回复 |
| 三级：协议语义参考 | Safe v1.4.1、Morpho v1.0.0 和 Aave V3 官方仓库代码，用于解释权限与资金流程 |
| 尚未完成 | 原始 adapter GitHub commit 归属；独立重新编译与 bytecode 比对；攻击合约原始源码；完整零价值 call trace；历史 Safe owners/module 列表存储证明；主网 fork 重放；全网受影响钱包和后续资金去向盘点；修复部署确认 |

Etherscan 的 Internal Txns 页面在本次检查时提示零价值高级调用视图尚不可用，只展示 6 条带 ETH 价值的内部转移。因此报告将**源码可证明的能力、安全团队报告的内部机制、链上日志直接确认的资产结果**分别表述，不把三者混成“所有调用均已经独立重放验证”。

如果后续补全，优先取得事发前固定区块状态与完整 trace，确认每一层 provider、fake Safe、token/pool stub 和路由参数，再将复盘升级为可重复的历史 fork 测试；修复有效性必须以新部署、测试结果和实际授权迁移为准。

## 十一、可迁移的审计结论

这次事件最值得记住的并不是“闪电贷很危险”，而是：

> 一个同时服务多个钱包、并被这些钱包授予高权限的模块，只要把自己的调用身份借给不可信输入，就可能把单个入口问题扩散为跨钱包权限问题。

哈希防篡改、回调 sender 检查、滑点参数和多签钱包分别解决不同问题。它们不能替代“谁授权了这次操作、允许动用哪个主体的资产、能调用哪些外部能力”这三个最基本的边界。

本案的真正修复方向是最小权限、可信参数来源、受控外部调用和跨 Safe 隔离，而不是简单增加一个布尔检查或把所有责任归到基础借贷协议。

## 来源索引

1. [BlockBeats：用户提供的创始人澄清快讯入口](https://m.theblockbeats.info/flash/370032)
2. [BlockBeats：用户提供的慢雾快讯入口](https://m.theblockbeats.info/flash/370006)
3. [SlowMist 原始 X 告警](https://x.com/SlowMist_Team/status/2105855276536725599)
4. [SlowMist Hacked 事件数据库](https://hacked.slowmist.io/)
5. [Defimon 原始 X 分析](https://x.com/DefimonAlerts/status/2105695635647144370)
6. [Stani 原始澄清](https://x.com/StaniKulechov/status/2105891800959598896)
7. [Defimon 对澄清的回复](https://x.com/DefimonAlerts/status/2105907784743276787)
8. [攻击交易、Logs 与 Internal Txns](https://etherscan.io/tx/0x75328f916b1a0878724d364da5eb12b255160b894cb36c63ed5d718efc616fc4)
9. [FlashLoopAdapter 已验证部署源码](https://etherscan.io/address/0x16bb8b912da187870c23ec6756bb3fad061283d8#code)
10. [攻击执行合约代码页，未验证源码](https://etherscan.io/address/0xF09168963ac7b31917A02Aa82fA9Cd667F4B67ff#code)
11. [Safe B 代理与当前实现页面](https://etherscan.io/address/0xcfedf95a3653a128dfc2e4288758a1a1850d169f#code)
12. [Safe v1.4.1 ModuleManager.sol](https://github.com/safe-fndn/safe-smart-account/blob/v1.4.1/contracts/base/ModuleManager.sol)
13. [Aave V3 Origin Pool.sol](https://github.com/aave-dao/aave-v3-origin/blob/main/src/contracts/protocol/pool/Pool.sol)
14. [Aave V3 Origin BorrowLogic.sol](https://github.com/aave-dao/aave-v3-origin/blob/main/src/contracts/protocol/libraries/logic/BorrowLogic.sol)
15. [Aave V3 Origin SupplyLogic.sol](https://github.com/aave-dao/aave-v3-origin/blob/main/src/contracts/protocol/libraries/logic/SupplyLogic.sol)
16. [Morpho Blue v1.0.0 Morpho.sol](https://github.com/morpho-org/morpho-blue/blob/v1.0.0/src/Morpho.sol)

---

研究范围：公开已发生事件的复盘。源码片段用于解释已公开漏洞；修复方案仍需独立测试与审计。

[返回日期索引](../README.md#2026-10-02)
