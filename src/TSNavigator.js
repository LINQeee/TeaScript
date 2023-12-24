class TSNavigator {

    paths = {};

    constructor(initPaths) {
        this.paths = initPaths;
        document.body.appendChild(TS.initializeTemplate(initPaths[TS.param("page")]));
    }

    gotoPage(pageName) {
        TS.qAll("body > :not(script)").forEach(el => el.remove());
        document.body.appendChild(TS.initializeTemplate(this.paths[pageName]));
    }
}