# 站内语言构建

中文 Markdown 是唯一文章源码。繁体使用本地 OpenCC；英文由公开仓库的标准 GitHub Actions CPU runner 在构建时运行开源模型生成，不调用在线翻译 API，不要求 API key、信用卡、新账户或额外 Secrets。

英文只存在于 `_site/i18n/en/` 部署产物与按来源哈希隔离的构建缓存。`.translation/`、`_site/`、模型权重均不提交。浏览器只从本站加载语言包，不把文章发送到外部服务。

## 固定依赖

- 模型：[Qwen/Qwen3-4B-GGUF](https://huggingface.co/Qwen/Qwen3-4B-GGUF/tree/bc640142c66e1fdd12af0bd68f40445458f3869b)，revision `bc640142c66e1fdd12af0bd68f40445458f3869b`，Q4_K_M，Apache-2.0
- 运行库：[llama.cpp b11146](https://github.com/ggml-org/llama.cpp/releases/tag/b11146)，MIT
- 模型与官方 CPU 二进制的下载地址、字节数和 SHA256 记录于 `scripts/translation-config.json`，运行前验证
- 不加载远端模型代码；模型权重只下载到 runner 临时目录，不放入 Pages artifact 或 Actions cache
- 工作流 Actions 固定到提交 SHA；Node 依赖使用已有锁文件及 `npm ci --ignore-scripts`

GitHub 当前对公开仓库标准 runner 不收执行分钟费用；这不代表免费存储无限。英文文本缓存有体积上限，Pages 与测试文本 artifact 仅保留一天，不使用付费 larger runner。政策变化时需重新核对：[GitHub Actions 计费说明](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions)

## 质量与安全

- 只扫描本仓库原有构建允许的公开日期文章，不读取其他仓库或私人研究稿
- 以完整段落为翻译单位；链接、代码、HTML 标签、数字、日期、金额、币名和标识符使用不可变占位符保护
- 校验占位符顺序、数值、名称、损失用语、未核实语气与未翻译文字；模型输出先转义，再恢复原始受控标记
- 精确金融短语使用小型术语表 `scripts/translation-glossary.json`，例如把“每小时预览”作为名词而非下降频率，把“减完整额外费用”明确保留为减法。术语表不存储整篇译文
- 模型/提示/术语版本和源文本哈希进入缓存键；修改原文会自动失效，不复用旧译文
- 语言包必须完整且匹配当前页面来源哈希。缺失、离线、结构改变或过期时显示中文并明确提示，不把中文冒充英文
- 英文页面持续显示机器翻译提醒。校验器无法证明语义完全准确；发布前必须人工检查实际金融段落，尤其兑换方向、否定、条件、历史资格与损益

## 本地验证

1. `npm ci --ignore-scripts`
2. `BUILD_ENGLISH=1 node scripts/build.mjs`
3. `node scripts/test.mjs && node scripts/test-ui.mjs && node scripts/test-navigation.mjs && node scripts/test-language.mjs`
4. `node scripts/prepare-english.mjs && python3 scripts/test-translation.py`
5. 在内存足够的 Linux x64 环境运行 `bash scripts/setup-translation.sh`，随后 `python3 scripts/translate-english.py --sample`，先人工核验样例
6. 全量/增量运行完成后使用 `node scripts/assemble-english.mjs && node scripts/test-english-build.mjs` 生成并检验语言包

不得仅因机械测试通过就跳过首次模型的语义验收。普通中文构建不设置 `BUILD_ENGLISH=1`，继续保持英文入口不可用。
