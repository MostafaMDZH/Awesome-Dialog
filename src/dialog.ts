//custom types:
type option = {
    id: string;
    name: string;
    iconSrc?: string;
    iconSize?: string;
}
type constructorParameters = {
    title?:             string;
    options:            option[];
    recentSelects?:     option[];
    currentOptionId?:   string;
    isSearchable?:      boolean;
    searchPlaceholder?: string;
    maxColumns?:        number;
    maxRows?:           number;
    theme?:             string;
    style?:             object;
    onSelect: (id:string, name:string) => void;
}

export default class Selector{
    
    //default values:
    public static readonly ROW_HEIGHT: number = 40;
    public static readonly COLUMN_WIDTH: number = 187;

    //object properties:
    protected viewID:            number;
    protected view:              HTMLElement;
    protected title:             string;
    protected allOptions:        option[];
    protected optionsToShow:     option[];
    protected recentSelects:     option[] | undefined;
    protected currentOptionId:   string   | undefined;
    protected isSearchable:      boolean;
    protected searchPlaceholder: string;
    protected maxColumns:        number;
    protected maxRows:           number;
    protected rowsNumber:        number;
    protected columnsNumber:     number;
    protected theme:             string   | undefined;
    protected style:             object   | undefined;
    protected onSelect: (id:string, name:string) => void;

    //constructor:
    constructor(parameters:constructorParameters){

        //append CSS styles to DOM:
        Selector.appendCSS();//comment at dev mode

        //the view:
        this.viewID = Selector.generateViewID();
        let view    = Selector.getHtml(this.viewID);
        document.body.appendChild(view);
        this.view   = document.getElementById(this.viewID.toString()) || document.createElement('div');

        //set properties:
        this.setTitle(this.title = parameters.title || '');
        this.allOptions        = parameters.options;
        this.optionsToShow     = parameters.options;
        this.recentSelects     = parameters.recentSelects;
        this.currentOptionId   = parameters.currentOptionId;
        this.isSearchable      = parameters.isSearchable ?? false;
        this.setSearchPlaceholder(this.searchPlaceholder = parameters.searchPlaceholder || '');
        this.maxColumns        = parameters.maxColumns || 7;
        this.maxRows           = parameters.maxRows || 16;
        this.rowsNumber        = 1;
        this.columnsNumber     = 1;
        this.onSelect          = parameters.onSelect;

        //show recent selects:
        this.showRecentSelects();

        //show all options:
        this.showAllOptions(true);

        //set theme;
        this.setTheme(parameters.theme);

        //add event to window:
        this.addWindowSizeEvent();
        
        //add event to search input:
        this.addEventToSearch();

        //add event to close button:
        this.addEventToClose();
        
        //set style:
        this.setStyle(parameters.style);

        //finally show:
        this.show();

	}

    //appendCSS:
    protected static appendCSS(){
        if(document.getElementById('selector-style') === null){
            let head  = document.head || document.getElementsByTagName('head')[0];
            let style = document.createElement('style');
            style.id  = 'selector-style';
            head.appendChild(style);
            style.appendChild(document.createTextNode(Style));
        }
    }

    //generateViewID:
    protected static generateViewID():number{
		let id = Math.floor(Math.random() * 1000000000) + 100000000;
        let element = document.getElementById(id.toString());
        if(element === null)
            return id;
        return Selector.generateViewID();
	}

