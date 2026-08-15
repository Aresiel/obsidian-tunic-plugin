/*
    Format for single glyph: <|>|||-|||<|>o separated by commas or spaces for multiple glyphs, separated by newlines for multiple lines
    Parts of the glyph may be replaced with " " or "x" to indicate empty spaces.
*/

export type Glyph = {
    /*
        Ascii drawing of glyph:
        <|>
        |||
        ---
        | |
        <|>
         o
    */
    
    top: {
        left_wing:    "x" | "<" | "/" | "\\";
        wing_divider: "x" | "|";
        right_wing:   "x" | ">" | "/" | "\\";
        left_leg:     "x" | "|";
        middle_leg:   "x" | "|";
        right_leg:    "x" | "|";
    }

    middle: {
        divider: "-";
    }

    bottom: {
        left_support:  "x" | "|";
        right_support: "x" | "|";
        left_wing:     "x" | "<" | "/" | "\\";
        wing_divider:  "x" | "|";
        right_wing:    "x" | ">" | "/" | "\\";
        loop:          "x" | "o";
    }
}


export type GlyphString = (Glyph | "Small Space" | "Large Space")[]

function parseGlyphString(glyphString: string): Glyph {
	glyphString = glyphString.replaceAll("?", "x");
    let chars: string[] = glyphString.split("");
    if(chars.length !== 13) {
        throw new Error(`Invalid glyph string length: ${glyphString.length}. Expected 13.`);
    } else if(
        chars[0] !== "<" && chars[0] !== "x" && chars[0] !== "/" && chars[0] !== "\\" ||
        chars[1] !== "|" && chars[1] !== "x" ||
        chars[2] !== ">" && chars[2] !== "x" && chars[2] !== "/" && chars[2] !== "\\" ||
        chars[3] !== "|" && chars[3] !== "x" ||
        chars[4] !== "|" && chars[4] !== "x" ||
        chars[5] !== "|" && chars[5] !== "x" ||
        chars[6] !== "-" && chars[6] !== "x" ||
        chars[7] !== "|" && chars[7] !== "x" ||
        chars[8] !== "|" && chars[8] !== "x" ||
        chars[9] !== "<" && chars[9] !== "x" && chars[9] !== "/" && chars[9] !== "\\" ||
        chars[10] !== "|" && chars[10] !== "x" ||
        chars[11] !== ">" && chars[11] !== "x" && chars[11] !== "/" && chars[11] !== "\\" ||
        chars[12] !== "o" && chars[12] !== "x"
    ) {
        throw new Error(`Invalid glyph string: ${glyphString}`);
    }

    return {
        top: {
            left_wing: chars[0],
            wing_divider: chars[1],
            right_wing: chars[2],
            left_leg: chars[3],
            middle_leg: chars[4],
            right_leg: chars[5],
        },
        middle: {
            divider: chars[6] as Glyph["middle"]["divider"],
        },
        bottom: {
            left_support: chars[7],
            right_support: chars[8],
            left_wing: chars[9],
            wing_divider: chars[10],
            right_wing: chars[11],
            loop: chars[12],
        }
    };
}

export function parseGlyphs(glyphsString: string): GlyphString[] {
    let lines = glyphsString.split("\n");
    let glyphs: GlyphString[] = [];

    let input = glyphsString;

	let previous_token_type: "Glyph" | "Comma" | "Space" | "Newline" | "None" = "None";
    let current_line: GlyphString = [];
    while(input.length > 0) {
		let large_token = input.slice(0, 13);
		let small_token = input.slice(0, 1);

		switch (previous_token_type) {
			case "None":
			case "Newline": // Next token must be a glyph
				current_line.push(parseGlyphString(large_token));
				input = input.slice(13);
				previous_token_type = "Glyph";
				break;
			case "Glyph": // Next token must be a comma, space, or newline
				switch (small_token) {
					case ",":
						input = input.slice(1);
						previous_token_type = "Comma";
						break;
					case " ":
						input = input.slice(1);
						current_line.push("Small Space");
						previous_token_type = "Space";
						break;
					case "\n":
						input = input.slice(1);
						glyphs.push(current_line);
						current_line = [];
						previous_token_type = "Newline";
						break;
					default:
						throw new Error(`Invalid token after glyph: ${small_token}`);
				}
				break;
			case "Comma": // Next token must be a glyph or space
				if(small_token === " ") {
					input = input.slice(1);
					current_line.push("Large Space");
					previous_token_type = "Space";
				} else {
					current_line.push(parseGlyphString(large_token));
					input = input.slice(13);
					previous_token_type = "Glyph";
				}
				break;
			case "Space": // Next token must be a glyph
				current_line.push(parseGlyphString(large_token));
				input = input.slice(13);
				previous_token_type = "Glyph";
				break;
		}
    }
    if(current_line.length > 0) {
        glyphs.push(current_line);
    }
    
    return glyphs;
}
