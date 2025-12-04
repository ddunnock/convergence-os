import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
} from "@convergence/ui/components";
import { Button } from "@convergence/ui/components";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Card component for displaying content in a contained format.",
      },
    },
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base Card Stories
export const BaseSimple: Story = {
  render: (_args) => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>Simple card content</p>
      </CardContent>
    </Card>
  ),
};

export const BaseFull: Story = {
  render: (_args) => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

// Glass Card Stories
export const GlassSimple: Story = {
  render: (_args) => (
    <GlassCard className="w-[350px]">
      <GlassCardContent className="pt-6">
        <p>Simple glass card content</p>
      </GlassCardContent>
    </GlassCard>
  ),
};

export const GlassFull: Story = {
  render: (_args) => (
    <GlassCard className="w-[350px]">
      <GlassCardHeader>
        <GlassCardTitle>Glass Card Title</GlassCardTitle>
        <GlassCardDescription>Glass card description</GlassCardDescription>
      </GlassCardHeader>
      <GlassCardContent>
        <p>This is the main content of the glass card.</p>
      </GlassCardContent>
      <GlassCardFooter>
        <Button>Action</Button>
      </GlassCardFooter>
    </GlassCard>
  ),
};

export const GlassWithGradient: Story = {
  render: (_args) => (
    <GlassCard gradient className="w-[350px]">
      <GlassCardHeader>
        <GlassCardTitle>Gradient Card</GlassCardTitle>
        <GlassCardDescription>Card with gradient overlay</GlassCardDescription>
      </GlassCardHeader>
      <GlassCardContent>
        <p>This card has a purple-blue-pink gradient overlay.</p>
      </GlassCardContent>
    </GlassCard>
  ),
};

export const GlassAnimated: Story = {
  render: (_args) => (
    <GlassCard animated className="w-[350px]">
      <GlassCardHeader>
        <GlassCardTitle>Animated Card</GlassCardTitle>
        <GlassCardDescription>
          Hover to see scale animation
        </GlassCardDescription>
      </GlassCardHeader>
      <GlassCardContent>
        <p>This card scales up slightly on hover.</p>
      </GlassCardContent>
    </GlassCard>
  ),
};

export const GlassHoverEffects: Story = {
  render: (_args) => (
    <div className="flex flex-col gap-4">
      <GlassCard hover="glow" className="w-[350px]">
        <GlassCardHeader>
          <GlassCardTitle>Glow Hover</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <p>Hover to see glow effect</p>
        </GlassCardContent>
      </GlassCard>
      <GlassCard hover="lift" className="w-[350px]">
        <GlassCardHeader>
          <GlassCardTitle>Lift Hover</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <p>Hover to see lift effect</p>
        </GlassCardContent>
      </GlassCard>
    </div>
  ),
};

export const GlassCombined: Story = {
  render: (_args) => (
    <GlassCard gradient animated hover="glow" className="w-[350px]">
      <GlassCardHeader>
        <GlassCardTitle>Full Featured</GlassCardTitle>
        <GlassCardDescription>Gradient + Animated + Hover</GlassCardDescription>
      </GlassCardHeader>
      <GlassCardContent>
        <p>
          This card combines all glass effects: gradient, animation, and hover.
        </p>
      </GlassCardContent>
    </GlassCard>
  ),
};

// Comparison Story
export const BaseVsGlass: Story = {
  render: (_args) => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Base Card</h3>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Base Card</CardTitle>
            <CardDescription>Standard card styling</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a base card component.</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium">Glass Card</h3>
        <GlassCard gradient className="w-[350px]">
          <GlassCardHeader>
            <GlassCardTitle>Glass Card</GlassCardTitle>
            <GlassCardDescription>Glassmorphism styling</GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <p>This is a glass card component.</p>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  ),
  parameters: {
    layout: "centered",
  },
};
