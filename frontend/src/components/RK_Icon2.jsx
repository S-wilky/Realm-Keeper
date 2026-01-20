import * as Icons from "../icons/components";

export default function RK_Icon({ icon, className }) {
  const Icon = Icons[icon];
  if (!Icon) return null;

  return <Icon className={`w-full h-full ${className}`} />;
}
