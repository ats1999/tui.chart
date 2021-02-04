import Component from "./component";
import { isExportMenuVisible, padding } from "../store/layout";
import { execDownload, downloadSpreadSheet } from "../helpers/downloader";
import { isString } from "../helpers/utils";
import { getFontStyleString } from "../helpers/style";
const EXPORT_MENU_WIDTH = 140;
export const BUTTON_RECT_SIZE = 24;
export default class ExportMenu extends Component {
    constructor() {
        super(...arguments);
        this.models = { exportMenuButton: [] };
        this.opened = false;
        this.toggleExportMenu = () => {
            this.opened = !this.opened;
            this.models.exportMenuButton[0].opened = this.opened;
            this.eventBus.emit('needDraw');
            if (this.opened) {
                this.chartEl.appendChild(this.exportMenuEl);
            }
            else {
                this.chartEl.removeChild(this.exportMenuEl);
            }
        };
        this.getCanvasExportBtnRemoved = () => {
            const canvas = this.chartEl.getElementsByTagName('canvas')[0];
            const ctx = canvas.getContext('2d');
            const { x, y, height: h, width: w } = this.rect;
            ['#fff', this.chartBackgroundColor].forEach((color) => {
                ctx.fillStyle = color;
                ctx.fillRect(x, y, w, h);
            });
            return canvas;
        };
        this.onClickExportButton = (ev) => {
            const { id } = ev.target;
            if (id === 'png' || id === 'jpeg') {
                const canvas = this.getCanvasExportBtnRemoved();
                execDownload(this.fileName, id, canvas.toDataURL(`image/${id}`, 1));
            }
            else {
                downloadSpreadSheet(this.fileName, id, this.data);
            }
            this.toggleExportMenu();
        };
    }
    applyExportButtonPanelStyle(chartWidth) {
        const exportMenu = this.exportMenuEl.querySelector('.toastui-chart-export-menu');
        const exportMenuTitle = this.exportMenuEl.querySelector('.toastui-chart-export-menu-title');
        const menuBtnWrapper = this.exportMenuEl.querySelector('.toastui-chart-export-menu-btn-wrapper');
        exportMenu.setAttribute('style', this.makePanelWrapperStyle(chartWidth));
        exportMenuTitle.setAttribute('style', this.makePanelStyle('header'));
        menuBtnWrapper.setAttribute('style', this.makePanelStyle('body'));
    }
    makeExportMenuButton() {
        const el = document.createElement('div');
        el.onclick = this.onClickExportButton;
        el.innerHTML = `
        <div class="toastui-chart-export-menu">
          <p class="toastui-chart-export-menu-title">Export to</p>
          <div class="toastui-chart-export-menu-btn-wrapper">
            <button class="toastui-chart-export-menu-btn" id="xls">xls</button>
            <button class="toastui-chart-export-menu-btn" id="csv">csv</button>
            <button class="toastui-chart-export-menu-btn" id="png">png</button>
            <button class="toastui-chart-export-menu-btn" id="jpeg">jpeg</button>
          </div>
        </div>
      `;
        return el;
    }
    initialize({ chartEl }) {
        this.chartEl = chartEl;
        this.type = 'exportMenu';
        this.name = 'exportMenu';
        this.exportMenuEl = this.makeExportMenuButton();
    }
    onClick({ responders }) {
        if (responders.length) {
            this.toggleExportMenu();
        }
    }
    getFileName(title) {
        var _a, _b;
        return isString(title) ? title : (_b = (_a = title) === null || _a === void 0 ? void 0 : _a.text, (_b !== null && _b !== void 0 ? _b : 'toast-ui-chart'));
    }
    render({ options, layout, chart, series, rawCategories, theme }) {
        var _a, _b;
        this.isShow = isExportMenuVisible(options);
        if (!this.isShow) {
            return;
        }
        this.chartBackgroundColor = theme.chart.backgroundColor;
        this.theme = theme.exportMenu;
        this.data = { series, categories: rawCategories };
        this.fileName = this.getFileName(((_b = (_a = options) === null || _a === void 0 ? void 0 : _a.exportMenu) === null || _b === void 0 ? void 0 : _b.filename) || chart.title);
        this.applyExportButtonPanelStyle(chart.width);
        this.rect = layout.exportMenu;
        this.models.exportMenuButton = [
            {
                type: 'exportMenuButton',
                x: 0,
                y: 0,
                opened: this.opened,
                theme: this.theme.button,
            },
        ];
        this.responders = [
            {
                type: 'rect',
                width: BUTTON_RECT_SIZE,
                height: BUTTON_RECT_SIZE,
                x: 0,
                y: 0,
            },
        ];
    }
    makePanelWrapperStyle(chartWidth) {
        const { top, left } = this.chartEl.getBoundingClientRect();
        const topPosition = top + padding.Y + BUTTON_RECT_SIZE + 5;
        const leftPosition = left + chartWidth - EXPORT_MENU_WIDTH - padding.X;
        const { borderRadius, borderWidth, borderColor } = this.theme.panel;
        return `top: ${topPosition}px; left: ${leftPosition}px; border: ${borderWidth}px solid ${borderColor}; border-radius: ${borderRadius}px;`;
    }
    makePanelStyle(type) {
        const sectionTheme = this.theme.panel[type];
        const direction = type === 'header' ? 'top' : 'bottom';
        const { borderRadius, borderWidth } = this.theme.panel;
        const borderRadiusPx = `${borderRadius - borderWidth}px`;
        return [
            `${getFontStyleString(sectionTheme)}`,
            `border-${direction}-left-radius: ${borderRadiusPx};`,
            `border-${direction}-right-radius: ${borderRadiusPx};`,
            `background-color: ${sectionTheme.backgroundColor};`,
        ].join('');
    }
}
