# 站内语言构建

中文 Markdown 是唯一文章源码。繁体使用本地 OpenCC；英文由公开仓库的标准 GitHub Actions CPU runner 在构建时运行开源模型生成，不调用在线翻译 API，不要求 API key、信用卡、新账户或额外 Secrets。

英文只存在于 `_site/i18n/en/` 部署产物与按来源哈希隔离的构建缓存。`.translation/`、`_site/`、模型权重均不提交。浏览器只从本站加载语言包，不把文章发送到外部服务。

## 固定依赖

- 模型：[Qwen/Qwen2.5-7B-Instruct-GGUF](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF/tree/bb5d59e06d9551d752d08b292a50eb208b07ab1f)，revision `bb5d59e06d9551d752d08b292a50eb208b07ab1f`，Q4_K_M，Apache-2.0
- 运行库：[llama.cpp b11146](https://github.com/ggml-org/llama.cpp/releases/tag/b11146)，MIT
- 模型与官方 CPU 二进制的下载地址、字节数和 SHA256 记录于 `scripts/translation-config.json`，运行前验证
- 不加载远端模型代码；模型权重只下载到 runner 临时目录，不放入 Pages artifact 或 Actions cache
- 工作流 Actions 固定到提交 SHA；Node 依赖使用已有锁文件及 `npm ci --ignore-scripts`

GitHub 当前对公开仓库标准 runner 不收执行分钟费用；这不代表免费存储无限。英文文本缓存有体积上限，Pages 与测试文本 artifact 仅保留一天，不使用付费 larger runner。政策变化时需重新核对：[GitHub Actions 计费说明](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions)

## 质量与安全

- 只扫描本仓库原有构建允许的公开日期文章，不读取其他仓库或私人研究稿
- 以完整段落为翻译单位；链接、代码、HTML 标签、地址和完整日期使用不可变占位符保护。数值、百分号和币名保留在上下文中并逐项核验，不遮掉判断金融含义所需的信息
- 校验占位符顺序、数值、名称、损失用语、未核实语气与未翻译文字；模型输出先转义，再恢复原始受控标记
- 不使用整句英文替换来掩盖模型问题；允许保护后的日期做自然语序调整，HTML 结构顺序仍须不变
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


## Experimental status (2026-10-03)

Financial translation quality remains blocked. Neither Qwen3-4B nor Qwen2.5-7B passed the manual financial-meaning review; mechanical preservation alone did not establish correctness. Public main still has English disabled. No full-site English generation or deployment has been performed.

A bounded five-paragraph MADLAD-400 3B experiment uses a translation-specific encoder-decoder model, not another chat prompt. The official Google model revision and all model/config/tokenizer files are fixed by SHA256 in `scripts/madlad-config.json`. This does not assert that the model is suitable for financial publication.

Runtime caveat: official Candle 0.9.1 (and inspected current upstream) uses bidirectional relative-position buckets for the quantized T5 decoder and omits one encoder-distance clamp. The probe applies a minimal, disclosed source-only correction matching the official Transformers v4.23.1 T5 reference. Over 500,000 encoder/decoder position cases cover direction, boundaries, long distances, and explicit decoder identity with caching disabled. The official crate checksum, patch, model config, exact inputs, raw output token IDs, decoded output, timing, stderr and review diagnostics are retained as a one-day evidence artifact. Model weights are never uploaded. Bare tokenizer JSON lacks special-token registration, so raw output is retained and only a known terminal EOS ID is removed from display text.

HTML tags and URL attributes are retained in an AST sidecar; this small experiment translates complete visible paragraphs and does not claim to reconstruct deployable markup. Inputs exceeding 512 tokens are rejected without splitting or truncation. Generation has a 512-token cap and must reach EOS. There are no chat instructions or automatic retry diagnostics in translation input.

Attribution: MADLAD-400 is by the Google research authors (Kudugunta et al., 2023); the GGUF quantization was contributed by Juarez Bochi and subsequently included in the Google repository. The current official model card labels the model Apache-2.0, whereas the original paper appendix describes ODC-BY. Both permit commercial use with attribution, but the differing documentation is preserved here rather than represented as resolved. Sources: https://huggingface.co/google/madlad400-3b-mt and https://arxiv.org/abs/2309.04662. Candle is MIT OR Apache-2.0. Runtime patch reference: https://github.com/huggingface/transformers/blob/v4.23.1/src/transformers/models/t5/modeling_t5.py.


The first MADLAD run hit its 15-minute inference bound without completing a paragraph; model loading itself took 0.67 seconds. The standalone crate had omitted the official Candle workspace's `-C target-cpu=native` setting, disabling its AVX Q4_K path. That build omission is corrected for one bounded retry, which records actual compiler CPU features and flushes encoding/decode progress including partial token IDs every 16 tokens. The timeout does not establish a translation-quality result.
