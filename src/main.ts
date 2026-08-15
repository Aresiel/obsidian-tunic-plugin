import {
	Editor,
	MarkdownView,
	MarkdownFileInfo,
	Modal,
	Notice,
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	TunicPluginSettings,
	TunicPluginSettingsTab,
} from './settings';
import {parseGlyphs, Glyph, GlyphString} from './tunic_lang_parser';
import {renderGlyphs} from "./tunic_glyph_renderer";

// Remember to rename these classes and interfaces!

export default class TunicPlugin extends Plugin {
	settings!: TunicPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor('tunic-lang', (source, root_div, ctx) => {
			let section_info = ctx.getSectionInfo(root_div);
			if(!section_info) {
				root_div.createEl('p', { text: 'Error: Could not get section info for code block.' });
				return;
			}

			let source_text = section_info.text.split('\n').slice(section_info.lineStart+1, section_info.lineEnd).join('\n');
			let glyphs: GlyphString[];
			try {
				glyphs = parseGlyphs(source_text);
			} catch (e) {
				root_div.createEl('p', { text: `Error parsing glyphs, please check syntax.` });
				return;
			}

			const glyph_box = root_div.createDiv({ cls: "tunic-glyph-box" });

			for (const line of glyphs) {
				const row = glyph_box.createDiv({ cls: "tunic-row" });
				row.style.setProperty("--tunic-glyph-size", `${this.settings.glyphSizeEm}`);
				renderGlyphs(line, row);
			}
		})

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TunicPluginSettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		//this.registerDomEvent(activeDocument, 'click', (_evt: MouseEvent) => {
		//	new Notice('Click');
		//});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		//this.registerInterval(
			//window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000),
		//);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<TunicPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	updateSize() {
		document.querySelectorAll<HTMLElement>(".tunic-row").forEach((row) => {
			row.style.setProperty("--tunic-glyph-size", `${this.settings.glyphSizeEm}`);
		});
	}
}

/* class SampleModal extends Modal {
	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
 */
