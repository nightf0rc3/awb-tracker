import axios from 'axios';

interface IParsedAWB {
    awb: string;
    airline: string;
    num: string;
}

interface ICargoInfo {
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

export async function getAWBInfo(awb: string): Promise<ICargoInfo|false> {
    const awbObj = parseAWB(awb);
    if (awbObj) {
        if (airlineCodeToFunction[awbObj.airline] !== undefined) {
            const shipmentData = await airlineCodeToFunction[awbObj.airline](awbObj);
            if (shipmentData) {
                return Object.assign(awbObj, { route: shipmentData });
            }
        } else {
            console.log(`No tracker for Airline ${awbObj.airline} defined`);
            return awbObj;
        }
    }
    return false;
}

function parseAWB(awb: string) {
    const AWB_RGX = /(\d{3})-(\d{8})/;
    const parsed = AWB_RGX.exec(awb);
    if (parsed[0] !== undefined && parsed[1] !== undefined && parsed[2] !== undefined) {
        return {
            awb,
            airline: parsed[1],
            num: parsed[2]
        };
    }
    return false;
}

const cargoLuxTracker = async (awbObj: IParsedAWB) => {
    // 172-xxxxxxxx
    const rawData = await axios.get(`https://cvtnt.champ.aero/showSearchResults?q=${awbObj.awb}&t=UTC`);
    if (rawData.status === 200) {
        // console.log(`https://cvtnt.champ.aero/trackntrace?awbnumber=${awbObj.awb}`);
        const data = JSON.parse(rawData.data.split('var consignment = ')[1].split(';')[0].replace(/'/g, '"'));
        return {
            origin: data.origin,
            originAirport: data.origin.split(' -')[0],
            destination: data.destination,
            destinationAirport: data.destination.split(' -')[0]
        };
    }
    throw new Error(rawData.statusText);
};

const qatarTracker = async (awbObj: IParsedAWB) => {
    // 157-xxxxxxxx
    const data = {
        cargoTrackingRequestSOs:[{
            documentType: 'MAWB',
            documentPrefix: awbObj.airline,
            documentNumber: awbObj.num
        }]
    };
    const cookies = 'BIGipServerqrcargo-http-pool=3795590060.20480.0000; ' +
    'SERVICE_REQUEST_ID="/NvmyGXKUoxkZrAS5qUwrA== ";';
    const rawData = await axios.post('http://www.qrcargo.com/doTrackShipmentsAction', data, {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Origin: 'http://www.qrcargo.com',
            Referer: 'http://www.qrcargo.com/trackshipment',
            'X-Requested-With': 'XMLHttpRequest',
            Cookie: cookies
        }
    });
    if (rawData.status === 200) {
        const data = rawData.data.split('segment">')[1].split('</span>')[0].split('-');
        return {
            origin: data[0],
            originAirport: data[0],
            destination: data[1],
            destinationAirport: data[1]
        };
    }
    throw new Error(rawData.statusText);
};

const cargojetTracker = async (awbObj: IParsedAWB) => {
    console.log('Cargo Jet not implemented.');
};

const lufthansaTracker = async (awbObj: IParsedAWB) => {
    console.log('Lufthansa Cargo not implemented.');
};

const volgaDneprTracker = async (awbObj: IParsedAWB) => {
    console.log('Volga Dneper not implemented.');
};

const deltaTracker = async (awbObj: IParsedAWB) => {
    console.log('Delta Cargo not implemented.');
};

const airlineCodeToFunction = {
    172: cargoLuxTracker,
    157: qatarTracker,
    489: cargojetTracker,
    '020': lufthansaTracker,
    412: volgaDneprTracker,
    '006': deltaTracker
};
