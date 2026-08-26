import type { PracticeQ } from './practiceNeurons'

export type PracticeSubjectId = 'bio' | 'social' | 'cts' | 'art'

type BankQ = Omit<PracticeQ, 'id'>

const bio: BankQ[] = [
  {
    prompt: 'Dendrites on a neuron mainly',
    choices: [
      'Carry the spike away from the cell body',
      'Receive incoming signals from other cells',
      'Make myelin for the axon',
      'Store neurotransmitters only',
    ],
    correct: 1,
    explain: 'Dendrites take in chemical signals at synapses; the axon sends the action potential out.',
  },
  {
    prompt: 'A typical resting membrane potential is closest to',
    choices: ['0 mV', '+30 mV', '−70 mV', '+70 mV'],
    correct: 2,
    explain: 'At rest the inside of the neuron is negative relative to the outside, around −70 mV.',
  },
  {
    prompt: 'During the rising phase of an action potential,',
    choices: [
      'K+ rushes out through leak channels only',
      'Na+ rushes in through voltage-gated channels',
      'The pump reverses and dumps K+ out',
      'Myelin blocks all ion movement',
    ],
    correct: 1,
    explain: 'Threshold opens voltage-gated sodium channels; Na+ floods in and depolarizes the membrane.',
  },
  {
    prompt: 'Insulin is released mainly when blood glucose is',
    choices: ['High', 'Low', 'Unchanged for days', 'Only during sleep'],
    correct: 0,
    explain: 'Beta cells in the pancreas release insulin after a meal so cells can take up glucose.',
  },
  {
    prompt: 'In a reflex arc, the usual order is',
    choices: [
      'Motor → sensory → brain → muscle',
      'Sensory → interneuron → motor → effector',
      'Hormone → kidney → liver → lung',
      'Axon → myelin → pump → dendrite',
    ],
    correct: 1,
    explain: 'Receptor to sensory neuron, often an interneuron in the cord, then motor neuron to the effector.',
  },
  {
    prompt: 'Homeostasis means the body',
    choices: [
      'Stops all change forever',
      'Keeps internal conditions in a workable range',
      'Only responds to external temperature',
      'Uses one organ for every job',
    ],
    correct: 1,
    explain: 'Feedback loops keep variables like temperature, glucose, and pH within limits.',
  },
  {
    prompt: 'The sodium–potassium pump (per ATP) moves',
    choices: [
      '2 Na+ in, 3 K+ out',
      '3 Na+ out, 2 K+ in',
      'Equal Na+ and K+ both ways',
      'Only Cl− across the membrane',
    ],
    correct: 1,
    explain: 'Three sodium ions out and two potassium ions in helps keep the inside negative.',
  },
  {
    prompt: 'Afferent (sensory) pathways mainly',
    choices: [
      'Carry commands from CNS to muscle or gland',
      'Carry information from receptors toward the CNS',
      'Live only in the brain and never leave',
      'Produce myelin in the PNS',
    ],
    correct: 1,
    explain: 'Afferent paths bring sensory information in; efferent paths send motor commands out.',
  },
]

