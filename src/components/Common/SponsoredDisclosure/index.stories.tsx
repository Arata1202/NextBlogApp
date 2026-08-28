import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SponsoredDisclosure from '.';

const meta = {
  title: 'Content/Sponsored Disclosure',
  component: SponsoredDisclosure,
  tags: ['autodocs'],
} satisfies Meta<typeof SponsoredDisclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = { args: { compact: true } };
