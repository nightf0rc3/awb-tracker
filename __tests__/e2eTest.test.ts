import axios from 'axios';
import { getAWBInfo } from '../src/index';

describe('Random AWB Number Test', () => {
    test('CargoLux', async () => {
        expect.assertions(9);
        const data = await getAWBInfo('172-24874323');
        expect(data).toBeTruthy();
        if (data) {
            expect(data.awb).toEqual('172-24874323');
            expect(data.airline).toEqual('172');
            expect(data.num).toEqual('24874323');
            expect(data.route).toBeDefined();
            expect(data.route.origin).toEqual('LUX - Luxembourg (LU)');
            expect(data.route.originAirport).toEqual('LUX');
            expect(data.route.destination).toEqual('ATL - Atlanta (US)');
            expect(data.route.destinationAirport).toEqual('ATL');
        }
    });
    test('Qatar', async () => {
        expect.assertions(9);
        const data = await getAWBInfo('157-07310251');
        expect(data).toBeTruthy();
        if (data) {
            expect(data.awb).toEqual('157-07310251');
            expect(data.airline).toEqual('157');
            expect(data.num).toEqual('07310251');
            expect(data.route).toBeDefined();
            expect(data.route.origin).toEqual('FRA');
            expect(data.route.originAirport).toEqual('FRA');
            expect(data.route.destination).toEqual('ATL');
            expect(data.route.destinationAirport).toEqual('ATL');
        }
    });
});
