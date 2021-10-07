import { themeGet } from "@styled-system/theme-get"
import _ from "lodash"
import { Color, EyeOpenedIcon, Flex, Spinner, Text, useTheme, XCircleIcon } from "palette"
import React, { useEffect, useImperativeHandle, useRef, useState } from "react"
import {
  LayoutAnimation,
  Platform,
  Text as RNText,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import styled from "styled-components/native"
import { EyeClosedIcon } from "../../svgs/EyeClosedIcon"
import { InputTitle } from "./InputTitle"

export const INPUT_HEIGHT = 50

export interface InputProps extends Omit<TextInputProps, "placeholder"> {
  containerStyle?: React.ComponentProps<typeof Flex>["style"]
  description?: string
  error?: string
  icon?: JSX.Element
  loading?: boolean
  disabled?: boolean
  required?: boolean
  title?: string
  /**
   * The placeholder can be an array of string, specifically for android, because of a bug.
   * On ios, the longest string will always be picked, as ios can add ellipsis.
   * On android, the longest string **that fits** will be picked, as android doesn't use ellipsis.
   * The way to use it is to put the longest string first, and the shortest string last.
   *
   * Check `HACKS.md` for more info.
   *
   * @example
   * const placeholders = [
   *   "Wow this is a great and very long placeholder",
   *   "Wow this is a great and long placeholder",
   *   "Wow this is a great placeholder",
   *   "Wow",
   * ]
   * ...
   * <Input
   *   placeholder={placeholders}
   * />
   */
  placeholder?: string | string[]
  enableClearButton?: boolean
  canHidePassword?: boolean
  inputTextStyle?: TextStyle
  onClear?(): void
  renderLeftHandSection?(): JSX.Element
}

export type Input = TextInput
/**
 * Input component
 */
export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      containerStyle,
      description,
      disabled,
      error,
      icon,
      loading,
      required,
      enableClearButton,
      title,
      renderLeftHandSection,
      secureTextEntry = false,
      textContentType,
      canHidePassword,
      inputTextStyle,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const { color, theme } = useTheme()
    const [focused, setFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(!secureTextEntry)
    const [value, setValue] = useState(rest.value ?? rest.defaultValue ?? "")
    const input = useRef<TextInput>()

    const localClear = () => {
      input.current?.clear()
      localOnChangeText("")
      rest.onClear?.()
    }

    useImperativeHandle(ref, () => input.current!)

    const fontFamily = theme.fonts.sans.regular

    useEffect(() => {
      /* to make the font work for secure text inputs,
      see https://github.com/facebook/react-native/issues/30123#issuecomment-711076098 */
      input.current?.setNativeProps({
        style: { fontFamily },
      })
    }, [fontFamily])

    const renderShowPasswordIcon = () => {
      if (!secureTextEntry) {
        return
      }
      return (
        <Flex pr="1" justifyContent="center" flexGrow={0}>
          <TouchableOpacity
            onPress={() => {
              setShowPassword(!showPassword)
            }}
            hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
          >
            {!showPassword ? <EyeClosedIcon fill="black30" /> : <EyeOpenedIcon fill="black60" />}
          </TouchableOpacity>
        </Flex>
      )
    }

    const localOnChangeText = (text: string) => {
      setValue(text)
      rest.onChangeText?.(text)
    }

    const placeholderWidths = useRef<number[]>([])
    const [inputWidth, setInputWidth] = useState(0)
    const placeholderMeasuringHack =
      Platform.OS === "android" && _.isArray(placeholder) ? (
        <View
          style={{
            position: "absolute",
            top: -10000, // make sure its off the screen
            width: 10000, // make sure Texts can take as much space as they need
            alignItems: "baseline", // this is to make Texts get the smallest width they can get to fit the text
          }}
        >
          {placeholder.map((placeholderString, index) => (
            <RNText
              key={index}
              onLayout={(event) => {
                placeholderWidths.current[index] = event.nativeEvent.layout.width
              }}
              numberOfLines={1}
              style={{
                borderColor: "red",
                borderWidth: 1,
                flex: 1,
                fontFamily,
                fontSize: 15,
                textAlign: "left",
                ...inputTextStyle,
              }}
            >
              {placeholderString}
            </RNText>
          ))}
        </View>
      ) : null

    const actualPlaceholder = () => {
      if (placeholder === undefined) {
        return placeholder
      }

      // ios works well. just return the longest placeholder
      if (Platform.OS === "ios") {
        return _.isArray(placeholder) ? placeholder[0] : placeholder
      }

      // if it's android and we only have one string, return that string
      if (_.isString(placeholder)) {
        return placeholder
      }

      // otherwise, find a placeholder that has longest width that fits in the inputtext
      const longestFittingStringIndex = placeholderWidths.current.findIndex((placeholderWidth) => {
        return placeholderWidth <= inputWidth
      })
      if (longestFittingStringIndex > -1) {
        return placeholder[longestFittingStringIndex]
      }

      // otherwise just return the shortest placeholder
      return placeholder[placeholder.length - 1]
    }

    return (
      <Flex flexGrow={1} style={containerStyle}>
        <InputTitle required={required}>{title}</InputTitle>

        {!!description && (
          <Text color="black60" variant="xs" mb={0.5}>
            {description}
          </Text>
        )}
        <TouchableWithoutFeedback onPressIn={() => input.current?.focus()}>
          <View
            style={[
              rest.style,
              {
                flexDirection: "row",
                borderWidth: 1,
                borderColor: color(computeBorderColor({ disabled, error: !!error, focused })),
                height: INPUT_HEIGHT,
                backgroundColor: disabled ? color("black5") : color("white100"),
              },
            ]}
          >
            {renderLeftHandSection?.()}
            {!!icon && (
              <Flex pl="1" justifyContent="center" flexGrow={0}>
                {icon}
              </Flex>
            )}
            <Flex flex={1}>
              {placeholderMeasuringHack}
              <StyledInput
                editable={!disabled}
                onLayout={(event) => {
                  const newWidth = event.nativeEvent.layout.width
                  if (newWidth > inputWidth) {
                    requestAnimationFrame(() => setInputWidth(newWidth))
                  } else {
                    setInputWidth(newWidth)
                  }
                }}
                ref={input}
                placeholderTextColor={color("black60")}
                style={{ flex: 1, fontSize: 16, ...inputTextStyle }}
                numberOfLines={1}
                secureTextEntry={!showPassword}
                textAlignVertical="center"
                placeholder={actualPlaceholder()}
                value={value}
                {...(rest as any)}
                onChangeText={localOnChangeText}
                onFocus={(e) => {
                  if (Platform.OS === "android") {
                    LayoutAnimation.configureNext(LayoutAnimation.create(60, "easeInEaseOut", "opacity"))
                  }
                  setFocused(true)
                  rest.onFocus?.(e)
                }}
                onBlur={(e) => {
                  if (Platform.OS === "android") {
                    LayoutAnimation.configureNext(LayoutAnimation.create(60, "easeInEaseOut", "opacity"))
                  }
                  setFocused(false)
                  rest.onBlur?.(e)
                }}
              />
            </Flex>
            {renderShowPasswordIcon()}
            {loading ? (
              <Flex pr="3" justifyContent="center" flexGrow={0}>
                <Spinner
                  size="medium"
                  style={{ marginLeft: 3, width: 15, height: 4, backgroundColor: color("black60") }}
                />
              </Flex>
            ) : (
              !!(value !== undefined && value !== "" && enableClearButton) && (
                <Flex pr="1" justifyContent="center" flexGrow={0}>
                  <TouchableOpacity
                    onPress={() => {
                      localClear()
                    }}
                    hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
                    accessibilityLabel="Clear input button"
                  >
                    <XCircleIcon fill="black30" />
                  </TouchableOpacity>
                </Flex>
              )
            )}
          </View>
        </TouchableWithoutFeedback>
        {!!error && (
          <Text color="red100" mt={1} variant="xs">
            {error}
          </Text>
        )}
      </Flex>
    )
  }
)

export interface InputStatus {
  disabled?: boolean
  error?: boolean
  focused?: boolean
}

/**
 * func to compute border color
 */
export const computeBorderColor = (inputStatus: InputStatus): Color => {
  const { disabled, error, focused } = inputStatus

  if (disabled) {
    return "black30"
  }
  if (error) {
    return "red100"
  }
  if (focused) {
    return "black60"
  }
  return "black30"
}

const StyledInput = styled(TextInput)`
  padding: 0;
  margin: 0 ${themeGet("space.1")}px;
  font-family: ${themeGet("fonts.sans.regular")};
`
StyledInput.displayName = "StyledInput"