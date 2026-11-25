/* 150 形容词 Qualities — 100 一般 + 50 反义
   一般：[单词, 中文]；反义：[单词, 中文, 词表内反义词] */
window.OGDEN_DATA = window.OGDEN_DATA || {};
OGDEN_DATA.qualities = [
  ["able", "有能力的；能干的"], ["acid", "酸的；酸性的"], ["angry", "生气的；愤怒的"], ["automatic", "自动的"], ["beautiful", "美丽的；漂亮的"],
  ["black", "黑色的；黑"], ["boiling", "沸腾的；滚烫的"], ["bright", "明亮的；聪明的"], ["broken", "破的；断裂的"], ["brown", "棕色的；褐色的"],
  ["cheap", "便宜的；廉价的"], ["chemical", "化学的"], ["chief", "主要的；首要的"], ["clean", "干净的；清洁的"], ["clear", "清楚的；晴朗的"],
  ["common", "普通的；常见的"], ["complex", "复杂的"], ["conscious", "有知觉的；清醒的"], ["cut", "切开的；割下的"], ["deep", "深的；深刻的"],
  ["dependent", "依赖的；从属的"], ["early", "早的；早期的"], ["elastic", "有弹性的"], ["electric", "电的；电动的"], ["equal", "相等的；平等的"],
  ["fat", "肥的；胖的"], ["fertile", "肥沃的；多产的"], ["first", "第一的；最初的"], ["fixed", "固定的；确定的"], ["flat", "平的；扁平的"],
  ["free", "自由的；免费的"], ["frequent", "频繁的；经常的"], ["full", "满的；充分的"], ["general", "一般的；总的"], ["good", "好的"],
  ["great", "大的；伟大的"], ["gray", "灰色的"], ["hanging", "悬挂的；垂下的"], ["happy", "快乐的；幸福的"], ["hard", "硬的；困难的"],
  ["healthy", "健康的"], ["high", "高的"], ["hollow", "空的；中空的"], ["important", "重要的"], ["kind", "仁慈的；和蔼的"],
  ["like", "相似的；同样的"], ["living", "活着的"], ["long", "长的；长久的"], ["male", "男性的；雄的"], ["married", "已婚的"],
  ["material", "物质的"], ["medical", "医学的；医疗的"], ["military", "军事的"], ["natural", "自然的；天然的"], ["necessary", "必要的；必需的"],
  ["new", "新的"], ["normal", "正常的；正规的"], ["open", "开着的；开放的"], ["parallel", "平行的"], ["past", "过去的；从前的"],
  ["physical", "身体的；物质的"], ["political", "政治的"], ["poor", "贫穷的；可怜的"], ["possible", "可能的"], ["present", "现在的；出席的"],
  ["private", "私人的；私下的"], ["probable", "很可能的"], ["quick", "快的；迅速的"], ["quiet", "安静的；轻声的"], ["ready", "准备好的"],
  ["red", "红色的"], ["regular", "规则的；经常的"], ["responsible", "负责的；可靠的"], ["right", "正确的；右边的"], ["round", "圆的"],
  ["same", "相同的"], ["second", "第二的；另一的"], ["separate", "分开的；单独的"], ["serious", "严重的；认真的"], ["sharp", "锋利的；尖锐的"],
  ["smooth", "光滑的；平滑的"], ["sticky", "黏的"], ["stiff", "硬挺的；僵硬的"], ["straight", "直的；笔直的"], ["strong", "强的；强壮的"],
  ["sudden", "突然的"], ["sweet", "甜的"], ["tall", "高的；身量高的"], ["thick", "厚的；粗的；浓的"], ["tight", "紧的；牢固的"],
  ["tired", "疲劳的；累的"], ["true", "真的；真实的"], ["violent", "猛烈的；狂暴的"], ["waiting", "等待的；侍候的"], ["warm", "暖和的；温暖的"],
  ["wet", "湿的"], ["wide", "宽的；宽阔的"], ["wise", "有智慧的；明智的"], ["yellow", "黄色的"], ["young", "年轻的；幼的"]
];
OGDEN_DATA.opposites = [
  ["awake", "醒着的", null], ["bad", "坏的", "good"], ["bent", "弯的；弯曲的", "straight"], ["bitter", "苦的", "sweet"], ["blue", "蓝色的", null],
  ["certain", "确定的；无疑的", null], ["cold", "冷的；寒冷的", "warm"], ["complete", "完全的；完整的", null], ["cruel", "残忍的；残酷的", "kind"], ["dark", "暗的；黑暗的", "bright"],
  ["dead", "死的；无生命的", "living"], ["dear", "昂贵的；亲爱的", "cheap"], ["delicate", "精致的；脆弱的", null], ["different", "不同的", "same"], ["dirty", "脏的；肮脏的", "clean"],
  ["dry", "干的；干燥的", "wet"], ["false", "假的；错误的", "true"], ["feeble", "虚弱的；无力的", "strong"], ["female", "女性的；雌的", "male"], ["foolish", "愚蠢的", "wise"],
  ["future", "将来的", "past"], ["green", "绿色的", null], ["ill", "有病的", "healthy"], ["last", "最后的", "first"], ["late", "迟的；晚的", "early"],
  ["left", "左边的", "right"], ["loose", "松的；宽松的", "tight"], ["loud", "大声的；响亮的", "quiet"], ["low", "低的；矮的", "high"], ["mixed", "混合的", null],
  ["narrow", "窄的；狭隘的", "wide"], ["old", "老的；旧的", "new"], ["opposite", "相对的；相反的", null], ["public", "公共的；公众的", "private"], ["rough", "粗糙的", "smooth"],
  ["sad", "悲伤的", "happy"], ["safe", "安全的", null], ["secret", "秘密的", null], ["short", "短的；矮的", "long"], ["shut", "关着的；关闭的", "open"],
  ["simple", "简单的；朴素的", "complex"], ["slow", "慢的；缓慢的", "quick"], ["small", "小的", null], ["soft", "软的；柔软的", "hard"], ["solid", "固体的；实心的", "hollow"],
  ["special", "特别的；专门的", "common"], ["strange", "奇怪的；陌生的", null], ["thin", "薄的；细的；瘦的", "thick"], ["white", "白色的", null], ["wrong", "错误的", "right"]
];
