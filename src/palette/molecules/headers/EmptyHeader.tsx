import { BackButton } from "palette/atoms"
import { Flex } from "palette/elements"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { NAVBAR_HEIGHT } from "./constants"

interface EmptyHeaderProps {
  onBack?: () => void
}

export const EmptyHeader: React.FC<EmptyHeaderProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets()
  return (
    <Flex
      mt={insets.top}
      height={NAVBAR_HEIGHT}
      flexDirection="row"
      alignItems="center"
      px={2}
      backgroundColor="orange"
    >
      <BackButton onPress={onBack} />
    </Flex>
  )
}
