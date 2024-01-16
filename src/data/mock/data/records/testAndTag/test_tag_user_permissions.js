export default {
    uqttadmin: {
        status: 'ok', 
        data: {
            "department_display_name": "Library",
            "department_visual_inspection_device_id": 3,
            "user_current_flag": "1",
            "user_department": "UQL",
            "user_id": 2,
            "user_licence_number": "234567",
            "user_name": "JTest user ADMIN",
            "user_uid": "uqtest1",
            "privileges": {
              "can_admin": 1,
              "can_inspect": 0,
              "can_alter": 0,
              "can_see_reports": 0,
            },
        },
    },
    uqttinspect: {
        status: 'ok', 
        data: {
            "department_display_name": "Library",
            "department_visual_inspection_device_id": 3,
            "user_current_flag": "1",
            "user_department": "UQL",
            "user_id": 2,
            "user_licence_number": "234567",
            "user_name": "JTest user INSPECT",
            "user_uid": "uqtest1",
            "privileges": {
              "can_admin": 0,
              "can_inspect": 1,
              "can_alter": 0,
              "can_see_reports": 0,
            },
        },
    },
    uqttalter: {
        status: 'ok', 
        data: {
            "department_display_name": "Library",
            "department_visual_inspection_device_id": 3,
            "user_current_flag": "1",
            "user_department": "UQL",
            "user_id": 2,
            "user_licence_number": "234567",
            "user_name": "JTest user ALTER",
            "user_uid": "uqtest1",
            "privileges": {
              "can_admin": 0,
              "can_inspect": 0,
              "can_alter": 1,
              "can_see_reports": 0,
            },
        },
    },
    uqttreport: {
        status: 'ok', 
        data: {
            "department_display_name": "Library",
            "department_visual_inspection_device_id": 3,
            "user_current_flag": "1",
            "user_department": "UQL",
            "user_id": 2,
            "user_licence_number": "234567",
            "user_name": "JTest user REPORT",
            "user_uid": "uqtest1",
            "privileges": {
              "can_admin": 0,
              "can_inspect": 0,
              "can_alter": 0,
              "can_see_reports": 1,
            },
        },
    }  
    
};