const social: BankQ[] = [
  {
    prompt: 'Classical liberalism most strongly emphasizes',
    choices: [
      'Collective ownership of industry',
      'Individual rights, limited government, and free markets',
      'Absolute monarchy by divine right',
      'One-party control of all media',
    ],
    correct: 1,
    explain: 'Think Locke, Mill, and early industrial liberalism: liberty, property, and restraint on the state.',
  },
  {
    prompt: 'Modern liberalism tends to accept more government action to',
    choices: [
      'Erase all private property',
      'Promote equality of opportunity and a social safety net',
      'Ban all markets',
      'Restore feudal ranks',
    ],
    correct: 1,
    explain: 'Progressive taxation, public education, and welfare programs sit inside a still-liberal framework.',
  },
  {
    prompt: 'Collectivism prioritizes',
    choices: [
      'The individual over the group in every case',
      'Group goals, cooperation, and shared responsibility',
      'Only short-term stock prices',
      'Isolation from society',
    ],
    correct: 1,
    explain: 'Common good, equality, and collective decision-making sit near the collectivist end of the spectrum.',
  },
  {
    prompt: 'A command economy mainly relies on',
    choices: [
      'Consumer demand alone setting all prices',
      'Central planning to allocate resources',
      'Barter between villages only',
      'Random lotteries for every good',
    ],
    correct: 1,
    explain: 'Planners decide production and distribution rather than leaving it entirely to markets.',
  },
  {
    prompt: 'During the Cold War, containment aimed to',
    choices: [
      'Spread communism into Western Europe',
      'Limit the expansion of Soviet influence',
      'Abolish NATO immediately',
      'Unite East and West Germany under Stalin',
    ],
    correct: 1,
    explain: 'U.S. and allied strategy tried to stop communism from spreading without always fighting a full hot war.',
  },
  {
    prompt: 'Charter rights in Canada protect individuals mainly from',
    choices: [
      'Only private companies',
      'Unjustified government interference',
      'Weather emergencies',
      'Provincial school exams',
    ],
    correct: 1,
    explain: 'The Charter limits what government can do to people; courts review laws against those rights.',
  },
  {
    prompt: 'Propaganda is information designed mainly to',
    choices: [
      'Present every side with equal weight',
      'Shape opinion, often by selective or emotional messaging',
      'Replace all textbooks with data tables',
      'Measure GDP only',
    ],
    correct: 1,
    explain: 'It persuades; it is not neutral analysis. Critique sources and motives in Social 30-1.',
  },
  {
    prompt: 'Self-interest as a liberal value means people may',
    choices: [
      'Never help others',
      'Pursue their own goals within rules that protect others’ rights',
      'Ignore all contracts',
      'Abolish competition by law',
    ],
    correct: 1,
    explain: 'Liberalism assumes individuals chase their aims under a framework of rights and law.',
  },
]

const cts: BankQ[] = [
  {
    prompt: 'In a solid design process, you usually start by',
    choices: [
      'Jumping straight to a final paint job',
      'Clarifying the problem, users, and constraints',
      'Throwing away every sketch',
      'Skipping safety checks',
    ],
    correct: 1,
    explain: 'Define the need before you prototype — scope, audience, materials, and limits.',
  },
  {
    prompt: 'A prototype is mainly for',
    choices: [
      'Shipping the final product with no changes',
      'Testing ideas cheaply and learning what fails',
      'Replacing documentation forever',
      'Avoiding feedback from users',
    ],
    correct: 1,
    explain: 'Build, test, revise. Failures in a prototype are cheaper than failures after launch.',
  },
  {
    prompt: 'Before using a saw or heat tool in the makerspace, you should',
    choices: [
      'Assume everyone already knows the risk',
      'Check PPE, clear the area, and follow teacher/safety rules',
      'Work alone with music at full volume',
      'Disable guards for speed',
    ],
    correct: 1,
    explain: 'CTS shop culture is safety-first: glasses, awareness, and the right setup.',
  },
  {
    prompt: 'Version control (even simple file naming) helps you',
    choices: [
      'Lose older drafts on purpose',
      'Track changes and recover earlier ideas',
      'Avoid documenting anything',
      'Only work on paper forever',
    ],
    correct: 1,
    explain: 'Dated filenames or git history keep iterations readable when something breaks.',
  },
  {
    prompt: 'Good digital citizenship includes',
    choices: [
      'Sharing passwords with friends for speed',
      'Respecting privacy, citing sources, and thinking before you post',
      'Copying paid software without a license',
      'Ignoring accessibility for users',
    ],
    correct: 1,
    explain: 'Ethics online and offline: consent, credit, and care for your audience.',
  },
  {
    prompt: 'When estimating a project timeline, a useful habit is to',
    choices: [
      'Assume zero testing time',
      'Add buffer for revisions, materials, and unexpected bugs',
      'Promise the earliest possible date with no plan',
      'Skip milestones entirely',
    ],
    correct: 1,
    explain: 'Real builds slip. Buffer and checkpoints keep CTS projects honest.',
  },
  {
    prompt: 'User feedback is most useful when it is',
    choices: [
      'Ignored until after the grade',
      'Specific, observed, and tied to a task the user tried',
      'Only compliments with no details',
      'Collected after you delete the prototype',
    ],
    correct: 1,
    explain: 'Watch someone use it; note friction. Vague praise does not improve the design.',
  },
  {
    prompt: 'Documenting your build (photos, steps, decisions) mainly helps',
    choices: [
      'Nobody except the printer',
      'You explain process, justify choices, and redo work later',
      'Hide mistakes from your teacher',
      'Replace the need to finish the product',
    ],
    correct: 1,
    explain: 'CTS marks often care about process as much as the artifact.',
  },
]

