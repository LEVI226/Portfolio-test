export type LocalizedText = { en: string; fr: string };
export interface PortfolioContent {
  name: string;
  title: string;
  biography: LocalizedText | null;
  email: string | null;
  projects: { title: LocalizedText; description: LocalizedText; url: string }[];
}
export const portfolio: PortfolioContent = {
  name: "Yannick Ulrich Levi OUEDRAOGO",
  title: "SIGNAL / OUAGA",
  biography: null,
  email: null,
  projects: [],
};
