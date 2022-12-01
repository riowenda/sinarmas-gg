export interface TreeSelect2Props {
    data: {}[];
    onChange? : (currentNode : any, selectedNodes : any) => void;
    onAction? : () => void;
    onNodeToggle?: (currentNode: any) => void;
}