let width = 3

const gridItems = Object.values(
  document.querySelectorAll("div.grid-item") as NodeListOf<HTMLDivElement>
)

class Cell {
  neibours: Cell[] = []
  state = true

  constructor(private element: HTMLDivElement, private id: number) {
    element.addEventListener("click", this.click.bind(this))
  }

  toggle() {
    this.state = !this.state
    this.element.style.backgroundColor = this.state ? "#f7f7f7" : "#000"
  }

  click() {
    this.toggle()
    this.neibours.forEach((neibour) => neibour.toggle())
  }

  initialiseNeighbours(cells: Cell[]) {
    const ids = [this.id - width, this.id + width].filter(
      (id) => id >= 0 && id <= width ** 2 - 1
    )
    if (this.id % width !== 0) ids.push(this.id - 1)
    if ((this.id + 1) % width !== 0) ids.push(this.id + 1)

    this.neibours = ids.map((id) => cells[id])
  }
}

let cells: Cell[] = []

function initGame() {
  cells = gridItems.map((gridItem, i) => new Cell(gridItem, i))
  cells.forEach((cell) => cell.initialiseNeighbours(cells))
}
initGame()

function randomGame(i?: number) {
  if (i == null) i = width * 20
  if (i <= 0) return
  cells[Math.floor(Math.random() * cells.length)].click()
  requestAnimationFrame(() => randomGame(i - 1))
}

;(document.getElementById("width-range") as HTMLInputElement).addEventListener(
  "input",
  (ev) => {
    const target = ev.target as HTMLInputElement
    width = Number(target.value)
    // delete all div.grid-item elements
    gridItems.forEach((gridItem) => gridItem.remove())

    // create width ** 2 new ones
    for (let i = 0; i < width ** 2; i++) {
      const div = document.createElement("div")
      div.classList.add("grid-item")
      document.getElementById("grid")?.appendChild(div)
    }

    // reassign gridItems
    gridItems.length = 0
    gridItems.push(
      ...Object.values(
        document.querySelectorAll("div.grid-item") as NodeListOf<HTMLDivElement>
      )
    )

    // reinitialise game
    initGame()

    // change the css variable --grid-width
    document.documentElement.style.setProperty("--grid-width", width.toString())
  }
)

document.getElementById("newGame").addEventListener("click", () => randomGame())
