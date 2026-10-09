"use client";
import Image from "next/image";
import type { ComponentProps } from "react";
import { isVideoUrl } from "@/lib/utils";

type ImageProps = ComponentProps<typeof Image>;
type StoreMediaProps = ImageProps & {
	autoPlay?: boolean;
	controls?: boolean;
};

/** Renders a <video> for video URLs, otherwise falls back to the Image component. */
export const StoreMedia = ({ autoPlay = true, controls = false, ...props }: StoreMediaProps) => {
	const src = typeof props.src === "string" ? props.src : "";
	if (isVideoUrl(src)) {
		return (
			<video
				// Videos have no alt attribute — surface the image alt text to assistive tech instead.
				aria-label={props.alt || undefined}
				className={typeof props.className === "string" ? props.className : undefined}
				style={
					props.fill
						? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
						: undefined
				}
				src={src}
				muted
				loop
				autoPlay={autoPlay}
				playsInline
				controls={controls}
			/>
		);
	}
	return <Image {...props} />;
};
