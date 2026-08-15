import {Glyph, GlyphString} from "./tunic_lang_parser";

const NS = "http://www.w3.org/2000/svg";
const GLYPH_WIDTH = 56;
const GLYPH_HEIGHT = 88;
const GLYPH_OVERLAP_PX = 4;

function line(x1: number, y1: number, x2: number, y2: number): SVGLineElement {
	const el = document.createElementNS(NS, "line");
	el.setAttribute("x1", String(x1));
	el.setAttribute("y1", String(y1));
	el.setAttribute("x2", String(x2));
	el.setAttribute("y2", String(y2));
	return el;
}

function circle(cx: number, cy: number, r: number): SVGCircleElement {
	const el = document.createElementNS(NS, "circle");
	el.setAttribute("cx", String(cx));
	el.setAttribute("cy", String(cy));
	el.setAttribute("r", String(r));
	return el;
}

export function renderGlyph(glyph: Glyph): SVGSVGElement {
	const svg = document.createElementNS(NS, "svg");
	svg.setAttribute("viewBox", "47 12 226 367");
	svg.addClass("tunic-glyph");

	const g = document.createElementNS(NS, "g");
	g.setAttribute("fill", "none");
	g.setAttribute("stroke", "currentColor");
	g.setAttribute("stroke-width", "16");
	g.setAttribute("stroke-linecap", "round");
	g.setAttribute("stroke-linejoin", "round");
	svg.appendChild(g);

	// Top
	if (glyph.top.left_wing === "/" || glyph.top.left_wing === "<") g.appendChild(line(160, 20, 55, 80));
	if (glyph.top.left_wing === "\\" || glyph.top.left_wing === "<") g.appendChild(line(55, 80, 160, 140));
	if (glyph.top.right_wing === "\\" || glyph.top.right_wing === ">") g.appendChild(line(160, 20, 265, 80));
	if (glyph.top.right_wing === "/" || glyph.top.right_wing === ">") g.appendChild(line(265, 80, 160, 140));

	if (glyph.top.left_leg !== "x") g.appendChild(line(55, 80, 55, 170));
	if (glyph.top.middle_leg !== "x") g.appendChild(line(160, 140, 160, 170));
	if (glyph.top.right_leg !== "x") g.appendChild(line(265, 80, 265, 170));
	if (glyph.top.wing_divider !== "x") g.appendChild(line(160, 20, 160, 140));

	// Middle Divider
	g.appendChild(line(55, 175, 265, 175));

	// Bottom
	if (glyph.bottom.left_support !== "x") g.appendChild(line(55, 210, 55, 270));
	if (glyph.bottom.right_support !== "x") g.appendChild(line(265, 210, 265, 270));
	if (glyph.bottom.left_wing === "/" || glyph.bottom.left_wing === "<") g.appendChild(line(160, 210, 55, 270));
	if (glyph.bottom.left_wing === "\\" || glyph.bottom.left_wing === "<") g.appendChild(line(55, 270, 160, 330));
	if (glyph.bottom.right_wing === "\\" || glyph.bottom.right_wing === ">") g.appendChild(line(160, 210, 265, 270));
	if (glyph.bottom.right_wing === "/" || glyph.bottom.right_wing === ">") g.appendChild(line(265, 270, 160, 330));
	if (glyph.bottom.wing_divider !== "x") g.appendChild(line(160, 210, 160, 330));
	if (glyph.bottom.loop !== "x") g.appendChild(circle(160, 350, 20));

	return svg;
}

export function renderGlyphs(glyphs: GlyphString, container: HTMLElement): void {
	container.empty();
	container.addClass("tunic-row");

	let isFirst = true;

	for (const token of glyphs) {
		if (token === "Small Space" || token === "Large Space") {
			const spacerWidth = token === "Large Space" ? GLYPH_WIDTH : GLYPH_WIDTH / 2;
			const spacer = container.createDiv({ cls: "tunic-glyph-spacer" });
			spacer.addClass(token === "Large Space" ? "tunic-space-large" : "tunic-space-small");

			if(!isFirst) {
				spacer.addClass("tunic-glyph-overlap")
			}
			isFirst = false;
			continue;
		}

		const svg = renderGlyph(token)
		if (!isFirst) {
			svg.addClass("tunic-glyph-overlap");
		}

		container.appendChild(svg);
		isFirst = false;
	}
}
