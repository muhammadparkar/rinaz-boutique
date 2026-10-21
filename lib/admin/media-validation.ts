export function imageContentType(bytes: Uint8Array) {
	const ascii = (start: number, end: number) => new TextDecoder().decode(bytes.slice(start, end));
	if (bytes.length < 12) throw new Error("Invalid image file");
	if ([137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)) return "image/png";
	if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
	if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
	if (["GIF87a", "GIF89a"].includes(ascii(0, 6))) return "image/gif";
	if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return "image/avif";
	throw new Error("Upload a JPEG, PNG, WebP, AVIF, or GIF image");
}
