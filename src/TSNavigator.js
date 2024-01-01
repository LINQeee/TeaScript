class TSNavigator {

    paths = {};

    history = [];

    constructor(initPaths) {
        this.paths = initPaths;
        const initialPageName = TS.param("page");
        if (!initialPageName || !this.paths.hasOwnProperty(initialPageName)) {
            TS.initializeTemplate("SysError", "Page not found: 404").then(response => document.body.appendChild(response));
            return;
        }
        TS.initializeTemplate(this.paths[initialPageName][0], this.paths[initialPageName][1]).then(response => document.body.appendChild(response));
        this.history.push(initialPageName);
    }

    goToPage = (pageName, saveHistory = true, ...args) => {
        TS.qAll("body > :not(script)").forEach(el => el.remove());
        TS.initializeTemplate(this.paths[pageName], ...args).then(response => document.body.appendChild(response));
        if (saveHistory) this.history.push(pageName);
    }

    goBack = async (deleteHistory = true) => {
        if (deleteHistory && this.history.length > 1) this.history.pop();
        let historyIndex;
        if (this.history.length === 1) historyIndex = 0;
        else if (deleteHistory) historyIndex = this.history.length - 1;
        else historyIndex = this.history.length - 2;
        await this.goToPage(this.history[historyIndex], !deleteHistory);
    }
}