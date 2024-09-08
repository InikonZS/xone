import { IXoneState } from "./core/interfaces";

export function render2d(ctx: CanvasRenderingContext2D, data: IXoneState){
    const {polys, enemies, player, playerPath} = data;
    const dispolys = data.holes;
    const indispoly = !data.inPoly;
    const disPlayerPath = data.playerPath;
    const canvasScaler = 1;
    const canvas = ctx.canvas;
    ctx.lineWidth = canvasScaler;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    polys.forEach(poly=>{
        ctx.strokeStyle = '#f90';
        ctx.fillStyle = '#c63';
        ctx.beginPath();
        poly.forEach((it, i)=>{
            ctx[i==0?'moveTo':'lineTo'](it.x* canvasScaler, it.y* canvasScaler);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    });

    dispolys.forEach(poly=>{
        ctx.strokeStyle = '#f90';
        ctx.fillStyle = '#222';
        ctx.beginPath();
        poly.forEach((it, i)=>{
            ctx[i==0?'moveTo':'lineTo'](it.x* canvasScaler, it.y* canvasScaler);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    });

    if (!indispoly){
        ctx.strokeStyle = '#9f9';
        ctx.beginPath();
        disPlayerPath.forEach((it, i)=>{
            ctx[i==0?'moveTo':'lineTo'](it.x* canvasScaler, it.y* canvasScaler);
        });
        ctx.lineTo(player.x*canvasScaler, player.y*canvasScaler)
        ctx.stroke();
    }

    ctx.fillStyle = '#f00';
    ctx.fillRect((player.x-2)* canvasScaler, (player.y-2)* canvasScaler, 4* canvasScaler, 4* canvasScaler);

    enemies.forEach((enemyObj)=>{
        const enemy = enemyObj.pos; 
        ctx.fillStyle = '#ff0';
        ctx.fillRect((enemy.x-2)* canvasScaler, (enemy.y-2)* canvasScaler, 4* canvasScaler, 4* canvasScaler);
    })
}