declare var t: {
    translate(x?: string, options?: any): string;
    setLanguage(x: string): void;
};

declare var CIQ: any;
declare var __webpack_public_path__: any;

declare module '@binary-com/smartcharts';
declare module '*.scss';
declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}
