import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function chat() {
  const [messages, setMessages] = useState<IMessage[]>([])
  const insets = useSafeAreaInsets()

  
  const tabbarHeight = 50
  const keyboardBottomOffset = insets.bottom + tabbarHeight

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
      keyboardBottomOffset={keyboardBottomOffset}
    />
  )
}