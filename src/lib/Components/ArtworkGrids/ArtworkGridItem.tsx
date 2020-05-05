import { Box, color, Sans } from "@artsy/palette"
import { ArtworkGridItem_artwork } from "__generated__/ArtworkGridItem_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { TouchableHighlight, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { Schema, Track, track as _track } from "../../utils/track"

interface Props {
  artwork: ArtworkGridItem_artwork
  // If it's not provided, then it will push just the one artwork
  // to the switchboard.
  onPress?: (artworkID: string) => void
  trackingFlow?: string
  contextModule?: string
}

const track: Track<Props, any> = _track

@track()
export class Artwork extends React.Component<Props, any> {
  @track((props: Props) => ({
    action_name: Schema.ActionNames.GridArtwork,
    action_type: Schema.ActionTypes.Tap,
    flow: props.trackingFlow,
    context_module: props.contextModule,
  }))
  handleTap() {
    this.props.onPress && this.props.artwork.slug
      ? this.props.onPress(this.props.artwork.slug)
      : SwitchBoard.presentNavigationViewController(
          this,
          // @ts-ignore STRICTNESS_MIGRATION
          this.props.artwork.href
        )
  }

  render() {
    const artwork = this.props.artwork
    const artworkImage = artwork.image
    const saleInfo = saleMessageOrBidInfo(artwork)
    return (
      <TouchableHighlight underlayColor={color("white100")} activeOpacity={0.8} onPress={this.handleTap.bind(this)}>
        <View>
          {artworkImage && (
            <OpaqueImageView aspectRatio={artwork.image?.aspectRatio ?? 1} imageURL={artwork.image?.url} />
          )}
          <Box mt={1}>
            {Boolean(this.props.artwork.artistNames) && (
              <Sans size="3t" weight="medium" numberOfLines={1}>
                {this.props.artwork.artistNames}
              </Sans>
            )}
            {Boolean(artwork.title) && (
              <Sans size="3t" color="black60" numberOfLines={1}>
                {artwork.title}
                {Boolean(artwork.date) && `, ${artwork.date}`}
              </Sans>
            )}
            {Boolean(saleInfo) && (
              <Sans color="black60" size="3t" numberOfLines={1}>
                {saleInfo}
              </Sans>
            )}
          </Box>
        </View>
      </TouchableHighlight>
    )
  }
}

export const saleMessageOrBidInfo = (
  artwork: Readonly<{
    sale: { isAuction: boolean | null; isClosed: boolean | null } | null
    saleArtwork: { currentBid: { display: string | null } | null } | null
    saleMessage: string | null
  }>
): string | null | undefined => {
  const { sale, saleArtwork } = artwork
  const inRunningAuction = sale && sale.isAuction && !sale.isClosed
  const inClosedAuction = sale && sale.isAuction && sale.isClosed

  if (inClosedAuction) {
    return "Bidding closed"
  } else if (inRunningAuction) {
    return saleArtwork?.currentBid?.display
  }

  if (artwork.saleMessage === "Contact For Price") {
    return "Contact for price"
  }

  return artwork.saleMessage
}

export default createFragmentContainer(Artwork, {
  artwork: graphql`
    fragment ArtworkGridItem_artwork on Artwork {
      title
      date
      saleMessage
      slug
      artistNames
      href
      sale {
        isAuction
        isClosed
        displayTimelyAt
      }
      saleArtwork {
        currentBid {
          display
        }
      }
      image {
        url(version: "large")
        aspectRatio
      }
    }
  `,
})