    //getHtml:
    protected static getHtml(viewID:number):ChildNode{
        const html = `
            <div class="selector" id="${viewID}">
                <div class="shadow"></div>
                <div class="container">
                    <div class="window">
                        <div class="toolbar">
                            <a class="title"></a>
                            <div class="searchContainer">
                                <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="-7 -7 65 65" fill="#aaa"><path d="M39.8 41.95 26.65 28.8q-1.5 1.3-3.5 2.025-2 .725-4.25.725-5.4 0-9.15-3.75T6 18.75q0-5.3 3.75-9.05 3.75-3.75 9.1-3.75 5.3 0 9.025 3.75 3.725 3.75 3.725 9.05 0 2.15-.7 4.15-.7 2-2.1 3.75L42 39.75Zm-20.95-13.4q4.05 0 6.9-2.875Q28.6 22.8 28.6 18.75t-2.85-6.925Q22.9 8.95 18.85 8.95q-4.1 0-6.975 2.875T9 18.75q0 4.05 2.875 6.925t6.975 2.875Z"/></svg>
                                <input type="text" dir="auto" autocomplete="off" class="searchInput" placeholder=""/>
                            </div>
                            <div class="recentSelectsWrapper">
                                <!-- //this is the structure of the recently selected options that will generate dynamically with js:
                                <input type="button" class="recentButton" id="en" value="English"/>-->
                            </div>
                            <button class="closeButton ">
                                <div class="closeIcon_light"><svg fill="#5a5a5a" width="16" height="16" viewBox="-1 -2 18 18" xmlns="http://www.w3.org/2000/svg"><path d="m11.2929 3.29289c.3905-.39052 1.0237-.39052 1.4142 0 .3905.39053.3905 1.02369 0 1.41422l-3.29289 3.29289 3.29289 3.2929c.3905.3905.3905 1.0237 0 1.4142s-1.0237.3905-1.4142 0l-3.2929-3.29289-3.29289 3.29289c-.39053.3905-1.02369.3905-1.41422 0-.39052-.3905-.39052-1.0237 0-1.4142l3.2929-3.2929-3.2929-3.29289c-.39052-.39053-.39052-1.02369 0-1.41422.39053-.39052 1.02369-.39052 1.41422 0l3.29289 3.2929z" fill-rule="evenodd"/></svg></div>
                                <div class="closeIcon_dark" ><svg fill="#bbbbbb" width="16" height="16" viewBox="-1 -2 18 18" xmlns="http://www.w3.org/2000/svg"><path d="m11.2929 3.29289c.3905-.39052 1.0237-.39052 1.4142 0 .3905.39053.3905 1.02369 0 1.41422l-3.29289 3.29289 3.29289 3.2929c.3905.3905.3905 1.0237 0 1.4142s-1.0237.3905-1.4142 0l-3.2929-3.29289-3.29289 3.29289c-.39053.3905-1.02369.3905-1.41422 0-.39052-.3905-.39052-1.0237 0-1.4142l3.2929-3.2929-3.2929-3.29289c-.39052-.39053-.39052-1.02369 0-1.41422.39053-.39052 1.02369-.39052 1.41422 0l3.29289 3.2929z" fill-rule="evenodd"/></svg></div>
                                <div class="downIcon_light" ><svg fill="#5a5a5a" width="16" height="16" viewBox="2 1 20 20"   xmlns="http://www.w3.org/2000/svg"><path d="m8.12 9.29 3.88 3.88 3.88-3.88c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41l-4.59 4.59c-.39.39-1.02.39-1.41 0l-4.59-4.59c-.39-.39-.39-1.02 0-1.41.39-.38 1.03-.39 1.42 0z"/></svg></div>
                                <div class="downIcon_dark"  ><svg fill="#bbbbbb" width="16" height="16" viewBox="2 1 20 20"   xmlns="http://www.w3.org/2000/svg"><path d="m8.12 9.29 3.88 3.88 3.88-3.88c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41l-4.59 4.59c-.39.39-1.02.39-1.41 0l-4.59-4.59c-.39-.39-.39-1.02 0-1.41.39-.38 1.03-.39 1.42 0z"/></svg></div>
                            </button>
                        </div>
                        <div class="optionsColumnsWrapper">
                            <!-- //this is the button structure of a column that will generate dynamically with js:
                            <div class="optionsColumn">
                                <input type="button" class="optionButton" id="en" value="English"/>
                                <input type="button" class="optionButton" id="sp" value="Spanish"/>
                                <input type="button" class="optionButton" id="fr" value="French"/>
                            </div/>-->
                        </div>
                    </div>
                </div>
            </div>
        `;
        return Selector.getChildNode(html);
	}

    //getOptionButtonHtml:
    protected static getOptionButtonHtml(className:string, id:string, name:string, iconSrc:string, iconSize:string, number:string, isSelected:boolean):ChildNode{
        const html = `
            <input
                type="button"
                class="navButton ${className}${iconSrc !== '' ? ' withIcon' : ''}${isSelected ? ' selected' : ' unselected'}"
                id="${id}"
                value="${name}"
                number="${number}"
                title="${name}"
                style="${iconSrc !== '' ? ('background-image:' + "url('" + iconSrc + "');") : ''} ${iconSize !== '' ? ('background-size:' + iconSize + ';') : ''}"
            />`;
        return Selector.getChildNode(html);
    }

