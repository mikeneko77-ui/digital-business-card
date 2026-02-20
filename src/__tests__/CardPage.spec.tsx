import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import CardPage from "../pages/CardPage";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "test-id" }),
  };
});

const mockUserData = {
  user_id: "test-id",
  name: "鈴木一郎",
  description: "<p>自己紹介</p>",
  github_id: "test-github",
  qiita_id: "test-qiita",
  x_id: "test-x",
};

const mockSkills = [{ name: "React" }, { name: "TypeScript" }];

vi.mock("../lib/supabase", () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === "users") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: mockUserData })),
            })),
          })),
        };
      }
      if (table === "user_skill") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() =>
              Promise.resolve({ data: [{ skill_id: 1 }, { skill_id: 2 }] })
            ),
          })),
        };
      }
      if (table === "skills") {
        return {
          select: vi.fn(() => ({
            in: vi.fn(() => Promise.resolve({ data: mockSkills })),
          })),
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

describe("CardPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("名前が表示される", async () => {
    renderWithProviders(<CardPage />);
    await waitFor(() => {
      expect(screen.getByText("鈴木一郎")).toBeInTheDocument();
    });
  });

  it("自己紹介が表示される", async () => {
    renderWithProviders(<CardPage />);
    await waitFor(() => {
      expect(screen.getByText("自己紹介")).toBeInTheDocument();
    });
  });

  it("技術が表示される", async () => {
    renderWithProviders(<CardPage />);
    await waitFor(() => {
      expect(screen.getByText(/React/)).toBeInTheDocument();
      expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
    });
  });

  it("GitHubアイコンが表示される", async () => {
    renderWithProviders(<CardPage />);
    await waitFor(() => {
      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
    });
  });

  it("Qiitaアイコンが表示される", async () => {
    renderWithProviders(<CardPage />);
    await waitFor(() => {
      expect(screen.getByLabelText("Qiita")).toBeInTheDocument();
    });
  });

  it("Twitterアイコンが表示される", async () => {
    renderWithProviders(<CardPage />);
    await waitFor(() => {
      expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
    });
  });

  it("戻るボタンをクリックすると/に遷移する", async () => {
    renderWithProviders(<CardPage />);
    await waitFor(() => {
      expect(screen.getByText("戻る")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("戻る"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
