import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
interface Scripts {
    name: string;
    src: string;
}

interface Styles {
    name: string;
    link: string;
}
export const ScriptStore: Scripts[] = [
    { name: 'jQuery', src: 'https://code.jquery.com/jquery-3.6.0.min.js' },
    { name: 'popper', src:'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js'},
    { name: 'bootstrap',src:'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js'}
];
export const StyleStore: Styles[] = [
    { name: 'fontawsome', link: 'https://pro.fontawesome.com/releases/v5.10.0/css/all.css' },
    { name: 'bootstrap', link: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' },
    { name: 'googleFonts', link: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
];
@Injectable({
    providedIn: 'root'
})
export class ScriptService {
    private scripts: any = {};
    private styles: any = {};
    constructor() {
        ScriptStore.forEach((script: any) => {
            this.scripts[script.name] = {
                loaded: false,
                src: script.src
            };
        });
        StyleStore.forEach((style: any) => {
            this.styles[style.name] = {
                loaded: false,
                link: style.link
            };
        });
    }

    loadScripts(...scripts: string[]) {
        const promises: any[] = [];
        scripts.forEach((script) => promises.push(this.loadScript(script)));
        return Promise.all(promises);
    }

        
    loadStyles(...styles: string[]) {
        const promises: any[] = [];
        styles.forEach((link) => promises.push(this.loadStyle(link)));
        return Promise.all(promises);
    }

    loadScript(name: string) {
        return new Promise((resolve, reject) => {
            // resolve if already loaded
            if (this.scripts[name].loaded) {
                resolve({ script: name, loaded: true, status: 'Already Loaded' });
            } else {
                // load script
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = this.scripts[name].src;
                script.onload = () => {
                    this.scripts[name].loaded = true;
                    resolve({ script: name, loaded: true, status: 'Loaded' });
                };
                script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        });
    }

    loadStyle(name: string) {
        return new Promise((resolve, reject) => {
            // resolve if already loaded
            if (this.styles[name].loaded) {
                resolve({ link: name, loaded: true, status: 'Already Loaded' });
            } else {
                // load styles
                const style = document.createElement('link');
                style.type = 'text/css';
                style.href = this.styles[name].link;
                style.rel = "stylesheet";
                style.onload = () => {
                    this.styles[name].loaded = true;
                    resolve({ link: name, loaded: true, status: 'Loaded' });
                };
                style.onerror = (error: any) => resolve({ link: name, loaded: false, status: 'Loaded' });
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        });
    }
}