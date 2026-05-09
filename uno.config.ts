import { defineConfig, presetUno, presetAttributify, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
	content: {
		filesystem: ['apps/*/src/**/*.{ts,tsx,html}', 'packages/ui/src/**/*.{ts,tsx}', 'packages/tool-*/src/**/*.{ts,tsx}']
	},
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons({
			scale: 1.2,
			warn: true
		})
	],
	transformers: [transformerDirectives(), transformerVariantGroup()],
	shortcuts: {
		// 可以在这里添加自定义快捷方式
	},
	theme: {
		// 可以在这里自定义主题
	}
})
