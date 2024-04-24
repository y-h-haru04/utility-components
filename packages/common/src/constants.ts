export const TABLE_HEADER = ["タイトル", "期日", "ステータス", ""];

export const OPTIONS = [
  { id: 0, text: "着手前" },
  { id: 1, text: "着手中" },
  { id: 2, text: "保留" },
  { id: 3, text: "完了" },
] as const;

export const SEARCH_SELECT_OPTIONS = [{ id: -1, text: "" }, ...OPTIONS];
