export type PracticeQ = {
  id: string
  prompt: string
  choices: string[]
  correct: number
  explain: string
}

export const neuronPractice: Omit<PracticeQ, 'id'>[] = [
  {
    prompt: 'Which part of a neuron typically receives incoming signals from other cells?',
    choices: ['Axon terminal', 'Dendrites', 'Myelin sheath', 'Node of Ranvier'],
    correct: 1,
    explain: 'Dendrites branch from the cell body and take in chemical signals from synapses.',
  },
  {
    prompt: 'The resting membrane potential of a typical neuron is closest to',
    choices: ['0 mV', '+30 mV', '−70 mV', '+70 mV'],
    correct: 2,
    explain: 'At rest the inside is negative relative to the outside, around −70 mV.',
  },
  {
    prompt: 'The sodium–potassium pump moves ions in which pattern (per ATP)?',
    choices: [
      '2 Na+ in, 3 K+ out',
      '3 Na+ out, 2 K+ in',
      '3 Na+ in, 2 K+ out',
      'Equal Na+ and K+ both ways',
    ],
    correct: 1,
    explain: 'It exports three sodium ions and imports two potassium ions, helping keep the inside negative.',
  },
  {
    prompt: 'During the rising phase of an action potential, which ions rush which way?',
    choices: [
      'K+ out through leak channels',
      'Na+ in through voltage-gated channels',
      'Cl− in through ligand-gated channels',
      'Ca2+ out of the axon hillock',
    ],
    correct: 1,
    explain: 'Threshold opens voltage-gated sodium channels; Na+ floods in and the membrane depolarizes.',
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
    prompt: 'A sensory (afferent) neuron typically',
    choices: [
      'Carries commands from CNS to muscle or gland',
      'Carries information from receptors toward the CNS',
      'Lives only inside the brain and never leaves',
      'Has no axon',
    ],
    correct: 1,
    explain: 'Afferent paths bring sensory information in. Efferent (motor) paths send commands out.',
  },
  {
    prompt: 'In a simple spinal reflex arc, the usual order is',
    choices: [
      'Motor neuron → interneuron → sensory neuron → muscle',
      'Sensory neuron → interneuron → motor neuron → effector',
      'Brain → Schwann cell → dendrite → axon',
      'Synapse → myelin → pump → threshold',
    ],
    correct: 1,
    explain: 'Receptor to sensory neuron, often an interneuron in the cord, then motor neuron to the effector. The brain can be informed but is not required for the jerk itself.',
  },
]

export function cloneNeuronPractice(id: () => string): PracticeQ[] {
  return neuronPractice.map((q) => ({ ...q, id: id() }))
}
