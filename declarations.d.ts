declare var t: {
    translate(x?: string, params?: { [key: string]: string | number | boolean }): string;
    setLanguage(x: string): void;
};

declare var CIQ: any;
declare var __webpack_public_path__: string;

declare module '*.scss';
declare module '*.svg' {
    const content: React.SVGAttributes<SVGElement>;
    export default content;
}

interface Window {
    isProductionWebsite?: boolean;
    _trackJs: {
        token: string;
        application: string;
    };
}

interface Navigator {
    msSaveBlob: (blob: Blob, name: string) => void;
    onLine: boolean;
}

interface Document {
    documentMode?: any;
}
