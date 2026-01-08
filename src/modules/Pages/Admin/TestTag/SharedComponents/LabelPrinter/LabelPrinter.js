// import React, { useRef } from 'react';
// import LabelPrinterSelector from './LabelPrinterSelector';
// import PrinterSingleton from './ZplClass';

// const LabelPrinter = async ({ id, classNames }) => {
//     const componentId = `label_printer-${id}`;
//     const printer = useRef(PrinterSingleton.getInstance()).current;
//     const isConnected = await printer.connect();

//     return (
//         <div id={componentId} data-testid={componentId} className={classNames?.root}>
//             {isConnected ? <LabelPrinterSelector id={id} classNames={classNames} /> : <div>No printers available</div>}
//         </div>
//     );
// };

// export default LabelPrinter;
// // HERE NEED TO THINK ABOUT HOW BEST TO PUT ALL THE BITS TOGETHER TO ENABLE PRINTING
