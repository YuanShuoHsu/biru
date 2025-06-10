import HorizontalLinearStepper from "./HorizontalLinearStepper";

export default function TableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HorizontalLinearStepper />
      {children}
    </>
  );
}
