import { NewImageCarousel_images } from "__generated__/NewImageCarousel_images.graphql"
import { createGeminiUrl } from "lib/Components/OpaqueImageView/createGeminiUrl"
import { isPad } from "lib/utils/hardware"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import compact from "lodash/compact"
import React, { useMemo } from "react"
import { PixelRatio } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { fitInside, getBestImageVersionForThumbnail } from "./helpers"
import { NewImagesCarouselEmbedded } from "./NewImagesCarouselEmbedded"

interface NewImageCarouselProps {
  images: NewImageCarousel_images
}

export const NewImageCarousel: React.FC<NewImageCarouselProps> = ({ images: rawImages }) => {
  const screenDimensions = useScreenDimensions()
  const embeddedCardBoundingBox = { width: screenDimensions.width, height: isPad() ? 460 : 340 }

  const images = useMemo(() => {
    const result = rawImages
      .map((image) => {
        if (!image.height || !image.width || !image.url) {
          // for some reason gemini returned missing values
          return null
        }
        const { width, height } = fitInside(embeddedCardBoundingBox, { width: image.width, height: image.height })
        return {
          width,
          height,
          url: createGeminiUrl({
            imageURL: image.url.replace(":version", getBestImageVersionForThumbnail(compact(image.imageVersions))),
            // upscale to match screen resolution
            width: width * PixelRatio.get(),
            height: height * PixelRatio.get(),
          }),
        }
      })
      .filter(Boolean)

    return result
  }, [rawImages])

  return <NewImagesCarouselEmbedded images={images} />
}

export const NewImageCarouselFragmentContainer = createFragmentContainer(NewImageCarousel, {
  images: graphql`
    fragment NewImageCarousel_images on Image @relay(plural: true) {
      url: imageURL
      width
      height
      aspectRatio
      imageVersions
    }
  `,
})
