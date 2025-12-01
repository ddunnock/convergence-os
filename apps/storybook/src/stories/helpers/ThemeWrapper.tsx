import { useTheme } from "../../context/ThemeContext";

interface ThemeWrapperProps {
  children: (props: { theme: "light" | "dark" }) => React.ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { theme } = useTheme();
  return <>{children({ theme })}</>;
}
