import * as RX from 'rxjs';

let Instance = null;

class AssetLoader extends RX.Subject {
    constructor() {
        super();        
        Instance = this;
    }

    load(arrayOfAssetPaths) {
        var loader = new PIXI.AssetLoader(
            arrayOfAssetPaths
        );
        loader.onComplete = this.complete;
        loader.load();
    }

    complete() {
        console.log("Finished Loading Assets");
        Instance.next("loaded");
    }
}

export default AssetLoader;