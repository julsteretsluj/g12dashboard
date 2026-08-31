import type { PracticeQ } from './practiceNeurons'

export type PracticeSubjectId = 'bio' | 'social' | 'cts' | 'art'

type BankQ = Omit<PracticeQ, 'id'>

export type PracticeTestSet = {
  id: string
  title: string
  blurb: string
  questions: BankQ[]
}

type SubjectBank = {
  title: string
  blurb: string
  sets: PracticeTestSet[]
}

const bioSets: PracticeTestSet[] = [
  {
    id: 'neurons',
    title: 'Neurons & membrane',
    blurb: 'Dendrites, resting potential, and the sodium–potassium pump.',
    questions: [
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
        prompt: 'Schwann cells in the PNS mainly',
        choices: [
          'Release dopamine into the cleft',
          'Wrap axons in myelin',
          'Form the blood–brain barrier',
          'Carry sensory information to the spinal cord',
        ],
        correct: 1,
        explain: 'Schwann cells myelinate peripheral axons. Oligodendrocytes do the equivalent job in the CNS.',
      },
    ],
  },
  {
    id: 'action-potential',
    title: 'Action potential & synapses',
    blurb: 'Depolarization, repolarization, myelin, and chemical signaling.',
    questions: [
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
        prompt: 'Repolarization is mainly caused by',
        choices: [
          'Na+ continuing to enter',
          'K+ leaving through voltage-gated potassium channels',
          'The pump reversing direction',
          'Neurotransmitter binding at the dendrite',
        ],
        correct: 1,
        explain: 'Potassium efflux brings the membrane potential back down toward rest.',
      },
      {
        prompt: 'Myelin speeds conduction because it',
        choices: [
          'Stores extra sodium along the axon',
          'Lets the impulse jump between nodes of Ranvier',
          'Removes the need for a threshold',
          'Converts the signal from electrical to hormonal',
        ],
        correct: 1,
        explain: 'Saltatory conduction: the action potential is regenerated at the unmyelinated nodes.',
      },
      {
        prompt: 'At a chemical synapse, calcium entering the terminal is important because it',
        choices: [
          'Opens sodium channels on the same cell’s dendrites',
          'Triggers vesicle fusion and neurotransmitter release',
          'Pumps potassium back into the cleft',
          'Myelinates the postsynaptic membrane',
        ],
        correct: 1,
        explain: 'Voltage-gated Ca2+ channels open; calcium is the cue for synaptic vesicles to dump transmitter.',
      },
    ],
  },
  {
    id: 'homeostasis',
    title: 'Homeostasis & hormones',
    blurb: 'Feedback loops, glucose control, and keeping variables in range.',
    questions: [
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
        prompt: 'Insulin is released mainly when blood glucose is',
        choices: ['High', 'Low', 'Unchanged for days', 'Only during sleep'],
        correct: 0,
        explain: 'Beta cells in the pancreas release insulin after a meal so cells can take up glucose.',
      },
      {
        prompt: 'Glucagon is released mainly when blood glucose is',
        choices: [
          'High after a large meal',
          'Low and the liver needs to release stored glucose',
          'Exactly at 5.0 mmol/L always',
          'Only during exercise in cold water',
        ],
        correct: 1,
        explain: 'Alpha cells release glucagon when glucose drops; the liver breaks down glycogen to raise it.',
      },
      {
        prompt: 'Negative feedback in homeostasis means',
        choices: [
          'A change triggers a response that reverses the change',
          'The body always amplifies every signal',
          'Only hormones can participate',
          'Temperature never changes',
        ],
        correct: 0,
        explain: 'The response opposes the stimulus — like sweating when you overheat.',
      },
    ],
  },
  {
    id: 'pathways',
    title: 'Reflexes & neural pathways',
    blurb: 'Sensory vs motor paths, reflex arcs, and all-or-none firing.',
    questions: [
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
      {
        prompt: 'An all-or-none action potential means',
        choices: [
          'A bigger stimulus makes a taller spike',
          'Once threshold is reached, the spike has a set size',
          'Only motor neurons can fire',
          'The synapse must use two transmitters',
        ],
        correct: 1,
        explain: 'Strength of stimulus is coded by frequency of spikes, not by making one giant depolarization.',
      },
      {
        prompt: 'Acetylcholinesterase’s job at a neuromuscular synapse is to',
        choices: [
          'Synthesize acetylcholine in the terminal',
          'Break down acetylcholine so the signal can stop',
          'Block calcium from entering',
          'Carry the impulse down the muscle T-tubule',
        ],
        correct: 1,
        explain: 'Clearing ACh from the cleft lets the postsynaptic membrane reset instead of firing forever.',
      },
    ],
  },
]

