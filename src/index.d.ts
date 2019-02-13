export declare function getAWBInfo(a: string): {
    awb: string;
    airline: string;
    num: string;
    route?: {
        origin: string;
        originAirport: string;
        destination: string;
        destinationAirport: string;
    };
}
