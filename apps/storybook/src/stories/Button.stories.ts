import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Primary UI component for user interaction.",
      },
    },
  },
  argTypes: {
    primary: {
      control: "boolean",
      description: "Is this the principal call to action on the page?",
      table: { category: "Appearance" },
    },
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
      description: "How large should the button be?",
      table: { category: "Appearance" },
    },
    backgroundColor: {
      control: "color",
      description: "What background color to use",
      table: { category: "Appearance" },
    },
    label: {
      control: "text",
      description: "Button contents",
      table: { category: "Content" },
    },
    onClick: {
      action: "clicked",
      description: "Optional click handler",
      table: { category: "Events" },
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
};

export const Secondary: Story = {
  args: {
    label: "Button",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    label: "Button",
  },
};

export const Small: Story = {
  args: {
    size: "small",
    label: "Button",
  },
};
