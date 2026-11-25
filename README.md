# 奥格登 850 · 基础英语词库

依据 C. K. Ogden（查尔斯·凯·奥格登，1889–1957）1930 年发明的 **Basic English（基础英语）** 官方 850 核心词表构建的中文学习网站。零依赖纯静态站点：HTML + CSS + 原生 JS，Hash 路由（`#/`）。

## 运行

```bash
# 方式一：任意静态服务器
python3 -m http.server 8500
# 打开 http://localhost:8500/

# 方式二：直接双击 index.html（无模块加载，file:// 亦可运行）
```

## 功能

| 页面 | 路由 | 功能 |
|---|---|---|
| 首页 | `#/` | 850 编号 + 五张词单账目表 + 导引 |
| 词表 | `#/words` | 五类分类浏览 + 国际词附表、中英搜索、字母索引、生词本标记 |
| 单词详情 | `#/word/:id` | IPA 音标、发音（Web Speech API）、双语例句（全部 850 词）、反义词互链、词族派生、学习状态与复习排期、上/下一词 |
| 闪卡 | `#/flashcards` | 翻卡自测（卡背带音标）、英↔中双向、分类/乱序、进度记忆、键盘操作（空格/方向键/1/2） |
| 测验 | `#/quiz` | 英→中、中→英选择题与拼写练习，每轮 10 题，成绩入档 |
| 复习 | `#/review` | 间隔重复队列（Leitner 简化版）：学过的词自动排期，忘记→1 天、模糊→2 天、记得→间隔翻倍（上限 60 天）；导航栏显示到期角标 |
| 词族扩展 | `#/expansion` | 构词规则统计（850 词根 → 1,197 新词形）、任意词根词族查询、50 组合成词表 |
| 语法 | `#/grammar` | 11 条构词与语法规则（中英对照） |
| 关于 | `#/about` | 奥格登生平、年表、著作、语义三角图 |
| 进度 | `#/progress` | 总/分类进度、复习到期数、生词本、测验记录、**进度导出/导入（JSON）**、数据重置 |

学习进度（已学/掌握/生词本/测验记录/复习排期/主题）保存在浏览器 localStorage（键 `ogden850.v1`），不上传；可通过进度页导出 JSON 备份、在其它设备导入恢复。

## 数据

850 词以 [Simple English Wikipedia 存档的官方 Ordered Wordlist](https://simple.wikipedia.org/wiki/Wikipedia:Basic_English_ordered_wordlist) 为准：

- 操作词 100（动词 18 + 方位词 20 + 连接与比较 5 + 限定与代词 17 + 连词与疑问 11 + 副词 13 + 程度词 8 + 时间词 2 + 方位名词与礼貌语 6）
- 通用名词 400、可见图名词 200
- 一般形容词 100、反义形容词 50（37 个在 850 词内互为反义）
- 附：国际词 200（※ 因数据源网络受限，此清单按 Ogden 国际词表收词传统整理，尚未逐词核对官方原表；如需精确版请对照 basic-english.org）

IPA 音标采用英式牛津学习词典风格，全部 850 词覆盖；例句为全部 850 词的简短双语句子。

## 数据

850 词以 [Simple English Wikipedia 存档的官方 Ordered Wordlist](https://simple.wikipedia.org/wiki/Wikipedia:Basic_English_ordered_wordlist) 为准：

- 操作词 100（动词 18 + 方位词 20 + 连接与比较 5 + 限定与代词 17 + 连词与疑问 11 + 副词 13 + 程度词 8 + 时间词 2 + 方位名词与礼貌语 6）
- 通用名词 400、可见图名词 200
- 一般形容词 100、反义形容词 50（37 个在 850 词内互为反义）

## 目录

```
index.html          入口
css/style.css       设计系统（冷粉笔纸 / 普鲁士墨 / 剑桥灰绿 / 朱红印章）
js/data/            850 词数据、国际词附表、IPA 音标、双语例句、索引
js/                 store（进度+SRS）/ speech（发音）/ derive（派生）/ router / app
js/views/           各页面视图（含 review 复习页）
tools/validate.js   数据校验（数量 / 去重 / 反义回链 / 音标例句覆盖 / 字母序）
tools/smoke.js      视图冒烟测试（Node 模拟 DOM，含 SRS 与导入导出）
```

## 测试

```bash
node tools/validate.js   # 词数与数据完整性
node tools/smoke.js      # 全视图渲染/挂载冒烟
```
