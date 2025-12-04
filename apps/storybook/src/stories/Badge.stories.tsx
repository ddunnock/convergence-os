import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge as BaseBadge, GlassBadge } from "@convergence/ui/components";

const meta: Meta<typeof BaseBadge> = {
  title: "Components/Badge",
  component: BaseBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Badge component for labels, tags, and status indicators.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
      description: "Visual style variant",
      table: { category: "Appearance" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base Badge Stories
export const BaseDefault: Story = {
  render: (_args) => <BaseBadge>Default</BaseBadge>,
};

export const BaseSecondary: Story = {
  render: (_args) => <BaseBadge variant="secondary">Secondary</BaseBadge>,
};

export const BaseDestructive: Story = {
  render: (_args) => <BaseBadge variant="destructive">Destructive</BaseBadge>,
};

export const BaseOutline: Story = {
  render: (_args) => <BaseBadge variant="outline">Outline</BaseBadge>,
};

export const BaseVariants: Story = {
  render: (_args) => (
    <div className="flex items-center gap-2">
      <BaseBadge>Default</BaseBadge>
      <BaseBadge variant="secondary">Secondary</BaseBadge>
      <BaseBadge variant="destructive">Destructive</BaseBadge>
      <BaseBadge variant="outline">Outline</BaseBadge>
    </div>
  ),
};

// Glass Badge Stories
export const GlassDefault: Story = {
  render: (_args) => <GlassBadge>Glass Badge</GlassBadge>,
};

export const GlassWithGlow: Story = {
  render: (_args) => <GlassBadge glow>With Glow</GlassBadge>,
};

export const GlassHoverEffects: Story = {
  render: (_args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <GlassBadge hover="none">None</GlassBadge>
        <GlassBadge hover="glow">Glow</GlassBadge>
        <GlassBadge hover="lift">Lift</GlassBadge>
      </div>
      <div className="flex items-center gap-2">
        <GlassBadge hover="scale">Scale</GlassBadge>
        <GlassBadge hover="shimmer">Shimmer</GlassBadge>
        <GlassBadge hover="ripple">Ripple</GlassBadge>
      </div>
    </div>
  ),
};

export const GlassWithGlowAndHover: Story = {
  render: (_args) => (
    <div className="flex items-center gap-2">
      <GlassBadge glow hover="glow">
        Glow + Hover
      </GlassBadge>
      <GlassBadge glow hover="lift">
        Glow + Lift
      </GlassBadge>
    </div>
  ),
};

// Comparison Story
export const BaseVsGlass: Story = {
  render: (_args) => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Base Badge</h3>
        <BaseBadge>Default Badge</BaseBadge>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Glass Badge</h3>
        <GlassBadge glow>Glass Badge</GlassBadge>
      </div>
    </div>
  ),
  parameters: {
    layout: "centered",
  },
};
