export interface IVector{
    x: number, 
    y: number
}

export interface IXoneState{
    player: IVector, 
    polys: Array<Array<IVector>>, 
    holes: Array<Array<IVector>>, 
    playerPath: Array<IVector>, 
    enemies: Array<{pos: IVector, speed: IVector}>, 
    inPoly: boolean
}