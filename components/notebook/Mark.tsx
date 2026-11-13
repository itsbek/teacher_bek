import { MARK } from "@/lib/notebook/util";

interface MarkProps {
  viewBox?: string;
  className?: string;
  pathClass?: string;
  dotClass?: string;
}

/** The mark: a B whose lower bowl curls into a question mark, with the dot beneath. */
export function Mark({ viewBox = "0 0 64 84", className, pathClass = "lm-p", dotClass = "lm-d" }: MarkProps) {
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true">
      <path className={pathClass} pathLength={1} d={MARK} />
      <circle className={dotClass} cx="33" cy="78" r="4.4" />
    </svg>
  );
}

/** The logo lockup: "teacher" over a big "Bek" whose B is the mark. */
export function LogoWord() {
  return (
    <span className="lw">
      <i>teacher</i>
      <b>
        <span className="lg-b" data-mark="">
          <Mark viewBox="12 6 42 80" />
        </span>
        ek
      </b>
    </span>
  );
}
