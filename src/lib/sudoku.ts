export type SudokuLevel = 'easy' | 'medium' | 'hard'

export type SudokuPuzzle = {
  puzzle: string
  solution: string
}

export const sudokuLevels: Record<
  SudokuLevel,
  { label: string; blurb: string }
> = {
  easy: { label: 'Easy', blurb: 'More givens — good warm-up.' },
  medium: { label: 'Medium', blurb: 'Balanced clues.' },
  hard: { label: 'Hard', blurb: 'Sparse grid — take your time.' },
}

export const sudokuEmojiDigits = ['🐻', '🧬', '🗺️', '🛠️', '🎨', '🍁', '📚', '✏️', '🧪'] as const

const puzzles: Record<SudokuLevel, SudokuPuzzle[]> = {
  easy: [
    {
      puzzle: '530070000600195000098000060000608000006000300070000014000000000000419005000000000',
      solution: '534678912672195348198342567859761423426853791713924856961537284287419635345286179',
    },
    {
      puzzle: '003020600900305001001806400008102900700000008006708200002609500800203009005010300',
      solution: '483921657967345821251876493548132976736598241129764385372689514814253769695417328',
    },
  ],
  medium: [
    {
      puzzle: '040000050001306000700040036000080700010000020006010000320070006000805100060000090',
      solution: '243981657951376428768542139375684971419237586896715243537269814624853791187495362',
    },
    {
      puzzle: '000900002050123000030000460000000000000000000000000000000460030000050012000800900',
      solution: '469875321251763894837492165714286539592318476368547912126934758973651248845129637',
    },
  ],
  hard: [
    {
      puzzle: '800000000003600000070090200050007000000045700000100030001000068008500010000009',
      solution: '812753649943682175675491283154237896796845321327169574481572938268394517539716842',
    },
    {
      puzzle: '000000517000000000000000000000000000000000000000000000000000000000000000000000000',
      solution: '664178523971523864852964137137846295496735281285391746348217659759682413513459872',
    },
  ],
}

export function pickSudoku(level: SudokuLevel, index?: number): { puzzle: SudokuPuzzle; index: number } {
  const pool = puzzles[level]
  const i = index ?? Math.floor(Math.random() * pool.length)
  return { puzzle: pool[i % pool.length], index: i % pool.length }
}

export function parseSudoku(raw: string): number[][] {
  const digits = raw.replace(/\D/g, '').padEnd(81, '0').slice(0, 81)
  const grid: number[][] = []
  for (let r = 0; r < 9; r++) {
    grid.push([])
    for (let c = 0; c < 9; c++) {
      grid[r].push(Number(digits[r * 9 + c] || 0))
    }
  }
  return grid
}

export function cloneGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row])
}

export function cellKey(r: number, c: number) {
  return `${r},${c}`
}

export function sudokuErrors(grid: number[][]): Set<string> {
  const bad = new Set<string>()

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c]
      if (v === 0) continue
      for (let cc = c + 1; cc < 9; cc++) {
        if (grid[r][cc] === v) {
          bad.add(cellKey(r, c))
          bad.add(cellKey(r, cc))
        }
      }
      for (let rr = r + 1; rr < 9; rr++) {
        if (grid[rr][c] === v) {
          bad.add(cellKey(r, c))
          bad.add(cellKey(rr, c))
        }
      }
      const br = Math.floor(r / 3) * 3
      const bc = Math.floor(c / 3) * 3
      for (let rr = br; rr < br + 3; rr++) {
        for (let cc = bc; cc < bc + 3; cc++) {
          if (rr === r && cc === c) continue
          if (grid[rr][cc] === v) {
            bad.add(cellKey(r, c))
            bad.add(cellKey(rr, cc))
          }
        }
      }
    }
  }

  return bad
}

export function sudokuSolved(grid: number[][], solution: string): boolean {
  const target = parseSudoku(solution)
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== target[r][c]) return false
    }
  }
  return true
}

export function formatSudokuDigit(value: number, emoji: boolean): string {
  if (value <= 0) return ''
  return emoji ? sudokuEmojiDigits[value - 1] : String(value)
}
