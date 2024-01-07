export interface MultipleErrorHandler {
    Errors: ErrorHandler[];
    SetError: (destination: string, text: string) => void;
    HasError: (destination: string) => boolean;
    GetError: (destination: string) => string;
} 

export interface ErrorHandler { 
    Text: string;
    Destination: string;
}