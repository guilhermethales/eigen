import { Box, Flex, Text, useColor } from "palette"
import React, { Dispatch, SetStateAction } from "react"
import { TouchableOpacity, View } from "react-native"

export type TabsType = Array<{
  label: string
}>

interface TabProps {
  label: string
  active: boolean
  onPress: () => void
}

/**
 * The render method for an individual tab. Will underline the currently
 * active tab.
 */
export const TabV2: React.FC<TabProps> = ({ label, active, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          height: 55,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 15,
        }}
      >
        <Text variant={active ? "mediumText" : "text"}>{label}</Text>
      </View>
    </TouchableOpacity>
  )
}

interface TabsProps {
  setActiveTab: Dispatch<SetStateAction<number>>
  activeTab: number
  tabs: TabsType
}

/**
 * Renders a list of tabs. Evenly-spaces them across the screen.
 */
export const V2Tabs: React.FC<TabsProps> = ({ setActiveTab, activeTab, tabs }) => {
  const color = useColor()
  const tabWidth = 100 / tabs.length
  return (
    <Flex
      flexDirection="row"
      backgroundColor="white"
      borderBottomColor={color("black10")}
      borderBottomWidth="1px"
      px="2"
    >
      {tabs.map(({ label }, index) => {
        const active = activeTab === index
        return (
          <Box
            width={`${tabWidth}%`}
            borderBottomColor={active ? color("black100") : "transparent"}
            borderBottomWidth="2px"
            position="relative"
            bottom="-1px"
            key={label}
          >
            <TabV2 label={label} onPress={() => setActiveTab(index)} active={active} />
          </Box>
        )
      })}
    </Flex>
  )
}