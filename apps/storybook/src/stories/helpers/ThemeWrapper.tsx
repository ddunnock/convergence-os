import { useTheme } from "../../context/ThemeContext";

interface ThemeWrapperProps {
  readonly children: (props: {
    readonly theme: "light" | "dark";
  }) => React.ReactNode;
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { theme } = useTheme();
  return <>{children({ theme })}</>;
}
