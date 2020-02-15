import * as rxjs from 'rxjs';
import PX from './pixirx.js';

let Game = new PX();

Game.subscribe(x=>{
    console.log(" Game " + x);
});

Game.next(1);