const socialSets: PracticeTestSet[] = [
  {
    id: 'liberalism',
    title: 'Classical & modern liberalism',
    blurb: 'Individual rights, limited government, and the social safety net.',
    questions: [
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
      {
        prompt: 'Rule of law in a liberal democracy means',
        choices: [
          'Leaders are above the constitution',
          'Laws apply equally and constrain government power',
          'Only courts may vote in elections',
          'Markets replace all legislation',
        ],
        correct: 1,
        explain: 'Even those in power must follow written, publicly known rules.',
      },
    ],
  },
  {
    id: 'collectivism',
    title: 'Collectivism & economics',
    blurb: 'Group goals, planned vs market allocation, and the common good.',
    questions: [
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
        prompt: 'A mixed economy typically includes',
        choices: [
          'Only state farms and no private business',
          'Both market exchange and some public regulation or services',
          'No taxes or laws',
          'Barter as the only legal trade',
        ],
        correct: 1,
        explain: 'Most modern states blend private enterprise with public education, health, and regulation.',
      },
      {
        prompt: 'Equality of outcome differs from equality of opportunity because it focuses on',
        choices: [
          'Everyone receiving identical final results regardless of effort',
          'Fair starting conditions and access only',
          'Banning all competition',
          'Eliminating all government',
        ],
        correct: 0,
        explain: 'Outcome equality stresses similar end results; opportunity equality stresses fair chances to compete.',
      },
    ],
  },
  {
    id: 'cold-war',
    title: 'Cold War & ideology',
    blurb: 'Containment, superpower rivalry, and competing world views.',
    questions: [
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
        prompt: 'The Iron Curtain metaphor referred to',
        choices: [
          'A physical wall around Paris',
          'The divide between Soviet-influenced Eastern Europe and the West',
          'Trade barriers inside Canada only',
          'A naval blockade of Cambodia',
        ],
        correct: 1,
        explain: 'Churchill’s phrase captured the ideological and physical split after WWII.',
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
        prompt: 'NATO was formed mainly to',
        choices: [
          'Spread colonial empires in Asia',
          'Provide collective defence among Western allies against Soviet threat',
          'Run all European elections',
          'Replace the United Nations',
        ],
        correct: 1,
        explain: 'Article 5 mutual defence tied North American and Western European allies together.',
      },
    ],
  },
  {
    id: 'rights',
    title: 'Charter rights & citizenship',
    blurb: 'Canadian rights, limits on government, and responsible citizenship.',
    questions: [
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
        prompt: 'Section 1 of the Charter allows rights to be',
        choices: [
          'Ignored whenever convenient',
          'Limited by reasonable limits demonstrably justified in a free society',
          'Applied only to citizens over 18',
          'Suspended forever in peacetime',
        ],
        correct: 1,
        explain: 'Rights are not absolute; limits must pass the Oakes reasonable-limit test.',
      },
      {
        prompt: 'The notwithstanding clause (Section 33) lets legislatures',
        choices: [
          'Override certain Charter rights for up to five years at a time',
          'Abolish the Supreme Court',
          'Ignore all international law permanently',
          'Cancel federal elections',
        ],
        correct: 0,
        explain: 'Parliament or a legislature can shield a law from certain Charter challenges, subject to renewal.',
      },
      {
        prompt: 'Responsible citizenship in a liberal democracy includes',
        choices: [
          'Accepting news without checking sources',
          'Staying informed, voting, and respecting others’ rights',
          'Refusing all civic participation',
          'Only following laws you personally agree with',
        ],
        correct: 1,
        explain: 'Rights come with duties: participate, question power, and respect the framework that protects everyone.',
      },
    ],
  },
]

