/* 通用工具 */
window.Util = {
  /* 例句字符串拆成 {en, zh}："Come here. 过来。" → 英文段 + 中文段 */
  splitEx(ex) {
    if (!ex) return null;
    const m = ex.match(/^([!-~][^一-鿿]*?)\s*([一-鿿].*)$/);
    return m ? { en: m[1], zh: m[2] } : { en: ex, zh: '' };
  }
};
