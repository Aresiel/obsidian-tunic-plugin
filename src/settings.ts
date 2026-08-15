import { App, PluginSettingTab, Setting } from 'obsidian';
import TunicPlugin from './main';

export interface TunicPluginSettings {
	glyphSizeEm: number;
}

export const DEFAULT_SETTINGS: TunicPluginSettings = {
	glyphSizeEm: 2.5,
};

export class TunicPluginSettingsTab extends PluginSettingTab {
	plugin: TunicPlugin;

	constructor(app: App, plugin: TunicPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Glyph Size')
			.setDesc('Adjust the size of Tunic Glyphs relative to your font size. The number of glyphs which fit horizontally without a need to scroll depends on this as well as your font size.')
			.addSlider((slider) =>
				slider
					.setLimits(0.5, 10, 0.5)
					.setValue(this.plugin.settings.glyphSizeEm)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.glyphSizeEm = value;
						await this.plugin.saveSettings();
						this.plugin.updateSize();
					})
			);
	}
}
