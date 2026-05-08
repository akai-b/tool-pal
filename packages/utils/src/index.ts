/** 生成唯一 ID */
export function nanoid(size = 8): string {
	return Math.random()
		.toString(36)
		.slice(2, 2 + size)
}

/** 格式化字节数为可读字符串 */
export function formatBytes(bytes: number, decimals = 2): string {
	if (bytes === 0) return '0 B'
	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/** 计算压缩率（0~100） */
export function calcSavingPercent(original: number, result: number): number {
	if (original === 0) return 0
	return Math.round((1 - result / original) * 100)
}

/** 从文件名提取扩展名（小写，不含点） */
export function getExtension(filename: string): string {
	return filename.split('.').pop()?.toLowerCase() ?? ''
}

/** 替换文件名的扩展名 */
export function replaceExtension(filename: string, ext: string): string {
	const base = filename.lastIndexOf('.') > 0 ? filename.slice(0, filename.lastIndexOf('.')) : filename
	return `${base}.${ext}`
}

/** 将 File 读取为 ArrayBuffer */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result as ArrayBuffer)
		reader.onerror = () => reject(reader.error)
		reader.readAsArrayBuffer(file)
	})
}

/** 将 Uint8Array 触发浏览器下载 */
export function downloadBytes(data: Uint8Array, filename: string, mimeType = 'application/octet-stream'): void {
	const blob = new Blob([data as any], { type: mimeType })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	a.click()
	URL.revokeObjectURL(url)
}
