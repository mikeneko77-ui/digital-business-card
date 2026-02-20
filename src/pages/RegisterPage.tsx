import { useForm } from "react-hook-form";
import {
  Button,
  Box,
  Field,
  Heading,
  Input,
  NativeSelect,
  VStack,
} from "@chakra-ui/react";

import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  userId: string;
  name: string;
  description: string;
  skillId: string;
  githubId?: string;
  qiitaId?: string;
  xId?: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [skills, setSkills] = useState<{ id: number; name: string }[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const { error: userError } = await supabase.from("users").insert({
        user_id: data.userId,
        name: data.name,
        description: data.description,
        github_id: data.githubId || null,
        qiita_id: data.qiitaId || null,
        x_id: data.xId || null,
      });

      if (userError) throw userError;

      const { error: skillError } = await supabase.from("user_skill").insert({
        user_id: data.userId,
        skill_id: Number(data.skillId),
      });

      if (skillError) throw skillError;

      navigate(`/cards/${data.userId}`);
    } catch (error) {
      console.error("登録エラー:", error);
      alert("登録に失敗しました");
    }
  };
  useEffect(() => {
    const fetchSkills = async () => {
      const { data } = await supabase.from("skills").select("*");
      if (data) setSkills(data);
    };
    fetchSkills();
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box p={4} maxW="400px" mx="auto">
        <VStack gap={4}>
          <Heading size="lg">名刺新規登録</Heading>

          <Field.Root required invalid={!!errors.userId}>
            <Field.Label>ID(英単語)</Field.Label>
            <Input
              {...register("userId", {
                required: "IDは必須です",
                pattern: {
                  value: /^[a-zA-Z0-9_-]+$/,
                  message: "英数字, ハイフン, アンダースコアのみ",
                },
              })}
              placeholder="例: yamada-taro"
            />
            {errors.userId && (
              <Field.ErrorText>{errors.userId.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root required invalid={!!errors.name}>
            <Field.Label>名前</Field.Label>
            <Input
              {...register("name", {
                required: "名前は必須です",
              })}
              placeholder="例 山田太郎"
            />
            {errors.name && (
              <Field.ErrorText>{errors.name.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root required invalid={!!errors.description}>
            <Field.Label>自己紹介</Field.Label>
            <Input
              {...register("description", {
                required: "自己紹介は必須です",
              })}
              placeholder="HTMLタグも使えます"
            />
            {errors.description && (
              <Field.ErrorText>{errors.description.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root required invalid={!!errors.skillId}>
            <Field.Label>好きな技術</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                {...register("skillId", {
                  required: "技術を選択してください",
                })}
                placeholder="選択してください"
              >
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Field.Root>

          <Field.Root invalid={!!errors.githubId}>
            <Field.Label>GitHub Id</Field.Label>
            <Input
              {...register("githubId", {
                pattern: {
                  value: /^[a-zA-Z0-9-]*$/,
                  message: "英数字とハイフンのみ",
                },
              })}
              placeholder="例: my-github-id"
            />
            {errors.githubId && (
              <Field.ErrorText>{errors.githubId.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.qiitaId}>
            <Field.Label>Qiita Id</Field.Label>
            <Input
              {...register("qiitaId", {
                pattern: {
                  value: /^[a-zA-Z0-9-]*$/,
                  message: "英数字とハイフンのみ",
                },
              })}
              placeholder="例: qiita-user"
            />
            {errors.qiitaId && (
              <Field.ErrorText>{errors.qiitaId.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.xId}>
            <Field.Label>X (Twitter) ID</Field.Label>
            <Input
              {...register("xId", {
                pattern: {
                  value: /^[a-zA-Z0-9_]*$/,
                  message: "英数字とアンダースコアのみ",
                },
              })}
              placeholder="例: twitter_user"
            />
            {errors.xId && (
              <Field.ErrorText>{errors.xId.message}</Field.ErrorText>
            )}
          </Field.Root>

          <Button type="submit" colorPalette="blue" w="full">
            登録する
          </Button>
        </VStack>
      </Box>
    </form>
  );
};

export default RegisterPage;