    //getColumnHtml:
    protected static getColumnHtml(index:number):ChildNode{
        const html = `<div class="optionsColumn column_${index}">`;
        return Selector.getChildNode(html);
    }

    //getChildNode:
    protected static getChildNode(html:string):ChildNode{
        let div = document.createElement('div');
        div.innerHTML = html.trim();
        return div.firstChild || div;
    }

    //setTitle:
    public setTitle(title:string){
        this.title = title;
        let titleEl = <HTMLElement> this.view.getElementsByClassName('title')[0];
        titleEl.innerHTML = this.title;
        this.setupHeader();
    }

    //setSearchPlaceholder:
    protected setSearchPlaceholder(sph:string){
        this.searchPlaceholder = sph;
        let searchEl = <HTMLInputElement> this.view.getElementsByClassName('searchInput')[0];
        searchEl.placeholder = this.searchPlaceholder;
        this.setupHeader();
    }

    //setupHeader:
    protected setupHeader(){
        let titleEl  = <HTMLElement> this.view.getElementsByClassName('title')[0];
        let searchEl = <HTMLElement> this.view.getElementsByClassName('searchContainer')[0];
        if(this.isSearchable){
            titleEl.style.display  = 'none';
            searchEl.style.display = 'flex';
        }else{
            titleEl.style.display  = 'block';
            searchEl.style.display = 'none';
        }
    }

    //showRecentSelects:
    protected showRecentSelects(){
        let recentWrapper = <HTMLElement> this.view.getElementsByClassName('recentSelectsWrapper')[0];
        let columnNumber = 1;
        this.recentSelects?.forEach((option) => {
            let id = option.id;
            let name = option.name;
            let buttonHtml = Selector.getOptionButtonHtml('recentButton', id, name, '', '', (columnNumber + "_0"), false);
            recentWrapper.appendChild(buttonHtml);
            columnNumber++;
        });
        if(this.recentSelects !== undefined)
          if(this.recentSelects.length > 0)
            recentWrapper.style.display = 'inline';
    }

    //showAllOptions:
    protected showAllOptions(neSizeCalc:boolean){
        if(!neSizeCalc) this.fixTheWindow();
        this.rowsNumber = this.calcRowsNumber();
        this.removeAllOptions();
        this.printColumns();
        if(this.columnsNumber === 1){
            const optionsColumn = <HTMLElement> this.view.getElementsByClassName('optionsColumn')[0];
            optionsColumn.classList.add('singleColumn');
        }
        this.addEventToOptions();
        if(neSizeCalc) this.releaseTheWindow();
    }

    //fixTheWindow:
    protected fixTheWindow(){
        const window = <HTMLElement> this.view.getElementsByClassName('window')[0];
        const windowWidth = window.offsetWidth;
        const windowHeight = window.offsetHeight;
        window.style.width = windowWidth + 'px';
        window.style.height = windowHeight + 'px';
    }

    //releaseTheWindow:
    protected releaseTheWindow(){
        const window = <HTMLElement> this.view.getElementsByClassName('window')[0];
        window.style.width = 'auto';
        window.style.height = 'auto';
    }

    //removeAllOptions:
    protected removeAllOptions(){
        let columnsWrapper = <HTMLElement> this.view.getElementsByClassName('optionsColumnsWrapper')[0];
        columnsWrapper.innerHTML = '';
    }

    //calcRowsNumber:
    protected calcRowsNumber():number{
        let maxRows = this.calcMaxRows();
        let maxColumns = this.calcMaxColumns();
        let rowsNumber = maxRows;
        let totalVisibleOptions = maxColumns * maxRows;
        let optionsLength = this.optionsToShow.length;
        if(optionsLength < totalVisibleOptions){
            if(optionsLength < maxRows)
                rowsNumber = optionsLength;
            else{
                let x = (optionsLength / 10);
                rowsNumber = Math.ceil(Math.sqrt(x) * 5);
            }
        }else
            rowsNumber = Math.ceil(optionsLength / maxColumns);
        return rowsNumber;
    }

    //calcMaxRows:
    protected calcMaxRows():number{
        let columnsWrapperHeight = window.innerHeight - 270;
        let maxRows = Math.floor(columnsWrapperHeight / Selector.ROW_HEIGHT);
        if(maxRows > this.maxRows)
            maxRows = this.maxRows;
        return maxRows;
    }

