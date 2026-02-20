import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../lib/supabase", () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === "skills") {
        return {
          select: vi.fn(() =>
            Promise.resolve({
              data: [
                { id: 1, name: "React" },
                { id: 2, name: "TypeScript" },
              ],
            })
          ),
        };
      }
      if (table === "users") {
        return { insert: vi.fn(() => Promise.resolve({ error: null })) };
      }

      if (table === "user_skill") {
        return {
          insert: vi.fn(() => Promise.resolve({ error: null })),
        };
      }
    }),
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>{component}</BrowserRouter>
    </ChakraProvider>
  );
};

describe("RegisterPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("タイトルが表示される", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText("名刺新規登録")).toBeInTheDocument();
  });

  it("全項目入力して登録ボタンを押すと遷移する", async () => {
    renderWithProviders(<RegisterPage />);

    await userEvent.type(
      screen.getByPlaceholderText("例: yamada-taro"),
      "test-id"
    );
    await userEvent.type(
      screen.getByPlaceholderText("例 山田太郎"),
      "テスト太郎"
    );
    await userEvent.type(
      screen.getByPlaceholderText("HTMLタグも使えます"),
      "自己紹介文"
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
    await userEvent.selectOptions(screen.getByRole("combobox"), "1");

    fireEvent.click(screen.getByText("登録する"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/cards/test-id");
    });
  });

  it("紹介文がないときにエラーメッセージが出る", async () => {
    renderWithProviders(<RegisterPage />);
    await userEvent.type(
      screen.getByPlaceholderText("例: yamada-taro"),
      "test-id"
    );
    await userEvent.type(
      screen.getByPlaceholderText("例 山田太郎"),
      "テスト太郎"
    );

    fireEvent.click(screen.getByText("登録する"));

    await waitFor(() => {
      expect(screen.getByText("自己紹介は必須です")).toBeInTheDocument();
    });
  });

  it("オプション項目を入力しなくても登録できる", async () => {
    renderWithProviders(<RegisterPage />);
    await userEvent.type(
      screen.getByPlaceholderText("例: yamada-taro"),
      "test-id"
    );
    await userEvent.type(
      screen.getByPlaceholderText("例 山田太郎"),
      "テスト太郎"
    );
    await userEvent.type(
      screen.getByPlaceholderText("HTMLタグも使えます"),
      "自己紹介文"
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
    await userEvent.selectOptions(screen.getByRole("combobox"), "1");

    fireEvent.click(screen.getByText("登録する"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/cards/test-id");
    });
  });
});
