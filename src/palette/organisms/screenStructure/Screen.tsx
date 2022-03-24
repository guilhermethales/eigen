import { Wrap } from "app/utils/Wrap"
import { Flex } from "palette/elements"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BackButton } from "palette/atoms"
import {
  getChildByType,
  getChildrenByType,
  getChildrenByTypeDeep,
  removeChildrenByType,
} from "react-nanny"
import { createContext, useContext, useState, useEffect } from "react"

interface ScreenContextState {
  hasNonFloatingHeader?: boolean
}

interface ScreenContextValue {
  options: ScreenContextState
  setOptions: (opts: Partial<ScreenContextState>) => void
}

const ScreenContext = createContext<ScreenContextValue>(null!)

const ScreenWrapper = ({ children }: { children?: React.ReactNode }) => {
  const [options, setOptions] = useState<ScreenContextState>({})
  return (
    <ScreenContext.Provider value={{ options, setOptions }}>
      <ScreenRoot>{children}</ScreenRoot>
    </ScreenContext.Provider>
  )
}

const ScreenRoot = ({ children }: { children?: React.ReactNode }) => {
  const { options } = useContext(ScreenContext)
  const header = getChildByType(children, Screen.Header)
  const headerFloating = getChildByType(children, Screen.FloatingHeader)
  const background = getChildByType(children, Screen.Background)
  const bodyChildren = getChildrenByTypeDeep(children, Screen.Body)
  console.log("screenn", { options })

  return (
    <Flex flex={1}>
      {background /* fullscreen */}

      {header}
      {bodyChildren}

      {headerFloating /* floating, so keep close to the bottom */}
    </Flex>
  )
}

const useUpdateScreenContext = ({ floating }: { floating: boolean }) => {
  const { setOptions } = useContext(ScreenContext)

  useEffect(() => {
    console.log("screenn", { floating })
    setOptions({ hasNonFloatingHeader: !floating })
  }, [floating])
}

const NAVBAR_HEIGHT = 44

interface HeaderProps {
  onBack?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  useUpdateScreenContext({ floating: false })
  const insets = useSafeAreaInsets()

  return (
    <Flex
      mt={insets.top}
      height={NAVBAR_HEIGHT}
      px={SCREEN_HORIZONTAL_PADDING}
      flexDirection="row"
      alignItems="center"
      backgroundColor="orange"
    >
      <BackButton onPress={onBack} />
    </Flex>
  )
}

export const FloatingHeader: React.FC<HeaderProps> = ({ onBack }) => {
  useUpdateScreenContext({ floating: true })
  const insets = useSafeAreaInsets()

  if (onBack) {
    return (
      <Flex
        position="absolute"
        top={insets.top}
        left={0}
        right={0}
        height={NAVBAR_HEIGHT}
        px={SCREEN_HORIZONTAL_PADDING}
        flexDirection="row"
        alignItems="center"
        // backgroundColor="blue"
      >
        <BackButton onPress={onBack} />
      </Flex>
    )
  }
  return null
}

const SCREEN_HORIZONTAL_PADDING = 2

interface BodyProps {
  children?: React.ReactNode
  scroll?: boolean
  noSafe?: boolean
}

const Body = ({ scroll = false, noSafe = false, children }: BodyProps) => {
  const childrenExceptBottomView = removeChildrenByType(children, Screen.BottomView)
  const bottomView = getChildrenByType(children, Screen.BottomView)
  const { options } = useContext(ScreenContext)
  const insets = useSafeAreaInsets()
  const withSafeArea = !noSafe

  if (scroll) {
    return (
      <Flex
        flex={1}
        mt={withSafeArea ? insets.top : undefined}
        mb={withSafeArea ? insets.bottom : undefined}
        backgroundColor="pink"
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Flex px={SCREEN_HORIZONTAL_PADDING}>
            {childrenExceptBottomView}
            {bottomView}
          </Flex>
        </ScrollView>
      </Flex>
    )
  }

  return (
    <Flex
      flex={1}
      px={SCREEN_HORIZONTAL_PADDING}
      mt={withSafeArea ? insets.top : undefined}
      mb={withSafeArea ? insets.bottom : undefined}
      backgroundColor="pink"
    >
      {children}
    </Flex>
  )
}

const Background: React.FC = ({ children }) => {
  return (
    <Flex position="absolute" top={0} bottom={0} left={0} right={0}>
      {children}
    </Flex>
  )
}

const BottomView: React.FC = ({ children }) => {
  const insets = useSafeAreaInsets()
  return <Flex mb={insets.bottom}>{children}</Flex>
}

export const Screen = Object.assign(ScreenWrapper, {
  Body,
  Header,
  FloatingHeader,
  Background,
  BottomView,
})
