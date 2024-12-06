function LayoutBase({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1280px] mx-auto p-8 text-center">{children}</div>
  );
}

export default LayoutBase;
