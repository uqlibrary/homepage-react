export default {
    Emulator: {
        name: 'GK420t',
        template: ({
            logo,
            userId,
            assetId,
            testDate,
            dueDate,
        }) => `~SD15 ~TA000 ^XA ^SZ2 ^PW812 ^LL406 ^POI ^PR2,2 ^PMN ^MNY ^LS0 ^MTT ^XZ ^XA^JUS^XZ
^XA
^MTT
^FO50,${logo}
~SD15
^CI28
^FWB
^FO450,220^AA,20^FDTested By: ^FS
^FO450,40^AA,20,20^FD${userId}^FS
^MD-10 ^AA,20,10 ^FO520,40^BCB,70,Y,N,N,N^FD${assetId}^FS ^MD0
^FO650,210^AA,20^FDDate Tested: ^FS
^FO650,25^AA,20,15^FD${testDate}^FS
^FO670,210^AA,20^FDDate Due: ^FS
^FO670,25^AA,20,15^FD${dueDate}^FS
^XZ`,
    },
    'GK420t (29J120602579)': {
        name: 'GK420t',
        template: ({
            logo,
            userId,
            assetId,
            testDate,
            dueDate,
        }) => `~SD15 ~TA000 ^XA ^SZ2 ^PW812 ^LL406 ^POI ^PR2,2 ^PMN ^MNY ^LS0 ^MTT ^XZ ^XA^JUS^XZ
^XA
^MTT
^FO50,${logo}
~SD15
^CI28
^FWB
^FO450,220^AA,20^FDTested By: ^FS
^FO450,40^AA,20,20^FD${userId}^FS
^MD-10 ^AA,20,10 ^FO520,40^BCB,70,Y,N,N,N^FD${assetId}^FS ^MD0
^FO650,210^AA,20^FDDate Tested: ^FS
^FO650,25^AA,20,15^FD${testDate}^FS
^FO670,210^AA,20^FDDate Due: ^FS
^FO670,25^AA,20,15^FD${dueDate}^FS
^XZ`,
    },
    'GK888t (EPL) (19J153101586)': {
        name: 'GK888t',
        template: ({
            logo,
            userId,
            assetId,
            testDate,
            dueDate,
        }) => `~SD15 ~TA000 ^XA ^SZ2 ^PW812 ^LL406 ^POI ^PR2,2 ^PMN ^MNY ^LS0 ^MTT ^XZ ^XA^JUS^XZ
^XA
^MTT
^FO50,${logo}
~SD15
^CI28
^FWB
^FO450,220^A1,20^FDTested By: ^FS
^FO450,40^A1,20,20^FD${userId}^FS
^MD-8 ^FO525,60^BCB,80,Y,N,N,N^FD${assetId}^FS ^MD0
^FO655,210^A1,20^FDDate Tested: ^FS
^FO655,25^A1,20,15^FD${testDate}^FS
^FO675,210^A1,20^FDDate Due: ^FS
^FO675,25^A1,20,15^FD${dueDate}^FS
^XZ`,
    },
};
