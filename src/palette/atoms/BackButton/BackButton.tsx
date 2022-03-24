import { ChevronIcon, CloseIcon } from "palette/svgs"
import { TouchableOpacity } from "react-native"

interface BackButtonProps {
  onPress?: () => void
  showX?: boolean
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, showX = false }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {showX ? (
        <CloseIcon fill="black100" width={26} height={26} />
      ) : (
        <ChevronIcon direction="left" />
      )}
    </TouchableOpacity>
  )
}