const ctsSets: PracticeTestSet[] = [
  {
    id: 'design',
    title: 'Design thinking & prototypes',
    blurb: 'Define the problem, sketch ideas, and test cheaply before you build.',
    questions: [
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
        prompt: 'A design constraint is',
        choices: [
          'Any idea you dislike',
          'A real limit — time, budget, materials, or rules — that shapes the solution',
          'Only a teacher’s personal preference',
          'Something you ignore until the last day',
        ],
        correct: 1,
        explain: 'Good designs work inside real limits instead of pretending they do not exist.',
      },
      {
        prompt: 'Iteration in CTS means',
        choices: [
          'Submitting the first draft as final',
          'Repeating build–test–improve cycles',
          'Deleting all earlier versions',
          'Avoiding any user testing',
        ],
        correct: 1,
        explain: 'Each loop should leave the design clearer and more reliable.',
      },
    ],
  },
  {
    id: 'safety',
    title: 'Makerspace safety',
    blurb: 'PPE, tool checks, and working clean in the shop.',
    questions: [
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
        prompt: 'Machine guards and safety stops exist to',
        choices: [
          'Slow you down for no reason',
          'Keep hands away from blades and moving parts',
          'Replace the need for training',
          'Make photos look professional',
        ],
        correct: 1,
        explain: 'Guards are part of the design — do not bypass them.',
      },
      {
        prompt: 'If a tool sounds wrong or a guard is missing, you should',
        choices: [
          'Use it faster before anyone notices',
          'Stop, tell the teacher, and do not use it until it is fixed',
          'Let a friend try first',
          'Remove the remaining parts for spare parts',
        ],
        correct: 1,
        explain: 'Report hazards immediately. A delayed project beats an injury.',
      },
      {
        prompt: 'Proper ventilation matters when',
        choices: [
          'Only when using paper and pencil',
          'Working with fumes, dust, or certain adhesives and finishes',
          'Taking photos of finished work',
          'Writing project reflections',
        ],
        correct: 1,
        explain: 'Air quality is part of shop safety — fumes and fine dust can harm lungs over time.',
      },
    ],
  },
  {
    id: 'digital',
    title: 'Digital citizenship',
    blurb: 'Privacy, licensing, accessibility, and ethics online.',
    questions: [
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
        prompt: 'Open-source or Creative Commons licensing means you',
        choices: [
          'Never need to read the license terms',
          'Must still follow the stated permissions and attribution rules',
          'Can sell anyone else’s work as your own',
          'Avoid documenting your sources',
        ],
        correct: 1,
        explain: 'Free to use is not free from conditions — check attribution and commercial-use limits.',
      },
      {
        prompt: 'Accessibility in a digital product means',
        choices: [
          'Designing only for people who use a mouse',
          'Considering users with different abilities — contrast, captions, keyboard use',
          'Using the smallest text possible',
          'Hiding all navigation labels',
        ],
        correct: 1,
        explain: 'Good CTS work is usable by more people, not just the default you imagine.',
      },
      {
        prompt: 'Before posting someone else’s photo or work online, you should',
        choices: [
          'Assume consent if they are a friend',
          'Get clear permission and credit them when required',
          'Crop out their name so it counts as yours',
          'Only ask after it goes viral',
        ],
        correct: 1,
        explain: 'Consent and credit protect both you and the creator.',
      },
    ],
  },
  {
    id: 'project',
    title: 'Planning & documentation',
    blurb: 'Timelines, feedback, version history, and showing your process.',
    questions: [
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
    ],
  },
]

