import RK_Button from "../RK_Button";

export default function MenuItem({
  children,
  onClick,
  danger = false,
}) {
  return (
    <RK_Button
      onClick={onClick}
      className={`
        w-full text-left px-3 py-2 text-sm rounded-none!
        hover:bg-zinc-700
        ${danger ? "text-red-400 hover:bg-red-500/10" : ""}
      `}
    >
      {children}
    </RK_Button>
  );
};