const art: BankQ[] = [
  {
    prompt: 'The “elements of art” commonly include',
    choices: [
      'Only price and frame size',
      'Line, shape, form, color, value, texture, space',
      'Only oil and acrylic',
      'Audience applause only',
    ],
    correct: 1,
    explain: 'Those building blocks show up across media in Art 30 critiques and planning.',
  },
  {
    prompt: 'Composition is mainly about',
    choices: [
      'How materials are priced',
      'How parts are arranged so the eye moves through the work',
      'Signing the back of the canvas only',
      'Mixing paint until it dries',
    ],
    correct: 1,
    explain: 'Balance, focal point, rhythm, and negative space guide attention.',
  },
  {
    prompt: 'Value in art usually refers to',
    choices: [
      'How expensive the piece is',
      'Lightness and darkness of tones',
      'Only the moral message',
      'The gallery’s opening hours',
    ],
    correct: 1,
    explain: 'Value contrast creates depth and focus, separate from hue.',
  },
  {
    prompt: 'A strong critique statement usually',
    choices: [
      'Only says “I like it” or “I hate it”',
      'Describes what you see, then interprets with evidence from the work',
      'Ignores media and process',
      'Compares only to memes',
    ],
    correct: 1,
    explain: 'Describe → analyze → interpret → evaluate. Point to the work, not vibes alone.',
  },
  {
    prompt: 'Negative space is',
    choices: [
      'Paint that failed quality control',
      'The empty or background areas that shape the subject',
      'Only black paint',
      'A type of illegal gallery',
    ],
    correct: 1,
    explain: 'What you leave open can define the subject as much as what you fill.',
  },
  {
    prompt: 'Choosing a medium (charcoal, acrylic, digital…) should mainly follow',
    choices: [
      'Whatever is closest on the shelf, always',
      'Your intent, time, and what the materials can express',
      'Only the most expensive option',
      'Avoiding any new skill',
    ],
    correct: 1,
    explain: 'Match tools to concept and constraints — Art 30 rewards deliberate choices.',
  },
  {
    prompt: 'A focal point is',
    choices: [
      'The only place you may sign',
      'Where the eye is meant to land first',
      'Always the exact center of the page',
      'A type of glue',
    ],
    correct: 1,
    explain: 'Contrast, placement, and detail pull attention to what matters most.',
  },
  {
    prompt: 'Process work (sketches, studies, iterations) matters because it',
    choices: [
      'Wastes studio time',
      'Shows thinking, risk, and how the idea improved',
      'Replaces the final piece entirely',
      'Is never graded',
    ],
    correct: 1,
    explain: 'Studios and portfolios weigh exploration, not only the polished end.',
  },
]

const banks: Record<PracticeSubjectId, { title: string; blurb: string; questions: BankQ[] }> = {
  bio: {
    title: 'Biology 30',
    blurb: 'Neurons, homeostasis, and systems — unofficial desk drill.',
    questions: bio,
  },
  social: {
    title: 'Social Studies 30-1',
    blurb: 'Ideologies, rights, and Cold War habits of mind.',
    questions: social,
  },
  cts: {
    title: 'CTS 30',
    blurb: 'Design process, safety, and makerspace judgment.',
    questions: cts,
  },
  art: {
    title: 'Art 30',
    blurb: 'Elements, composition, and critique language.',
    questions: art,
  },
}

export const practiceSubjectIds = Object.keys(banks) as PracticeSubjectId[]

export function practiceBank(id: string) {
  if (id in banks) return banks[id as PracticeSubjectId]
  return null
}

export function clonePracticeBank(id: PracticeSubjectId, makeId: () => string): PracticeQ[] {
  return banks[id].questions.map((q) => ({ ...q, id: makeId() }))
}
