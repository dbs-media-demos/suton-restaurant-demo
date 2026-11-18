/*
 * The lead's logo from the CRM (already sanitised there): `<svg viewBox>` with
 * `<g data-part="mark">` (stroked shapes with their final fill) and `<g data-part="word">`.
 */

const SHAPE = /<(path|circle|rect|line|polyline|polygon|ellipse)\b([^>]*?)(\/?)>/g;

/**
 * For the page loader: every shape of the mark gets `pathLength="1"` (so one dash draws its
 * outline) and its place in the stagger as `--i`. The word's shapes are left alone.
 */
export function loaderSvg(svg: string) {
  const mark = svg.search(/data-part=["']mark["']/);
  const word = svg.search(/data-part=["']word["']/);
  const inMark = (at: number) => mark >= 0 && at > mark && (word < mark || at < word);
  let i = 0;
  return svg.replace(SHAPE, (tag, name: string, attrs: string, close: string, at: number) => {
    if (!inMark(at)) return tag;
    let a = attrs.replace(/\spathLength=(["'])[^"']*\1/i, "");
    const n = i++;
    a = /\sstyle=(["'])/.test(a) ? a.replace(/\sstyle=(["'])/, ` style=$1--i:${n};`) : `${a} style="--i:${n}"`;
    return `<${name}${a} pathLength="1"${close}>`;
  });
}
