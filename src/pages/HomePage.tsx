import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

export const HomePage = () => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!userId.trim()) {
      setError("IDを入力してください");
      return;
    }
    setError("");
    navigate(`/cards/${userId}`);
  };
  return (
    <Box p={4} maxW="400px" mx="auto">
      <VStack gap={6}>
        <Heading size="lg">デジタル名刺</Heading>
        <Field.Root invalid={!!error}>
          <Field.Label>名刺を見る</Field.Label>
          <Input
            placeholder="IDを入力"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setError("");
            }}
          />
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
        </Field.Root>
        <Button colorPalette="blue" w="full" onClick={handleSearch}>
          検索
        </Button>

        <RouterLink to="/cards/register" style={{ color: "#3182ce" }}>
          新規登録はこちら
        </RouterLink>
      </VStack>
    </Box>
  );
};
