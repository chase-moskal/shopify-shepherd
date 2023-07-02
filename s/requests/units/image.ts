
import {gql} from "../../utils/gql.js"

export type ImageFormat = "JPG" | "PNG" | "WEBP"

export function image(format: ImageFormat) {

	function url_with_transform(x: number, y: number) {
		return gql`
			url(
				transform: {
					maxWidth: ${x}
					maxHeight: ${y}
					preferredContentType: ${format}
				}
			)
		`
	}

	return gql`
		id
		altText
		src_original: url
		src_tiny: ${url_with_transform(200, 200)}
		src_small: ${url_with_transform(500, 500)}
		src_medium: ${url_with_transform(1000, 1000)}
		src_large: ${url_with_transform(2000, 2000)}
	`
}