    //calcMaxColumns:
    protected calcMaxColumns():number{
        let columnsWrapperWidth = window.innerWidth - 250;
        let maxColumns = Math.floor(columnsWrapperWidth / Selector.COLUMN_WIDTH);
        if(maxColumns > this.maxColumns)
            maxColumns = this.maxColumns;
        return maxColumns;
    }

    //printColumns:
    protected printColumns(){
        if(this.optionsToShow.length === 0) return;
        let columnsWrapper = <HTMLElement> this.view.getElementsByClassName('optionsColumnsWrapper')[0];
        let buttonCounter = 0;
        this.columnsNumber = 1;
        while(1){
            let columnHtml = Selector.getColumnHtml(this.columnsNumber);
            columnsWrapper.appendChild(columnHtml);
            let column = <HTMLElement> this.view.getElementsByClassName('column_' + this.columnsNumber)[0];
            for(let j = 1; j <= this.rowsNumber; j++){
                let isSelected = false;
                let option = this.optionsToShow[buttonCounter];
                let number = this.columnsNumber + '_' + j;
                if(option.id === this.currentOptionId) isSelected = true;
                let buttonHtml = Selector.getOptionButtonHtml('optionButton', option.id, option.name, option.iconSrc ?? '', option.iconSize ?? '', number, isSelected);
                column.appendChild(buttonHtml);
                buttonCounter++;
                if(buttonCounter >= this.optionsToShow.length) return;
            }
            this.columnsNumber++;
        }
    }

    //setTheme:
    public setTheme(theme?:string){
        if(theme === undefined) return;
        this.theme == theme;
        this.view.classList.remove('light');
        this.view.classList.remove('dark');
        this.view.classList.add(theme);
    }

    //setStyle:
    public setStyle(style?:object){
        if(style === undefined) return;
        this.style = style;
        for(const [className, style] of Object.entries(this.style)){
            const elements = this.view.querySelectorAll('.' + className);
            elements.forEach(element => {
                for(const property of style)
                    (<HTMLElement> element).style.setProperty(property[0], property[1]);
            });
        }
    }

    //show:
    protected show(){
        const thisView = this;
        setTimeout(() => {
            thisView.view.classList.add('visible');
            setTimeout(() => {
                const searchInput = <HTMLInputElement> this.view.getElementsByClassName('searchInput')[0];
                searchInput.focus();
            }, 100);
        }, 50);//slight delay between adding to DOM and running css animation
    }

    //addWindowSizeEvent:
    protected addWindowSizeEvent(){
        window.addEventListener('resize', () => {
            if(this.columnsNumber !== this.calcMaxColumns())
                this.showAllOptions(true);
        });
    }

    //addEventToSearch:
    protected addEventToSearch(){
        const thisView = this;
        const searchInput = this.view.getElementsByClassName('searchInput')[0];
        searchInput.addEventListener('input', e => {
            const target = <HTMLInputElement> e.target;
            const searchPhrase = target.value;
            thisView.optionsToShow = thisView.allOptions.filter(option => option.name.toLowerCase().search(searchPhrase.toLowerCase()) >= 0) || [];
            thisView.showAllOptions(searchPhrase === '');
        });
        searchInput.addEventListener('keyup', e => {
            const event = <KeyboardEvent> e;
            if(event.key === 'ArrowDown'){
                const columnsWrapper = <HTMLElement> this.view.getElementsByClassName('optionsColumnsWrapper')[0];
                const firstOption = <HTMLElement> columnsWrapper.getElementsByClassName('optionButton')[0];
                firstOption.focus();
            }
        });
    }

    //addEventToOptions:
    protected addEventToOptions(){
        const recentButtons = Array.from(this.view.querySelectorAll('.recentButton'));
        const optionButtons = Array.from(this.view.querySelectorAll('.optionButton'));
        const allButtons = recentButtons.concat(optionButtons);
        allButtons.forEach(button => {
            button.addEventListener('click', e => {
                let element = <HTMLInputElement> e?.target;
                if(this.onSelect !== undefined)
                    this.onSelect(element.id, element.value);
                this.hide();
            });
        });
        this.addNavigationEvents();
    }

