# AWB Tracker

This package is able to query AWB tracking numbers and returns the origin and the destination of the shipment

## Install dependencies

```bash
npm install
```

## Usage

```javascript
import { getAWBInfo } from 'awb-tracker';
var awbObject = getAWBInfo('123-12345675');
```

## Currently Supported Airlines
* Cargolux Airlines
* Qatar Airways