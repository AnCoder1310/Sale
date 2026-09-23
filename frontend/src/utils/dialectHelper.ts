// Silent Vietnamese Dialect Normalization (Under-the-hood NLU Helper)
// Only maps regional slang into standard Vietnamese for natural intent recognition.

const REPLACEMENTS: [RegExp, string][] = [
  // Nghệ Tĩnh / Miền Trung
  [/\bcấy chi rứa\b/gi, "cái gì thế"],
  [/\bcấy chi rueấ\b/gi, "cái gì thế"],
  [/\bcấy chi\b/gi, "cái gì"],
  [/\bchi rứa\b/gi, "gì thế"],
  [/\brăng rứa\b/gi, "sao thế"],
  [/\bmần răng\b/gi, "làm sao"],
  [/\blàm răng\b/gi, "làm thế nào"],
  [/\bở mô\b/gi, "ở đâu"],
  [/\bchỗ mô\b/gi, "chỗ nào"],
  [/\bgiữa đàng\b/gi, "giữa đường"],
  [/\bchú nợ\b/gi, "chú nhé"],
  [/\brứa nợ\b/gi, "thế nhé"],
  [/\bmùa lụt\b/gi, "ngập nước"],
  [/\bvô nước\b/gi, "ngập nước"],
  [/\bchai bình\b/gi, "chai pin"],
  [/\bsụt bình\b/gi, "hao pin"],
  [/\bmắc quá\b/gi, "đắt quá"],
  [/\bdòm\b/gi, "xem"],
  [/\bngó\b/gi, "xem"],
  [/\bnỏ có\b/gi, "không có"],
  [/\bnỏ biết\b/gi, "không biết"],
  [/\bnỏ được\b/gi, "không được"],
  [/\bnỏ\b/gi, "không"],

  // Nam Bộ / Miền Tây
  [/\bhổng\b/gi, "không"],
  [/\bhông\b/gi, "không"],
  [/\bdzậy\b/gi, "vậy"],
  [/\bxài\b/gi, "dùng"],
  [/\bhao bình\b/gi, "hao pin"],
  [/\bngon lành\b/gi, "rất tốt"],
  [/\brẻ rề\b/gi, "rất rẻ"],
  [/\bêm ru\b/gi, "rất êm"],
];

/**
 * Normalizes input text containing regional dialects into standard Vietnamese
 * for seamless intent recognition by LLM or keyword search.
 */
export function normalizeToStandardVietnamese(text: string): string {
  let normalized = text.toLowerCase();
  for (const [pattern, replacement] of REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }
  return normalized;
}