    //addNavigationEvents:
    protected addNavigationEvents(){
        let thisView = this;
        const buttons = this.view.querySelectorAll('.navButton');
        buttons.forEach(button => {
            button.addEventListener('keydown', e => {
                e.preventDefault();
                const event  = <KeyboardEvent> e;
                const target = <HTMLElement> e.target;
                let number = target.getAttribute('number') ?? '0_0';
                let rowCol = number.split('_');
                let column = parseInt(rowCol[0]);
                let row    = parseInt(rowCol[1]);
                switch(event.key){
                    case 'ArrowUp':
                        thisView.getOptionButton(column, row - 1)?.focus();
                        if(row == 1) (<HTMLInputElement> thisView.view.getElementsByClassName('searchInput')[0]).focus();
                        break;
                    case 'ArrowDown':
                        while(1){
                            let optionButton = thisView.getOptionButton(column, row + 1);
                            if(optionButton !== null){
                                optionButton.focus();
                                return;
                            }
                            if(column-- < 0) return;
                        }
                        break;
                    case 'ArrowLeft':
                        thisView.getOptionButton(column - 1, row)?.focus();
                        break;
                    case 'ArrowRight':
                        thisView.getOptionButton(column + 1, row)?.focus();
                        break;
                    case 'Enter':
                    case 'Space':
                        let element = <HTMLInputElement> e.target;
                        if(thisView.onSelect !== undefined)
                            thisView.onSelect(element.id, element.value);
                        thisView.hide();
                    break;
                }
            });
        });
    }

    //getOptionButton:
    protected getOptionButton(column:number, row:number):HTMLElement{
        return <HTMLElement> this.view.querySelector('[number="' + column + '_' + row + '"]');
    }

    //addEventToClose:
    protected addEventToClose(){
        const thisView = this;
        const closeButton = this.view.getElementsByClassName('closeButton')[0];
        closeButton.addEventListener('click', e => {
            thisView.hide();
        });
        const window = this.view.getElementsByClassName('window')[0];
        window.addEventListener('click', e => {
            e.stopPropagation();
        });
        const container = this.view.getElementsByClassName('container')[0];
        container.addEventListener('click', e => {
            thisView.hide();
        });
        const shadow = this.view.getElementsByClassName('shadow')[0];
        shadow.addEventListener('click', e => {
            thisView.hide();
        });
    }

    //hide:
    public hide(){
        this.view.classList.remove('visible');
        const thisView = this;
        setTimeout(() => {
            thisView.view.remove();
        }, 500);//long enough to make sure that it is hidden
    }

}

