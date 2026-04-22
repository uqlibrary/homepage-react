export default {
    "data": [
        {
            "printer_template_id": 1,
            "printer_template_department_slug": "UQL",
            "printer_template_name": "UQL Standard Template",
            "printer_template_code": "^XA^FO{{LOGOX}},{{LOGOY}}^XZ^FO{{LABELTESTEDBYX}},{{LABELTESTEDBYY}}^FDTested By:^FS^FO{{USERIDX}},{{USERIDY}}^FD{%USERID%}^FS^FO{{BARCODEX}},{{BARCODEY}}^BC^FD{%ASSETID%}^FS^FO{{LABELDATETESTEDX}},{{LABELDATETESTEDY}}^FDTest Date:^FS^FO{{TESTDATEX}},{{TESTDATEY}}^FD{%TESTDATE%}^FS^FO{{LABELDATEDUEX}},{{LABELDATEDUEY}}^FDDue Date:^FS^FO{{DUEDATEX}},{{DUEDATEY}}^FD{%DUEDATE%}^FS^XZ",
            "printer_template_current_flag": 1,
            "created_at": "2026-02-05T00:00:00.000000Z",
            "updated_at": "2026-02-05T00:00:00.000000Z",
            "vars": [
            { "printer_template_var_id": 7,  "printer_template_var_template_id": 1, "printer_template_var_name": "{{BARCODEX}}",        "printer_template_var_label": "Barcode X",           "printer_template_var_value": "10" },
            { "printer_template_var_id": 8,  "printer_template_var_template_id": 1, "printer_template_var_name": "{{BARCODEY}}",        "printer_template_var_label": "Barcode Y",           "printer_template_var_value": "50" },
            { "printer_template_var_id": 15, "printer_template_var_template_id": 1, "printer_template_var_name": "{{DUEDATEX}}",        "printer_template_var_label": "Due Date X",          "printer_template_var_value": "200" },
            { "printer_template_var_id": 16, "printer_template_var_template_id": 1, "printer_template_var_name": "{{DUEDATEY}}",        "printer_template_var_label": "Due Date Y",          "printer_template_var_value": "90" },
            { "printer_template_var_id": 13, "printer_template_var_template_id": 1, "printer_template_var_name": "{{LABELDATEDUEX}}",   "printer_template_var_label": "Label Date Due X",    "printer_template_var_value": "100" },
            { "printer_template_var_id": 14, "printer_template_var_template_id": 1, "printer_template_var_name": "{{LABELDATEDUEY}}",   "printer_template_var_label": "Label Date Due Y",    "printer_template_var_value": "90" },
            { "printer_template_var_id": 9,  "printer_template_var_template_id": 1, "printer_template_var_name": "{{LABELDATETESTEDX}}","printer_template_var_label": "Label Date Tested X", "printer_template_var_value": "100" },
            { "printer_template_var_id": 10, "printer_template_var_template_id": 1, "printer_template_var_name": "{{LABELDATETESTEDY}}","printer_template_var_label": "Label Date Tested Y", "printer_template_var_value": "50" },
            { "printer_template_var_id": 3,  "printer_template_var_template_id": 1, "printer_template_var_name": "{{LABELTESTEDBYX}}", "printer_template_var_label": "Label Tested By X",  "printer_template_var_value": "100" },
            { "printer_template_var_id": 4,  "printer_template_var_template_id": 1, "printer_template_var_name": "{{LABELTESTEDBYY}}", "printer_template_var_label": "Label Tested By Y",  "printer_template_var_value": "10" },
            { "printer_template_var_id": 1,  "printer_template_var_template_id": 1, "printer_template_var_name": "{{LOGOX}}",           "printer_template_var_label": "Logo X",              "printer_template_var_value": "10" },
            { "printer_template_var_id": 2,  "printer_template_var_template_id": 1, "printer_template_var_name": "{{LOGOY}}",           "printer_template_var_label": "Logo Y",              "printer_template_var_value": "10" },
            { "printer_template_var_id": 11, "printer_template_var_template_id": 1, "printer_template_var_name": "{{TESTDATEX}}",       "printer_template_var_label": "Test Date X",         "printer_template_var_value": "200" },
            { "printer_template_var_id": 12, "printer_template_var_template_id": 1, "printer_template_var_name": "{{TESTDATEY}}",       "printer_template_var_label": "Test Date Y",         "printer_template_var_value": "50" },
            { "printer_template_var_id": 5,  "printer_template_var_template_id": 1, "printer_template_var_name": "{{USERIDX}}",         "printer_template_var_label": "User ID X",           "printer_template_var_value": "200" },
            { "printer_template_var_id": 6,  "printer_template_var_template_id": 1, "printer_template_var_name": "{{USERIDY}}",         "printer_template_var_label": "User ID Y",           "printer_template_var_value": "10" }
            ],
            "identifiers": [
            { "printer_template_identifier_id": 1, "printer_template_identifier_template_id": 1, "printer_template_identifier_value": "PRINTER_01" },
            { "printer_template_identifier_id": 2, "printer_template_identifier_template_id": 1, "printer_template_identifier_value": "PRINTER_02" }
            ],
            "printer_template_rendered": "^XA^FO10,10^XZ^FO100,10^FDTested By:^FS^FO200,10^FD{%USERID%}^FS^FO10,50^BC^FD{%ASSETID%}^FS^FO100,50^FDTest Date:^FS^FO200,50^FD{%TESTDATE%}^FS^FO100,90^FDDue Date:^FS^FO200,90^FD{%DUEDATE%}^FS^XZ"
        },
        {
            "printer_template_id": 3,
            "printer_template_department_slug": "UQL",
            "printer_template_name": "UQL Template B",
            "printer_template_code": "^XA^FO{{LOGOX}},{{LOGOY}}^XZ^FO{{LABELTESTEDBYX}},{{LABELTESTEDBYY}}^FDTested By:^FS^FO{{USERIDX}},{{USERIDY}}^FD{%USERID%}^FS^FO{{BARCODEX}},{{BARCODEY}}^BC^FD{%ASSETID%}^FS^FO{{LABELDATETESTEDX}},{{LABELDATETESTEDY}}^FDTest Date:^FS^FO{{TESTDATEX}},{{TESTDATEY}}^FD{%TESTDATE%}^FS^FO{{LABELDATEDUEX}},{{LABELDATEDUEY}}^FDDue Date:^FS^FO{{DUEDATEX}},{{DUEDATEY}}^FD{%DUEDATE%}^FS^XZ",
            "printer_template_current_flag": 1,
            "created_at": "2026-02-05T00:00:00.000000Z",
            "updated_at": "2026-02-05T00:00:00.000000Z",
            "vars": [
            { "printer_template_var_id": 39, "printer_template_var_template_id": 3, "printer_template_var_name": "{{BARCODEX}}",        "printer_template_var_label": "Barcode X",           "printer_template_var_value": "10" },
            { "printer_template_var_id": 40, "printer_template_var_template_id": 3, "printer_template_var_name": "{{BARCODEY}}",        "printer_template_var_label": "Barcode Y",           "printer_template_var_value": "50" },
            { "printer_template_var_id": 47, "printer_template_var_template_id": 3, "printer_template_var_name": "{{DUEDATEX}}",        "printer_template_var_label": "Due Date X",          "printer_template_var_value": "200" },
            { "printer_template_var_id": 48, "printer_template_var_template_id": 3, "printer_template_var_name": "{{DUEDATEY}}",        "printer_template_var_label": "Due Date Y",          "printer_template_var_value": "90" },
            { "printer_template_var_id": 45, "printer_template_var_template_id": 3, "printer_template_var_name": "{{LABELDATEDUEX}}",   "printer_template_var_label": "Label Date Due X",    "printer_template_var_value": "100" },
            { "printer_template_var_id": 46, "printer_template_var_template_id": 3, "printer_template_var_name": "{{LABELDATEDUEY}}",   "printer_template_var_label": "Label Date Due Y",    "printer_template_var_value": "90" },
            { "printer_template_var_id": 41, "printer_template_var_template_id": 3, "printer_template_var_name": "{{LABELDATETESTEDX}}","printer_template_var_label": "Label Date Tested X", "printer_template_var_value": "100" },
            { "printer_template_var_id": 42, "printer_template_var_template_id": 3, "printer_template_var_name": "{{LABELDATETESTEDY}}","printer_template_var_label": "Label Date Tested Y", "printer_template_var_value": "50" },
            { "printer_template_var_id": 35, "printer_template_var_template_id": 3, "printer_template_var_name": "{{LABELTESTEDBYX}}", "printer_template_var_label": "Label Tested By X",  "printer_template_var_value": "100" },
            { "printer_template_var_id": 36, "printer_template_var_template_id": 3, "printer_template_var_name": "{{LABELTESTEDBYY}}", "printer_template_var_label": "Label Tested By Y",  "printer_template_var_value": "10" },
            { "printer_template_var_id": 33, "printer_template_var_template_id": 3, "printer_template_var_name": "{{LOGOX}}",           "printer_template_var_label": "Logo X",              "printer_template_var_value": "10" },
            { "printer_template_var_id": 34, "printer_template_var_template_id": 3, "printer_template_var_name": "{{LOGOY}}",           "printer_template_var_label": "Logo Y",              "printer_template_var_value": "10" },
            { "printer_template_var_id": 43, "printer_template_var_template_id": 3, "printer_template_var_name": "{{TESTDATEX}}",       "printer_template_var_label": "Test Date X",         "printer_template_var_value": "200" },
            { "printer_template_var_id": 44, "printer_template_var_template_id": 3, "printer_template_var_name": "{{TESTDATEY}}",       "printer_template_var_label": "Test Date Y",         "printer_template_var_value": "50" },
            { "printer_template_var_id": 37, "printer_template_var_template_id": 3, "printer_template_var_name": "{{USERIDX}}",         "printer_template_var_label": "User ID X",           "printer_template_var_value": "200" },
            { "printer_template_var_id": 38, "printer_template_var_template_id": 3, "printer_template_var_name": "{{USERIDY}}",         "printer_template_var_label": "User ID Y",           "printer_template_var_value": "10" }
            ],
            "identifiers": [
            { "printer_template_identifier_id": 4, "printer_template_identifier_template_id": 3, "printer_template_identifier_value": "PRINTER_03" }
            ],
            "printer_template_rendered": "^XA^FO10,10^XZ^FO100,10^FDTested By:^FS^FO200,10^FD{%USERID%}^FS^FO10,50^BC^FD{%ASSETID%}^FS^FO100,50^FDTest Date:^FS^FO200,50^FD{%TESTDATE%}^FS^FO100,90^FDDue Date:^FS^FO200,90^FD{%DUEDATE%}^FS^XZ"
        },
    ],
};