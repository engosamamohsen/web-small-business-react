export const dynamic = "force-dynamic";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-full min-h-screen w-full items-center justify-center bg-[var(--second-background)] px-9 py-10">
        <div
          className={`boxFrom flex h-fit w-full max-w-fit flex-col items-center justify-center gap-4 rounded-md bg-[var(--main-background)] px-10`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
