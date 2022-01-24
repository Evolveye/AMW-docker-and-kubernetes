export type EventCoords = {
  layerX: number
  layerY: number
}
export class Tile {
  shape: "circle" | "cross" | null = null

  constructor( public x:number, public y:number ) {}
}

export default class Game {
  #loopId: number
  #data: Tile[][]
  #ctx: CanvasRenderingContext2D;

  shape: "circle" | "cross" | null
  tileW: number
  tileH: number
  hoveredTile: Tile | null


  constructor( canvas:HTMLCanvasElement, shape:"circle" | "cross" | null = null ) {
    this.#ctx = canvas.getContext( `2d` )!
    this.#data = Array.from( { length:3 }, (_, y) => Array.from( { length:3 }, (_, x) => new Tile( x, y ) ) )

    this.shape = shape
    this.tileW = canvas.width / 3
    this.tileH = canvas.height / 3

    this.addEvents()
    this.resize()
    this.startLoop()
  }


  addEvents = () => {
    const { canvas } = this.#ctx

    canvas.addEventListener( `mousemove`, e => {
      const { layerX, layerY } = e as unknown as EventCoords
      const tile = this.getTileFromPixels( layerX, layerY )

      this.hoveredTile = tile
    } )

    canvas.addEventListener( `pointerout`, () => this.hoveredTile = null )
    canvas.addEventListener( `pointerup`, () => this.createShape() )

    window.addEventListener( `resize`, this.resize )
  }


  resize = () => {
    const { canvas } = this.#ctx

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    this.tileW = canvas.width / 3
    this.tileH = canvas.height / 3
  }


  getTileFromPixels = (x:number, y:number) => this.getTile( Math.floor( x / (this.#ctx.canvas.width / 3) ), Math.floor( y / (this.#ctx.canvas.height / 3) ) )
  getTile = (x:number, y:number) => {
    return this.#data[ y ]?.[ x ] ?? null
  }


  startLoop = () => {
    this.loop()
  }


  stopLoop = () => {
    cancelAnimationFrame( this.#loopId )
  }


  loop = () => {
    this.#loopId = requestAnimationFrame( this.loop )

    this.logic()
    this.draw()
  }


  logic = () => {

  }


  draw = () => {
    const ctx = this.#ctx
    const data = this.#data
    const { tileH, tileW, hoveredTile } = this
    const { width, height } = ctx.canvas

    ctx.clearRect( 0, 0, width, height )

    if (hoveredTile) {
      ctx.fillStyle = `#fff1`
      ctx.fillRect( hoveredTile.x * tileW, hoveredTile.y * tileH, tileW, tileH )
    }

    ctx.beginPath()

    for (let y = 1;  y < data.length;  ++y) {
      ctx.moveTo( 0, y * tileH )
      ctx.lineTo( width, y * tileH )

      for (let x = 1;  x < data[ y ]!.length;  ++x) {
        ctx.moveTo( x * tileW, 0 )
        ctx.lineTo( x * tileW, height )
      }
    }

    ctx.lineWidth = 3
    ctx.strokeStyle = `#333`
    ctx.stroke()

    ctx.strokeStyle = `#aaa`

    data.flat().forEach( t => {
      ctx.beginPath()

      switch (t.shape) {
        case `circle`: {
          const loverDim = tileW > tileH ? tileH : tileW
          const radius = loverDim / 2 - loverDim / 10

          ctx.arc( t.x * tileW + tileW / 2, t.y * tileH + tileH / 2, radius, 0, Math.PI * 2 )
          break
        }

        case `cross`: {
          const tileWBy10 = tileW / 10
          const tileHBy10 = tileH / 10

          ctx.moveTo( t.x * tileW + tileWBy10, t.y * tileH + tileHBy10 )
          ctx.lineTo( t.x * tileW + tileW - tileWBy10, t.y * tileH + tileH - tileHBy10 )

          ctx.moveTo( t.x * tileW + tileW - tileWBy10, t.y * tileH + tileHBy10 )
          ctx.lineTo( t.x * tileW + tileWBy10, t.y * tileH + tileH - tileHBy10 )
          break
        }
      }

      ctx.stroke()
    } )

  }


  createShape = () => {
    const tile = this.hoveredTile

    if (!tile || tile.shape) return

    tile.shape = this.shape ?? (Math.random() > 0.5 ? `cross` : `circle`)
  }


  destroy = () => {
    this.stopLoop()

    console.log( `Game destroyed` )
  }
}
