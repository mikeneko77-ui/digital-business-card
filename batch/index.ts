import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEYが必要です");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const JST_OFFSET = 9 * 60 * 60 * 1000;
const now = new Date();
const nowInJST = new Date(now.getTime() + JST_OFFSET);

const startOfTodayUTC = new Date(
  Date.UTC(
    nowInJST.getUTCFullYear(),
    nowInJST.getUTCMonth(),
    nowInJST.getUTCDate()
  ) - JST_OFFSET
);

const startOfYesterday = new Date(
  startOfTodayUTC.getTime() - 24 * 60 * 60 * 1000
);
const endOfYesterday = new Date(startOfTodayUTC.getTime() - 1);

console.log(
  `削除対象期間: ${startOfYesterday.toISOString()} ~ ${endOfYesterday.toISOString()}`
);

const { data: users, error: fetchError } = await supabase
  .from("users")
  .select("user_id")
  .gte("created_at", startOfYesterday.toISOString())
  .lte("created_at", endOfYesterday.toISOString());

if (fetchError) {
  console.error("ユーザー取得エラー:", fetchError);
  process.exit(1);
}

if (!users || users.length === 0) {
  console.log("前日のデータはありません");
  process.exit(0);
}

const userIds = users.map((u: { user_id: string }) => u.user_id);
console.log(`削除対象: ${userIds.length}件`);

const { error: skillError } = await supabase
  .from("user_skill")
  .delete()
  .in("user_id", userIds);

if (skillError) {
  console.error("user_skill 削除エラー: ", skillError);
  process.exit(1);
}

const { error: userError } = await supabase
  .from("users")
  .delete()
  .in("user_id", userIds);

if (userError) {
  console.error("users 削除エラー:", userError);
  process.exit(1);
}

console.log(`削除完了: ${userIds.length}件`);
