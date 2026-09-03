export type AnatomyLabel = {
  id: string
  n: number
  hint: string
  /** Canonical answer shown after check */
  answer: string
  /** Accepted forms (aliases + common variants) */
  accepted: string[]
}

/** Eye cross-section labeling — matches the blank callouts on /eye-anatomy.png */

/** Free Groningen / UMCG Sketchfab cutaway — CC BY-NC-SA, annotated for teaching. */
export const eyeAnatomyModel3d = {
  title: '3D eye · spin for reference',
  src: 'https://sketchfab.com/models/f7745aaff145485fb02cf729c96c5f37/embed?autostart=0&ui_theme=dark&ui_infos=0&ui_controls=1&ui_stop=0',
  credit: 'Anatomy of the Eye · E-learning UMCG (CC BY-NC-SA)',
  href: 'https://sketchfab.com/3d-models/anatomy-of-the-eye-f7745aaff145485fb02cf729c96c5f37',
}

export const eyeAnatomyLabels: AnatomyLabel[] = [
  {
    id: 'superior-rectus',
    n: 1,
    hint: 'Top exterior muscle (red)',
    answer: 'Superior rectus',
    accepted: ['superior rectus', 'superior rectus muscle', 'superior rectus m'],
  },
  {
    id: 'inferior-rectus',
    n: 2,
    hint: 'Bottom exterior muscle (red)',
    answer: 'Inferior rectus',
    accepted: ['inferior rectus', 'inferior rectus muscle', 'inferior rectus m'],
  },
  {
    id: 'conjunctiva',
    n: 3,
    hint: 'Left side, top — thin membrane over front of eye / lid lining',
    answer: 'Conjunctiva',
    accepted: ['conjunctiva', 'bulbar conjunctiva', 'conjunctival membrane'],
  },
  {
    id: 'cornea',
    n: 4,
    hint: 'Left — clear curved front surface',
    answer: 'Cornea',
    accepted: ['cornea', 'corneal'],
  },
  {
    id: 'anterior-chamber',
    n: 5,
    hint: 'Left — fluid space between cornea and iris',
    answer: 'Anterior chamber',
    accepted: ['anterior chamber', 'anterior cavity', 'aqueous chamber'],
  },
  {
    id: 'iris',
    n: 6,
    hint: 'Left — coloured ring that controls pupil size',
    answer: 'Iris',
    accepted: ['iris'],
  },
  {
    id: 'pupil',
    n: 7,
    hint: 'Left — opening in the centre of the iris',
    answer: 'Pupil',
    accepted: ['pupil', 'pupillary opening'],
  },
  {
    id: 'posterior-chamber',
    n: 8,
    hint: 'Left — narrow space behind iris, in front of lens',
    answer: 'Posterior chamber',
    accepted: ['posterior chamber'],
  },
  {
    id: 'suspensory-ligaments',
    n: 9,
    hint: 'Left lower — fibres holding the lens',
    answer: 'Suspensory ligaments',
    accepted: [
      'suspensory ligaments',
      'suspensory ligament',
      'zonules',
      'zonule of zinn',
      'zonules of zinn',
      'ciliary zonule',
      'zonular fibres',
      'zonular fibers',
    ],
  },
  {
    id: 'ciliary-body',
    n: 10,
    hint: 'Left bottom — pink muscle that shapes the lens',
    answer: 'Ciliary body',
    accepted: ['ciliary body', 'ciliary muscle'],
  },
  {
    id: 'ciliary-process',
    n: 11,
    hint: 'Inside, near front — folded edge of ciliary body',
    answer: 'Ciliary process',
    accepted: ['ciliary process', 'ciliary processes'],
  },
  {
    id: 'ora-serrata',
    n: 12,
    hint: 'Inside front — jagged junction of retina and ciliary region',
    answer: 'Ora serrata',
    accepted: ['ora serrata', 'ora serata'],
  },
  {
    id: 'vitreous',
    n: 13,
    hint: 'Right top — large gel filling the eyeball',
    answer: 'Vitreous humor',
    accepted: [
      'vitreous humor',
      'vitreous humour',
      'vitreous body',
      'vitreous',
      'vitreous gel',
    ],
  },
  {
    id: 'sclera',
    n: 14,
    hint: 'Right — tough outer white coat',
    answer: 'Sclera',
    accepted: ['sclera', 'sclerotic', 'sclerotic coat'],
  },
  {
    id: 'choroid',
    n: 15,
    hint: 'Right — middle vascular layer (pink/red under sclera)',
    answer: 'Choroid',
    accepted: ['choroid', 'choroid coat', 'choroidal layer'],
  },
  {
    id: 'retina',
    n: 16,
    hint: 'Right — innermost light-sensitive layer',
    answer: 'Retina',
    accepted: ['retina', 'neural retina'],
  },
  {
    id: 'fovea',
    n: 17,
    hint: 'Right — pit for sharp central vision',
    answer: 'Fovea centralis',
    accepted: ['fovea centralis', 'fovea', 'central fovea', 'macula', 'macula lutea'],
  },
  {
    id: 'optic-disc',
    n: 18,
    hint: 'Right — where optic nerve leaves (blind spot)',
    answer: 'Optic disc',
    accepted: [
      'optic disc',
      'optic disk',
      'blind spot',
      'optic nerve head',
      'optic papilla',
    ],
  },
  {
    id: 'optic-nerve',
    n: 19,
    hint: 'Right bottom — nerve bundle leaving the eye',
    answer: 'Optic nerve',
    accepted: ['optic nerve', 'cranial nerve ii', 'cn ii', 'cn2'],
  },
  {
    id: 'retinal-vessels',
    n: 20,
    hint: 'Bottom right — vessels through the optic nerve',
    answer: 'Central retinal artery and vein',
    accepted: [
      'central retinal artery and vein',
      'central retinal artery & vein',
      'central retinal vessels',
      'retinal artery and vein',
      'retinal artery & vein',
      'central retinal artery',
      'central retinal vein',
      'retinal blood vessels',
      'retinal vessels',
    ],
  },
]
