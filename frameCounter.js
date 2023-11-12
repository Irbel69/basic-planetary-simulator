function uptadteFPS(){
    changeSpeed(TIMESTEP);
    console.log(FPS);
    FPS = 0;
}

setInterval(uptadteFPS, 200);