import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { classes } from '../data/school'
import { practiceBank } from '../data/practiceBanks'
import { useWorkspace } from '../lib/useWorkspace'
import { ensurePracticeHubNote } from '../lib/practiceNotes'
import { newId } from '../lib/workspace'

/** Legacy route — opens the practice hub note for this class. */
export default function PracticePage() {
  const { id } = useParams()
  const course = classes.find((c) => c.id === id)
  const bank = id ? practiceBank(id) : null
  const { ws, update } = useWorkspace(id)
  const nav = useNavigate()

  useEffect(() => {
    if (!id || !bank || !course || course.id === 'homeroom') return
    const { ws: next, noteId } = ensurePracticeHubNote(ws, id, newId)
    if (!noteId) return
    update(next)
    nav(`/class/${id}/note/${noteId}`, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (!course || !bank || course.id === 'homeroom') {
    return (
      <p>
        No practice pack here. <Link to="/">Back to desk</Link>
      </p>
    )
  }

  return (
    <p className="meta">
      Opening practice note… <Link to="/">Back to desk</Link>
    </p>
  )
}
