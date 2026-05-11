type Props = {
  children: React.ReactNode;
};

export default function ContentContainer({ children }: Props) {
  return <div className="min-w-0 lg:col-span-2">{children}</div>;
}
