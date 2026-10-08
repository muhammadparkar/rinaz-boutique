export function previewViewport(mobile: boolean, rotated: boolean) {
	const width = mobile ? 390 : 1440;
	const height = mobile ? 844 : 900;
	return rotated ? { width: height, height: width } : { width, height };
}
export function previewScale(
	container: { width: number; height: number },
	viewport: { width: number; height: number },
) {
	return Math.max(0, Math.min(1, container.width / viewport.width, container.height / viewport.height));
}
