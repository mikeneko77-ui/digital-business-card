import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Spinner,
  Center,
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  Link,
  Button,
} from "@chakra-ui/react";
import { supabase } from "../lib/supabase";
import { createUser } from "../types/User";
import type { User } from "../types/User";
import { FaGithub } from "react-icons/fa";
import { SiQiita } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";

const CardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      // ユーザー情報を取得
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", id)
        .single();

      if (!userData) {
        setLoading(false);
        return;
      }

      // user_skill から skill_id を取得
      const { data: userSkills } = await supabase
        .from("user_skill")
        .select("skill_id")
        .eq("user_id", id);

      // skills テーブルからスキル名を取得
      const skillIds = userSkills?.map((us) => us.skill_id) || [];
      const { data: skills } = await supabase
        .from("skills")
        .select("name")
        .in("id", skillIds);

      const skillNames = skills?.map((s) => s.name) || [];

      setUser(createUser({ ...userData, skills: skillNames }));
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!user) {
    return <div>ユーザーが見つかりません</div>;
  }

  return (
    <div>
      <Box
        maxW="375px"
        mx="auto"
        p={6}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <VStack gap={4}>
          <Heading size="lg">{user.name}</Heading>
          <Box dangerouslySetInnerHTML={{ __html: user.description }} />
          <Text>スキル: {user.skills.join(", ")}</Text>

          <HStack gap={4}>
            {user.githubUrl && (
              <Link href={user.githubUrl} target="_blank" aria-label="GitHub">
                <FaGithub size={24} />
              </Link>
            )}
            {user.qiitaUrl && (
              <Link href={user.qiitaUrl} target="_blank" aria-label="Qiita">
                <SiQiita size={24} />
              </Link>
            )}

            {user.xUrl && (
              <Link href={user.xUrl} target="_blank" aria-label="Twitter">
                <FaXTwitter size={24} />
              </Link>
            )}
          </HStack>
        </VStack>
      </Box>

      <Box maxW="375px" mx="auto" mt={4}></Box>

      <Button variant="outline" onClick={() => navigate("/")}>
        戻る
      </Button>
    </div>
  );
};

export default CardPage;
