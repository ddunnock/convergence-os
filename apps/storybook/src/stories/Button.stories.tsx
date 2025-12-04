import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button, GlassButton } from "@convergence/ui/components";

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
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "Visual style variant",
      table: { category: "Appearance" },
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
      description: "Size variant",
      table: { category: "Appearance" },
    },
    asChild: {
      control: "boolean",
      description: "Render as child component using Radix Slot",
      table: { category: "Behavior" },
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
      table: { category: "State" },
    },
    children: {
      control: "text",
      description: "Button content",
      table: { category: "Content" },
    },
    onClick: {
      action: "clicked",
      description: "Click event handler",
      table: { category: "Events" },
    },
  },
  args: {
    onClick: fn(),
    children: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "Default Button",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /default button/i });

    // Verify button is rendered
    await expect(button).toBeInTheDocument();

    // Click the button
    await userEvent.click(button);

    // Verify onClick was called
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /delete/i });

    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /disabled/i });

    // Verify button is disabled
    await expect(button).toBeDisabled();

    // Verify onClick has not been called (disabled buttons can't be clicked)
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** Story demonstrating multiple rapid clicks */
export const MultipleClicks: Story = {
  args: {
    variant: "default",
    children: "Click Me Multiple Times",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    // Click multiple times
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);

    // Verify all clicks were registered
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

// Glass Button Stories
export const GlassDefault: Story = {
  render: (_args) => <GlassButton>Glass Button</GlassButton>,
};

export const GlassWithGlow: Story = {
  render: (_args) => <GlassButton effect="glow">Glow Effect</GlassButton>,
};

export const GlassEffects: Story = {
  render: (_args) => (
    <div className="flex flex-col gap-2">
      <GlassButton effect="none">None</GlassButton>
      <GlassButton effect="glow">Glow</GlassButton>
      <GlassButton effect="shimmer">Shimmer</GlassButton>
      <GlassButton effect="ripple">Ripple</GlassButton>
      <GlassButton effect="lift">Lift</GlassButton>
      <GlassButton effect="scale">Scale</GlassButton>
    </div>
  ),
};

export const GlassWithHover: Story = {
  render: (_args) => (
    <div className="flex flex-col gap-2">
      <GlassButton effect="glow">Hover Glow</GlassButton>
      <GlassButton effect="lift">Hover Lift</GlassButton>
      <GlassButton effect="scale">Hover Scale</GlassButton>
    </div>
  ),
};
