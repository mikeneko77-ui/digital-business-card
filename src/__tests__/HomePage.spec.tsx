import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>{component}</BrowserRouter>
    </ChakraProvider>
  );
};

describe("HomePage", () => {
  it("検索フォームが表示される", () => {
    renderWithProviders(<HomePage />);
    expect(
      screen.getByPlaceholderText("IDを入力")
    ).toBeInTheDocument();
  });

  it("IDを入力して検索ボタンを押すと/cards/{id}に遷移する", () => {
    renderWithProviders(<HomePage />);
    fireEvent.change(screen.getByPlaceholderText("IDを入力"), {
      target: { value: "test-id" },
    });
    fireEvent.click(screen.getByText("検索"));
    expect(mockNavigate).toHaveBeenCalledWith("/cards/test-id");
  });

  it("IDが空のまま検索ボタンを押すとエラーメッセージが出る", () => {
    renderWithProviders(<HomePage />);
    fireEvent.click(screen.getByText("検索"));
    expect(screen.getByText("IDを入力してください")).toBeInTheDocument();
  });

  it("「名刺を作る」リンクが表示される", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText("新規登録はこちら")).toBeInTheDocument();
  });
});
