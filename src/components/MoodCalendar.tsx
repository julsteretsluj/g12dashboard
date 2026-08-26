import { useAuth } from '../lib/AuthContext'
import EmojiLogCalendar from './EmojiLogCalendar'

export default function MoodCalendar() {
  const { studio, patchMoods } = useAuth()
  return (
    <EmojiLogCalendar
      book={studio.moods}
      onChange={patchMoods}
      keyKicker="Mood key"
      keyHeading="Make your own meanings"
      keyHint="Pick an emoji and write what it means. You’ll read the pattern back later."
      pickEmpty="Pick a mood key for this day."
      draftFallback="🙂"
      draftColorFallback="#A8D5A2"
      emojiLabel="Mood emoji"
      meaningLabel="Mood meaning"
    />
  )
}
