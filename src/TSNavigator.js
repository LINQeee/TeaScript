class TSNavigator {

    paths = {};

    history = [];

    constructor(initPaths) {
        this.paths = initPaths;
        const initialPageName = TS.param("page");
        if (!initialPageName || !this.paths.hasOwnProperty(initialPageName)) {
            document.body.appendChild(TS.initializeTemplate("SysError", "Page not found: 404"));
            return;
        }
        document.body.appendChild(TS.initializeTemplate(initPaths[initialPageName]));
        this.history.push(initialPageName);
        console.log(this.history);
    }

    goToPage(pageName, saveHistory = true) {
        TS.qAll("body > :not(script)").forEach(el => el.remove());
        document.body.appendChild(TS.initializeTemplate(this.paths[pageName]));
        if (saveHistory) this.history.push(pageName);
    }

    goBack(deleteHistory = true) {
        if (deleteHistory && this.history.length > 1) this.history.pop();
        let historyIndex;
        if (this.history.length === 1) historyIndex = 0;
        else if (deleteHistory) historyIndex = this.history.length - 1;
        else historyIndex = this.history.length - 2;
        this.goToPage(this.history[historyIndex], !deleteHistory);
    }
}