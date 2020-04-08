import { Button, Theme } from "@artsy/palette"
import { ArtistConsignButtonTestsQuery } from "__generated__/ArtistConsignButtonTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { cloneDeep } from "lodash"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import ReactTestRenderer, { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { ArtistConsignButtonFragmentContainer, tests } from "../ArtistConsignButton"

jest.unmock("react-relay")

describe("ArtistConsignButton", () => {
  let env: ReturnType<typeof createMockEnvironment>
  const trackEvent = jest.fn()

  const TestRenderer = () => (
    <QueryRenderer<ArtistConsignButtonTestsQuery>
      environment={env}
      query={graphql`
        query ArtistConsignButtonTestsQuery @relay_test_operation {
          artist(id: "alex-katz") {
            ...ArtistConsignButton_artist
          }
        }
      `}
      variables={{ id: "alex-katz" }}
      render={({ props, error }) => {
        if (props) {
          return (
            <Theme>
              <ArtistConsignButtonFragmentContainer artist={props.artist} />
            </Theme>
          )
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    env = createMockEnvironment()
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  describe("Top 20 Artist ('Microfunnel') Button", () => {
    const response = {
      artist: {
        targetSupply: {
          isInMicrofunnel: true,
        },
        internalID: "fooBarBaz",
        slug: "alex-katz",
        name: "Alex Katz",
        href: "/artist/alex-katz",
        image: {
          cropped: {
            url:
              "https://d7hftxdivxxvm.cloudfront.net?resize_to=fill&width=75&height=66&quality=80&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FbrHdWfNxoereaVk2VOneuw%2Flarge.jpg",
          },
        },
        id: "QXJ0aXN0OjRkOGQxMjBjODc2YzY5N2FlMTAwMDA0Ng==",
      },
    }

    it("renders with data", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("ArtistConsignButtonTestsQuery")
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      expect(tree.root.findAllByType(tests.Image)).toHaveLength(1)
      expect(extractText(tree.root)).toContain("Sell your Alex Katz")
    })

    it("guards against missing imageURL", async () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        const responseWithoutImage = cloneDeep(response)
        responseWithoutImage.artist.image = null
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: responseWithoutImage,
        })
      })
      const image = tree.root.findAllByType(tests.Image)
      expect(image).toHaveLength(0)
    })

    it("tracks clicks on outer container", async () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      tree.root.findByType(TouchableOpacity).props.onPress()
      expect(trackEvent).toHaveBeenCalledWith({
        context_page: "Artist",
        context_page_owner_id: response.artist.internalID,
        context_page_owner_slug: response.artist.slug,
        context_page_owner_type: "Artist",
        context_module: "ArtistConsignment",
        subject: "Get Started",
        destination_path: "/consign/submission",
      })
    })

    it("tracks clicks on inner button", async () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      tree.root.findByType(Button).props.onPress()
      expect(trackEvent).toHaveBeenCalledWith({
        context_page: "Artist",
        context_page_owner_id: response.artist.internalID,
        context_page_owner_slug: response.artist.slug,
        context_page_owner_type: "Artist",
        context_module: "ArtistConsignment",
        subject: "Get Started",
        destination_path: "/consign/submission",
      })
    })
  })

  describe("Button for artists not in Microfunnel", () => {
    const response: any = {
      artist: {
        targetSupply: {
          isInMicrofunnel: false,
        },
        internalID: "fooBarBaz",
        slug: "alex-katz",
        name: "Alex Katz",
        href: "/artist/alex-katz",
        id: "QXJ0aXN0OjRkOGQxMjBjODc2YzY5N2FlMTAwMDA0Ng==",
      },
    }

    it("renders with data", () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      const image = tree.root.findAllByType(tests.Image)
      expect(image).toHaveLength(0)
      expect(extractText(tree.root)).toContain("Sell art from your collection")
    })

    it("tracks clicks on outer container", async () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      tree.root.findByType(TouchableOpacity).props.onPress()
      expect(trackEvent).toHaveBeenCalledWith({
        context_page: "Artist",
        context_page_owner_id: response.artist.internalID,
        context_page_owner_slug: response.artist.slug,
        context_page_owner_type: "Artist",
        context_module: "ArtistConsignment",
        subject: "Get Started",
        destination_path: "/consign/submission",
      })
    })

    it("tracks clicks on inner button", async () => {
      const tree = ReactTestRenderer.create(<TestRenderer />)
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: response,
        })
      })
      tree.root.findByType(Button).props.onPress()
      expect(trackEvent).toHaveBeenCalledWith({
        context_page: "Artist",
        context_page_owner_id: response.artist.internalID,
        context_page_owner_slug: response.artist.slug,
        context_page_owner_type: "Artist",
        context_module: "ArtistConsignment",
        subject: "Get Started",
        destination_path: "/consign/submission",
      })
    })
  })
})
