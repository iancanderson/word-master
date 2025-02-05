import { CellStatus, numbers } from '../core'
import { useEffect, useCallback } from 'react'

type Props = {
  charStatuses: { [key: string]: CellStatus }
  gameDisabled: boolean
  onDeletePress: () => void
  onEnterPress: () => void
  addLetter: (s: string) => void
  nextCharIsAnOperator: boolean
  validOperators: string[]
}

const Keyboard = ({
  charStatuses,
  addLetter,
  onEnterPress,
  onDeletePress,
  gameDisabled,
  nextCharIsAnOperator,
  validOperators,
}: Props) => {
  const getKeyStyle = (char: string): string => {
    switch (charStatuses[char]) {
      case CellStatus.Green:
        return 'bg-n-green text-gray-50'
      case CellStatus.Yellow:
        return 'bg-yellow-500 text-gray-50'
      case CellStatus.Gray:
        return 'bg-n-gray text-gray-50'
      case CellStatus.Unguessed:
        return 'text-primary dark:text-primary-dark'
    }
  }

  const onKeyButtonPress = (letter: string) => {
    letter = letter.toLowerCase()
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: letter,
      })
    )
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameDisabled) return

      const key = event.key.toUpperCase()

      if (key === 'ENTER') {
        onEnterPress()
        event.preventDefault()
      } else if (key === 'BACKSPACE') {
        onDeletePress()
      } else if (nextCharIsAnOperator) {
        if (validOperators.includes(key)) {
          addLetter(key)
        }
      } else if (numbers.includes(key)) {
        addLetter(key)
      }
    },
    [addLetter, onEnterPress, onDeletePress, gameDisabled, nextCharIsAnOperator, validOperators]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const keyboardChars = nextCharIsAnOperator
    ? [validOperators.slice(0, 3), validOperators.slice(3, 6)]
    : [numbers.slice(0, 6), numbers.slice(6, 10)]

  return (
    <div className="w-full flex flex-col items-center mb-3 select-none h-auto justify-end">
      {keyboardChars.map((row, idx) => (
        <div key={idx} className="w-full flex justify-center my-[5px]">
          {idx === 1 && (
            <button
              onClick={onEnterPress}
              className="h-10 xxs:h-14 w-12 px-1 text-xs font-medium mx-[3.5px] rounded nm-flat-background-sm dark:nm-flat-background-dark-sm text-primary dark:text-primary-dark"
            >
              ENTER
            </button>
          )}
          {row.map((letter) => (
            <button
              onClick={() => onKeyButtonPress(letter)}
              key={letter}
              className="h-10 xxs:h-14 w-[2rem] sm:w-10 mx-[3.5px] text-sm font-medium rounded-[4px] nm-flat-background-sm dark:nm-flat-background-dark-sm"
            >
              <div
                className={`h-full w-full rounded-[3px] flex items-center justify-center ${getKeyStyle(
                  letter
                )}`}
              >
                {letter}
              </div>
            </button>
          ))}
          {idx === 1 && (
            <button
              onClick={onDeletePress}
              className="h-10 xxs:h-14 w-12 flex items-center justify-center nm-flat-background-sm dark:nm-flat-background-dark-sm text-primary dark:text-primary-dark mx-[3.5px] text-sm  rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export { Keyboard }