const Style = `
@media (hover: hover) and (pointer: fine) {
  .thinScrollbar::-webkit-scrollbar, .selector > .container > .window > .optionsColumnsWrapper::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .thinScrollbar::-webkit-scrollbar-track, .selector > .container > .window > .optionsColumnsWrapper::-webkit-scrollbar-track {
    background: transparent;
  }
  .thinScrollbar::-webkit-scrollbar-thumb, .selector > .container > .window > .optionsColumnsWrapper::-webkit-scrollbar-thumb {
    background: #bbb;
    border-radius: 20px;
  }
  .darkMode .thinScrollbar::-webkit-scrollbar-thumb, .darkMode .selector > .container > .window > .optionsColumnsWrapper::-webkit-scrollbar-thumb {
    background: #555;
  }
}
.transparentBackground, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected, .selector > .container > .window > .toolbar > .closeButton, .selector > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton {
  transition: background-color 50ms;
}

.transparentBackground:enabled:active, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected:enabled:active, .selector > .container > .window > .toolbar > .closeButton:enabled:active, .selector > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton:enabled:active {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

@media (hover: hover) and (pointer: fine) {
  .transparentBackground, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected, .selector > .container > .window > .toolbar > .closeButton, .selector > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton {
    transition: background-color 150ms;
  }
  .transparentBackground:enabled:hover, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected:enabled:hover, .selector > .container > .window > .toolbar > .closeButton:enabled:hover, .selector > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton:enabled:hover {
    background-color: rgba(0, 0, 0, 0.03) !important;
  }
  .transparentBackground:enabled:focus, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected:enabled:focus, .selector > .container > .window > .toolbar > .closeButton:enabled:focus, .selector > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton:enabled:focus {
    background-color: rgba(0, 0, 0, 0.04) !important;
  }
  .transparentBackground:enabled:active, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected:enabled:active, .selector > .container > .window > .toolbar > .closeButton:enabled:active, .selector > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton:enabled:active {
    background-color: rgba(0, 0, 0, 0.08) !important;
  }
}
.transparentBackground:disabled, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected:disabled, .selector > .container > .window > .toolbar > .closeButton:disabled, .selector > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton:disabled {
  opacity: 0.5;
  cursor: default;
}

.coloredBackground, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.selected {
  opacity: 0.8;
}

.coloredBackground:enabled:active, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.selected:enabled:active {
  opacity: 1;
}

@media (hover: hover) and (pointer: fine) {
  .coloredBackground:enabled:hover, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.selected:enabled:hover {
    opacity: 0.85;
  }
  .coloredBackground:enabled:focus, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.selected:enabled:focus {
    opacity: 0.9;
  }
  .coloredBackground:enabled:active, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.selected:enabled:active {
    opacity: 1;
  }
}
.coloredBackground:disabled, .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.selected:disabled {
  opacity: 0.5;
  cursor: default;
}

.transparentBackground_dark, .selector.dark > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected, .selector.dark > .container > .window > .toolbar > .closeButton, .selector.dark > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton {
  transition: background-color 50ms;
}

.transparentBackground_dark:enabled:active, .selector.dark > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected:enabled:active, .selector.dark > .container > .window > .toolbar > .closeButton:enabled:active, .selector.dark > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton:enabled:active {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

@media (hover: hover) and (pointer: fine) {
  .transparentBackground_dark, .selector.dark > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected, .selector.dark > .container > .window > .toolbar > .closeButton, .selector.dark > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton {
    transition: background-color 150ms;
  }
  .transparentBackground_dark:enabled:hover, .selector.dark > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected:enabled:hover, .selector.dark > .container > .window > .toolbar > .closeButton:enabled:hover, .selector.dark > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton:enabled:hover {
    background-color: rgba(255, 255, 255, 0.12) !important;
  }
  .transparentBackground_dark:enabled:focus, .selector.dark > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected:enabled:focus, .selector.dark > .container > .window > .toolbar > .closeButton:enabled:focus, .selector.dark > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton:enabled:focus {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  .transparentBackground_dark:enabled:active, .selector.dark > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected:enabled:active, .selector.dark > .container > .window > .toolbar > .closeButton:enabled:active, .selector.dark > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton:enabled:active {
    background-color: rgba(255, 255, 255, 0.07) !important;
  }
}
.selector {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  visibility: hidden;
  z-index: 999999993;
}
.selector * {
  padding: 0;
  margin: 0;
  font-family: Catamaran-Medium;
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}
.selector a::-moz-focus-inner,
.selector input::-moz-focus-inner,
.selector button::-moz-focus-inner {
  border: 0;
  padding: 0;
}
.selector a {
  text-decoration: none;
  outline: none;
}
.selector input, .selector button, .selector select {
  border: none;
  outline: none;
}
.selector input[type=button], .selector button, .selector select {
  cursor: pointer;
}
.selector input:required,
.selector input:invalid {
  box-shadow: none;
}
.selector input[type=button], .selector button {
  font-size: 1rem;
  padding: 0;
  background: none;
}
.selector > .shadow {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 160ms ease-in-out;
}
.selector > .container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 160ms ease-in-out;
}
.selector > .container > .window {
  max-width: calc(100% - 100px);
  min-height: 260px;
  max-height: calc(100% - 60px);
  padding: 15px 17px;
  padding-top: 13px;
  background-color: white;
  border: solid 1px rgb(100, 100, 100);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.selector > .container > .window > .toolbar {
  border-bottom: solid 1px #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
}
.selector > .container > .window > .toolbar > .title {
  min-width: 226px;
  padding-left: 2px;
  color: #333;
}
.selector > .container > .window > .toolbar > .searchContainer {
  flex: 1;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
}
.selector > .container > .window > .toolbar > .searchContainer > svg {
  min-width: 30px;
}
.selector > .container > .window > .toolbar > .searchContainer > .searchInput {
  flex: 1;
  font-size: 1rem;
  color: #333;
}
.selector > .container > .window > .toolbar > .recentSelectsWrapper {
  text-align: right;
  height: 35px;
  display: none;
  overflow: hidden;
}
.selector > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton {
  min-width: -webkit-fit-content;
  min-width: -moz-fit-content;
  min-width: fit-content;
  padding-left: 7px;
  padding-right: 7px;
  height: 35px;
  font-size: 1rem;
  text-align: center;
  color: #333;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 3px;
}
.selector > .container > .window > .toolbar > .closeButton {
  width: 40px;
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: -5px;
  margin-bottom: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.selector > .container > .window > .toolbar > .closeButton > * {
  display: none;
  justify-content: center;
  align-items: center;
}
.selector > .container > .window > .toolbar > .closeButton > .closeIcon_light {
  display: flex;
}
.selector > .container > .window > .optionsColumnsWrapper {
  flex: 1;
  width: 100%;
  padding-right: 10px;
  display: flex;
  gap: 5px;
  overflow-y: auto;
}
.selector > .container > .window > .optionsColumnsWrapper > .optionsColumn {
  flex: 1;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.selector > .container > .window > .optionsColumnsWrapper > .optionsColumn .optionButton {
  width: 100%;
  min-width: 167px;
  max-width: 200px;
  padding-left: 20px;
  padding-right: 7px;
  height: 38px;
  font-size: 1rem;
  text-align: left;
  color: #333;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 3px;
}
.selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.selected {
  background-color: #e0eaf5;
  color: #0729ae;
}
.selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.withIcon {
  padding-left: 37px;
  background-repeat: no-repeat;
  background-position: left 8px center;
  background-size: 17px auto;
}
.selector > .container > .window > .optionsColumnsWrapper > .optionsColumn.singleColumn .optionButton {
  max-width: 100%;
}

.selector.visible {
  visibility: visible;
}
.selector.visible > .shadow,
.selector.visible > .container {
  opacity: 1;
}

.selector.dark > .container > .window {
  background-color: #181818;
  border-color: #1a1a1a;
}
.selector.dark > .container > .window > .toolbar {
  border-bottom-color: #e6e6e6;
}
.selector.dark > .container > .window > .toolbar > .searchInput {
  color: #ccc;
}
.selector.dark > .container > .window > .toolbar > .title {
  color: #ccc;
}
.selector.dark > .container > .window > .toolbar > .recentSelectsWrapper > .recentButton {
  color: #ccc;
}
.selector.dark > .container > .window > .toolbar > .closeButton > * {
  display: none;
}
.selector.dark > .container > .window > .toolbar > .closeButton > .closeIcon_dark {
  display: flex;
}
.selector.dark > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.unselected {
  color: #ccc;
}
.selector.dark > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton.selected {
  background-color: #269;
  color: #fff;
}

@media only screen and (max-width: 450px) {
  .selector > .container > .window {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    height: 100%;
    min-height: unset;
    max-height: 85%;
    padding-top: 20px;
    border: unset;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    top: unset;
    bottom: 0;
    left: 0;
    transform: unset;
  }
  .selector > .container > .window > .toolbar {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    position: relative;
    padding-bottom: 8px;
  }
  .selector > .container > .window > .toolbar > .searchContainer {
    width: calc(100% - 50px);
    flex: none;
  }
  .selector > .container > .window > .toolbar > .recentSelectsWrapper {
    text-align: left;
    flex: none;
    width: 100%;
    margin-bottom: -5px;
  }
  .selector > .container > .window > .toolbar > .closeButton {
    flex: none;
    position: absolute;
    top: 0;
    right: 0;
    margin: -6px -8px 0 0;
  }
  .selector > .container > .window > .toolbar > .closeButton > * {
    display: none !important;
  }
  .selector > .container > .window > .toolbar > .closeButton > .downIcon_light {
    display: flex !important;
  }
  .selector > .container > .window > .optionsColumnsWrapper {
    width: calc(100% + 5px);
    padding-right: 5px;
  }
  .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn {
    width: 100%;
  }
  .selector > .container > .window > .optionsColumnsWrapper > .optionsColumn > .optionButton {
    min-width: unset;
    max-width: unset;
  }
  .selector.dark > .container > .window > .toolbar > .closeButton > * {
    display: none !important;
  }
  .selector.dark > .container > .window > .toolbar > .closeButton > .downIcon_dark {
    display: flex !important;
  }
}
`;