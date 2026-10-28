import styles from "./Decor.module.css";

// Formas abstratas em blocos (public/decor). O PNG é só a máscara: a cor vem
// do --red, então muda junto com o resto do site.
const SHAPES = {
  1: { width: 625, height: 203 },
  2: { width: 268, height: 626 },
  3: { width: 63, height: 949 },
  4: { width: 750, height: 89 },
} as const;

type Props = {
  shape: keyof typeof SHAPES;
  className?: string;
};

export function Decor({ shape, className }: Props) {
  const { width, height } = SHAPES[shape];
  return (
    <span
      aria-hidden="true"
      className={`${styles.decor} ${className ?? ""}`}
      style={
        {
          "--decor": `url(/decor/forma-${shape}.png)`,
          aspectRatio: `${width} / ${height}`,
        } as React.CSSProperties
      }
    />
  );
}
