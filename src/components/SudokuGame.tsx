import { useCallback, useMemo, useState } from 'react'
import {
  cellKey,
  cloneGrid,
  formatSudokuDigit,
  parseSudoku,
  pickSudoku,
  sudokuErrors,
  sudokuLevels,
  sudokuSolved,
  type SudokuLevel,
} from '../lib/sudoku'

type Props = {
  emoji?: boolean
  title?: string
}

function buildState(level: SudokuLevel, puzzleIndex?: number) {
  const { puzzle, index } = pickSudoku(level, puzzleIndex)
  const start = parseSudoku(puzzle.puzzle)
  const fixed = start.map((row) => row.map((v) => v !== 0))
  return {
    level,
    puzzleIndex: index,
    solution: puzzle.solution,
    grid: cloneGrid(start),
    fixed,
  }
}

export default function SudokuGame({ emoji = false, title }: Props) {
  const [level, setLevel] = useState<SudokuLevel>('easy')
  const [state, setState] = useState(() => buildState('easy'))
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null)
  const [checked, setChecked] = useState(false)

  const config = sudokuLevels[level]
  const errors = useMemo(() => sudokuErrors(state.grid), [state.grid])
  const won = sudokuSolved(state.grid, state.solution)
  const filled = state.grid.flat().filter((v) => v > 0).length

  const reset = useCallback((nextLevel: SudokuLevel = level, puzzleIndex?: number) => {
    setState(buildState(nextLevel, puzzleIndex))
    setSelected(null)
    setChecked(false)
  }, [level])

  function pickLevel(next: SudokuLevel) {
    setLevel(next)
    reset(next)
  }

  function setCell(r: number, c: number, value: number) {
    if (state.fixed[r][c]) return
    setState((prev) => {
      const grid = cloneGrid(prev.grid)
      grid[r][c] = value
      return { ...prev, grid }
    })
    setChecked(false)
  }

  function check() {
    setChecked(true)
  }

  return (
    <div className={`sudoku-game${emoji ? ' sudoku-game-emoji' : ''}`}>
      <div className="memory-levels" role="tablist" aria-label="Sudoku difficulty">
        {(Object.keys(sudokuLevels) as SudokuLevel[]).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={level === id}
            className={`btn ghost memory-level${level === id ? ' is-active' : ''}`}
            onClick={() => pickLevel(id)}
          >
            {sudokuLevels[id].label}
          </button>
        ))}
      </div>
      <p className="meta memory-level-hint">{config.blurb}</p>

      <div className="memory-head">
        <p className="meta" style={{ margin: 0 }}>
          {won
            ? `${config.label} ${emoji ? 'emoji ' : ''}sudoku solved.`
            : `${filled} / 81 filled${checked && errors.size ? ` · ${errors.size} conflicts` : ''}`}
        </p>
        <div className="todo-add" style={{ marginTop: 0 }}>
          <button className="btn ghost" type="button" onClick={check}>
            Check
          </button>
          <button className="btn ghost" type="button" onClick={() => reset()}>
            New puzzle
          </button>
        </div>
      </div>

      <div className="sudoku-grid" role="grid" aria-label={title ?? (emoji ? 'Emoji sudoku' : 'Sudoku')}>
        {Array.from({ length: 3 }, (_, boxR) =>
          Array.from({ length: 3 }, (_, boxC) => {
            const br = boxR * 3
            const bc = boxC * 3
            return (
              <div key={`${br}-${bc}`} className="sudoku-box">
                {Array.from({ length: 3 }, (_, r) =>
                  Array.from({ length: 3 }, (_, c) => {
                    const row = br + r
                    const col = bc + c
                    const value = state.grid[row][col]
                    const isFixed = state.fixed[row][col]
                    const isSelected = selected?.r === row && selected?.c === col
                    const isError = checked && errors.has(cellKey(row, col))
                    return (
                      <button
                        key={cellKey(row, col)}
                        type="button"
                        className={`sudoku-cell${isFixed ? ' is-fixed' : ''}${isSelected ? ' is-selected' : ''}${isError ? ' is-error' : ''}`}
                        onClick={() => setSelected({ r: row, c: col })}
                        aria-label={`Row ${row + 1} column ${col + 1}${value ? ` ${value}` : ' empty'}`}
                      >
                        {formatSudokuDigit(value, emoji)}
                      </button>
                    )
                  }),
                )}
              </div>
            )
          }),
        )}
      </div>

      {selected && !state.fixed[selected.r][selected.c] && (
        <div className="sudoku-keypad" role="toolbar" aria-label="Enter digit">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((digit) => (
            <button
              key={digit}
              type="button"
              className="btn ghost sudoku-key"
              onClick={() => setCell(selected.r, selected.c, digit)}
            >
              {formatSudokuDigit(digit, emoji)}
            </button>
          ))}
          <button
            type="button"
            className="btn ghost sudoku-key sudoku-key-clear"
            onClick={() => setCell(selected.r, selected.c, 0)}
          >
            Clear
          </button>
        </div>
      )}

      {emoji && (
        <p className="meta sudoku-emoji-key" style={{ marginTop: 10 }}>
          🐻 1 · 🧬 2 · 🗺️ 3 · 🛠️ 4 · 🎨 5 · 🍁 6 · 📚 7 · ✏️ 8 · 🧪 9
        </p>
      )}
    </div>
  )
}
