import { useAuth } from '../lib/AuthContext'
import EmojiLogCalendar from './EmojiLogCalendar'

export default function ProductivityCalendar() {
  const { studio, patchProductivity } = useAuth()
  return (
    <EmojiLogCalendar
      book={studio.productivity}
      onChange={patchProductivity}
      keyKicker="Productivity key"
      keyHeading="Define your levels"
      keyHint="Pick an emoji and write what that level means for you."
      pickEmpty="Pick a productivity level for this day."
      draftFallback="🎯"
      emojiLabel="Productivity emoji"
      meaningLabel="Productivity meaning"
    />
  )
}
