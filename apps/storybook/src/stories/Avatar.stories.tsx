import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import {
  Avatar as BaseAvatar,
  AvatarImage,
  AvatarFallback,
  GlassAvatar,
  GlassAvatarImage,
  GlassAvatarFallback,
} from "@convergence/ui/components";

const meta = {
  title: "Components/Avatar",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "User avatar component with image and fallback support.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Base Avatar Stories
export const BaseDefault = {
  render: () =>
    React.createElement(
      BaseAvatar,
      null,
      React.createElement(AvatarFallback, null, "JD")
    ),
} satisfies Story;

export const BaseWithImage: Story = {
  render: () =>
    React.createElement(
      BaseAvatar,
      null,
      React.createElement(AvatarImage, {
        src: "https://github.com/shadcn.png",
        alt: "User",
      }),
      React.createElement(AvatarFallback, null, "CN")
    ),
};

export const BaseSizes: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex items-center gap-4" },
      React.createElement(
        BaseAvatar,
        { className: "h-8 w-8" },
        React.createElement(AvatarFallback, null, "SM")
      ),
      React.createElement(
        BaseAvatar,
        { className: "h-10 w-10" },
        React.createElement(AvatarFallback, null, "MD")
      ),
      React.createElement(
        BaseAvatar,
        { className: "h-16 w-16" },
        React.createElement(AvatarFallback, null, "LG")
      )
    ),
};

// Glass Avatar Stories
export const GlassDefault: Story = {
  render: () =>
    React.createElement(
      GlassAvatar,
      null,
      React.createElement(GlassAvatarFallback, null, "JD")
    ),
};

export const GlassWithGlow: Story = {
  render: () =>
    React.createElement(
      GlassAvatar,
      { glow: true },
      React.createElement(GlassAvatarFallback, null, "JD")
    ),
};

export const GlassSizes: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex items-center gap-4" },
      React.createElement(
        GlassAvatar,
        { size: "sm" },
        React.createElement(GlassAvatarFallback, null, "SM")
      ),
      React.createElement(
        GlassAvatar,
        { size: "md" },
        React.createElement(GlassAvatarFallback, null, "MD")
      ),
      React.createElement(
        GlassAvatar,
        { size: "lg" },
        React.createElement(GlassAvatarFallback, null, "LG")
      )
    ),
};

export const GlassWithImage: Story = {
  render: () =>
    React.createElement(
      GlassAvatar,
      { glow: true },
      React.createElement(GlassAvatarImage, {
        src: "https://github.com/shadcn.png",
        alt: "User",
      }),
      React.createElement(GlassAvatarFallback, null, "CN")
    ),
};

// Comparison Story
export const BaseVsGlass: Story = {
  render: () =>
    React.createElement(
      "div",
      { className: "flex flex-col items-center gap-8" },
      React.createElement(
        "div",
        { className: "flex flex-col items-center gap-2" },
        React.createElement(
          "h3",
          { className: "text-sm font-medium" },
          "Base Avatar"
        ),
        React.createElement(
          BaseAvatar,
          null,
          React.createElement(AvatarFallback, null, "JD")
        )
      ),
      React.createElement(
        "div",
        { className: "flex flex-col items-center gap-2" },
        React.createElement(
          "h3",
          { className: "text-sm font-medium" },
          "Glass Avatar"
        ),
        React.createElement(
          GlassAvatar,
          { glow: true },
          React.createElement(GlassAvatarFallback, null, "JD")
        )
      )
    ),
  parameters: {
    layout: "centered",
  },
};
