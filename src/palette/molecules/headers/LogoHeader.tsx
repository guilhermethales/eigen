import { Flex } from "palette/elements"
import { ArtsyLogoBlackIcon } from "palette/svgs"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { NAVBAR_HEIGHT } from "./constants"

export const LogoHeader: React.FC = () => {
  const insets = useSafeAreaInsets()
  return (
    <Flex
      mt={insets.top}
      height={NAVBAR_HEIGHT}
      flexDirection="row"
      backgroundColor={"orange"}
      alignItems="center"
      justifyContent={"center"}
      px={2}
    >
      <ArtsyLogoBlackIcon scale={0.75} />
    </Flex>
  )
}

// try it se ena Screen