const artSets: PracticeTestSet[] = [
  {
    id: 'elements',
    title: 'Elements of art',
    blurb: 'Line, shape, colour, value, texture, form, and space.',
    questions: [
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
        prompt: 'Texture in a artwork can be',
        choices: [
          'Only how paint feels if you touch the canvas illegally',
          'Actual surface quality or the illusion of surface quality',
          'Always smooth because galleries forbid detail',
          'Unrelated to composition',
        ],
        correct: 1,
        explain: 'Texture can be physical or visual — both affect how the work reads.',
      },
      {
        prompt: 'Form differs from shape because form suggests',
        choices: [
          'Flat outline only',
          'Three-dimensional volume and mass',
          'The price tag on the frame',
          'Only digital files',
        ],
        correct: 1,
        explain: 'Shapes read flat; form reads like something you could walk around.',
      },
    ],
  },
  {
    id: 'composition',
    title: 'Composition & space',
    blurb: 'Arrangement, focal point, balance, and negative space.',
    questions: [
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
        prompt: 'Visual balance can be',
        choices: [
          'Only perfectly symmetrical',
          'Symmetrical, asymmetrical, or radial depending on intent',
          'Ignored in advanced work',
          'The same as using one colour only',
        ],
        correct: 1,
        explain: 'Balance is about weight and tension in the layout, not mirror-image only.',
      },
    ],
  },
  {
    id: 'critique',
    title: 'Critique & analysis',
    blurb: 'Describe, interpret, and evaluate with evidence from the work.',
    questions: [
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
        prompt: 'When analyzing colour choices, you should',
        choices: [
          'Name the mood or relationship the palette creates and tie it to the subject',
          'Stop at “it’s colourful”',
          'Ignore warm vs cool',
          'Only discuss the frame',
        ],
        correct: 0,
        explain: 'Link hue, saturation, and contrast to meaning — not just preference.',
      },
      {
        prompt: 'Context in art analysis includes',
        choices: [
          'Only your favourite song',
          'Historical, cultural, or personal circumstances surrounding the work',
          'The weather the day you graded it',
          'Nothing outside the canvas edges ever',
        ],
        correct: 1,
        explain: 'Context helps explain why choices matter — not to replace looking at the piece.',
      },
      {
        prompt: 'Comparing two works in a critique is strongest when you',
        choices: [
          'Pick random differences with no thesis',
          'Use a clear idea — theme, technique, or composition — and cite both works',
          'Only discuss which sold for more',
          'Avoid mentioning either artist’s choices',
        ],
        correct: 1,
        explain: 'Comparison should sharpen an argument, not become a list of unrelated observations.',
      },
    ],
  },
  {
    id: 'process',
    title: 'Medium & process work',
    blurb: 'Choosing tools, sketching, and showing how the idea grew.',
    questions: [
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
      {
        prompt: 'A thumbnail sketch is useful because it',
        choices: [
          'Replaces the final artwork',
          'Tests composition quickly before committing to a large surface',
          'Must be shown to no one',
          'Only works in sculpture',
        ],
        correct: 1,
        explain: 'Small, fast layouts save hours of fixing a weak composition later.',
      },
      {
        prompt: 'Reflecting on a finished piece should include',
        choices: [
          'Only praise with no next steps',
          'What worked, what you would change, and what you learned for the next work',
          'Deleting all process photos',
          'Ignoring the assignment criteria',
        ],
        correct: 1,
        explain: 'Reflection closes the loop — it turns one project into skill for the next.',
      },
    ],
  },
]

const banks: Record<PracticeSubjectId, SubjectBank> = {
  bio: {
    title: 'Biology 30',
    blurb: 'Four note-based drills — neurons, homeostasis, and systems.',
    sets: bioSets,
  },
  social: {
    title: 'Social Studies 30-1',
    blurb: 'Four note-based drills — ideologies, economics, Cold War, and rights.',
    sets: socialSets,
  },
  cts: {
    title: 'CTS 30',
    blurb: 'Four note-based drills — design, safety, digital life, and project habits.',
    sets: ctsSets,
  },
  art: {
    title: 'Art 30',
    blurb: 'Four note-based drills — elements, composition, critique, and process.',
    sets: artSets,
  },
}

export const practiceSubjectIds = Object.keys(banks) as PracticeSubjectId[]

export function practiceBank(id: string) {
  if (id in banks) return banks[id as PracticeSubjectId]
  return null
}

export function practiceSet(subjectId: string, setId: string): PracticeTestSet | null {
  const bank = practiceBank(subjectId)
  if (!bank) return null
  return bank.sets.find((s) => s.id === setId) ?? null
}

export function clonePracticeSet(
  subjectId: PracticeSubjectId,
  setId: string,
  makeId: () => string,
): PracticeQ[] {
  const set = practiceSet(subjectId, setId)
  if (!set) return []
  return set.questions.map((q) => ({ ...q, id: makeId() }))
}

/** @deprecated Use clonePracticeSet — loads all sets merged (legacy). */
export function clonePracticeBank(id: PracticeSubjectId, makeId: () => string): PracticeQ[] {
  return banks[id].sets.flatMap((set) => set.questions.map((q) => ({ ...q, id: makeId() })))
}
