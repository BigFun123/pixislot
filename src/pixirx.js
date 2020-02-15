/**
 * PIXI Slots with RX
 */

import * as RX from 'rxjs';
import AssetLoader from './assetloader.js';

var IMG_MACHINE = "./assets/slot-machine_fhrtsl.png";
var IMG_BODY= "./assets/panel.png";
var IMG_BUTTON = "./assets/button_se5uul.png";


var STATE_ZERO = 0;
var STATE_INIT=1;
var STATE_MOVING=2;
var STATE_CHECK_WIN=3;
    
var SLOT_NUMBER = 3;
var INITIAL_X = 90;
var TILE_HEIGHT = 200;
var TILE_WIDTH = 100;
var N_CYCLE = 5;
var TOT_TILES= 7;

let Instance = null;
var gameStatus=0;
var finalTileY=[];
var slotSprite=[];
var preChoosedPosition = [];

var INC = [ 15,20,25 ];

class PX extends RX.Subject{
    constructor() {
        super();
        Instance = this;
        this.loadAssets();
        RX.interval(1000)
            .subscribe(val =>this.pulse());
    }

    pulse() {
        console.log("pulse");
    }

    draw() {
        console.info("draw("+gameStatus+")"); 
        if(gameStatus==STATE_ZERO) {
            gameStatus=STATE_INIT;
        } else 
      if(gameStatus==STATE_INIT) {
          console.log("waiting start");
          gameStatus=STATE_CHECK_WIN;
          
      } else if(gameStatus==STATE_MOVING) {
        console.log("moving");
         
        for(var i=0; i<SLOT_NUMBER; i++) {
            if( finalTileY[i] > 0 ) {
                slotSprite[i].tilePosition.y = slotSprite[i].tilePosition.y + INC[i];
                finalTileY[i]= finalTileY[i] - INC[i];
                //console.info( "dec.finalTile["+i+"]="+finalTileY[i] );
            }            
          }
        
        if( finalTileY[0]-5 <= 0 ) {
            gameStatus=STATE_CHECK_WIN;
            
        }
        
        //  gameStatus = STATE_CHECK_WIN;
          
      } else if(gameStatus==STATE_CHECK_WIN) {
        console.log("checking win");
        var test=true;
        for(var i=1; i<SLOT_NUMBER; i++) {
            if( preChoosedPosition[i]!=preChoosedPosition[i-1]) {
                test=false;
            }
        }
        if(test) {
         Instance.win();
        }
        return; //no more animation
      }


        Instance.renderer.render(Instance.stage);
        //requestAnimationFrame(draw);
        requestAnimationFrame(Instance.draw);
    }

    win() {
        console.log("Congratulations, you won!");
    }

    loadAssets() {
        this.stage = new PIXI.Stage(0x000000);
        this.renderer = PIXI.autoDetectRenderer(
            window.innerWidth, window.innerHeight,
            {antialiasing: false, transparent: false, resolution: 1}  
          );
          document.body.appendChild(this.renderer.view);
          this.stage.interactive=true;
        //loading images
        let al = new AssetLoader();
        al.subscribe((s) => {
            console.log(s);
            this.setup();
        })
        al.load([IMG_MACHINE, IMG_BODY, IMG_BUTTON]);
    }

    setup() {
        console.log(" loading complete");

        texture = PIXI.TextureCache[IMG_BUTTON];
        let buttonSprite = new PIXI.Sprite(texture);
        buttonSprite.x=512;
        buttonSprite.y=75;
        this.stage.addChild(buttonSprite);
        buttonSprite.interactive=true;	
        buttonSprite.click = function (e) {
            Instance.start();
        }

        //tiles
        texture=PIXI.TextureCache[IMG_MACHINE];
        preChoosedPosition = [1,2,3];
        for(var i=0; i<SLOT_NUMBER; i++) {
            slotSprite[i] = new PIXI.TilingSprite(texture, TILE_WIDTH, TILE_HEIGHT+20);
            slotSprite[i].tilePosition.x = 0;
            slotSprite[i].tilePosition.y = (-preChoosedPosition[i]*TILE_HEIGHT)+10;
            slotSprite[i].x= INITIAL_X +(i*115);
            slotSprite[i].y= 140;
            this.stage.addChild( slotSprite[i] );
        }

        
        var texture = PIXI.TextureCache[IMG_BODY];
        let bodySprite = new PIXI.Sprite(texture);
        bodySprite.x=0; 
        bodySprite.y=0;
        this.stage.addChild(bodySprite);
        bodySprite.z = 10;
            

        this.draw();
    }

    start() {
        console.log("start");        
            if( gameStatus==STATE_INIT || gameStatus==STATE_CHECK_WIN ) {
                preChoosedPosition = this.getRandomPositions();
                for(var i=0; i<SLOT_NUMBER; i++) {
                    //preChoosedPosition[i] = getRandomInt(0,6);
                    console.info( "preChoosedPosition["+i+"]="+preChoosedPosition[i] );
                    slotSprite[i].tilePosition.y = (-preChoosedPosition[i]*TILE_HEIGHT) +10;
                    finalTileY[i]= (N_CYCLE*TILE_HEIGHT*TOT_TILES);
                    console.info( "tilePosition.y["+i+"]="+slotSprite[i].tilePosition.y );
                    console.info( "finalTile["+i+"]="+finalTileY[i] );
                }
                gameStatus = STATE_MOVING;
                this.draw();
            }           
    }

    spin() {

    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomPositions() {
        var x = this.getRandomInt(0, 100);
        if(x>50) {
            x= this.getRandomInt(0,6);
            return [x,x,x];
        }
            return [this.getRandomInt(0,6),this.getRandomInt(0,6),this.getRandomInt(0,6)];   
    }
    
}

export default PX;