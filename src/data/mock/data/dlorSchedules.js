const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const formatDate = (date) => date.toISOString().slice(0, 10);

export const dlorSchedules = {
    "data": [
        {
            "schedule_id": 1,
            "schedule_name": "Test Number 0",
            "schedule_start_date": formatDate(yesterday),
            "schedule_end_date": formatDate(today),
            "schedule_running": true,
            "created_at": null,
            "updated_at": null,
            "schedule_status": true,
            "object_count": 1,
            "schedule_objects": [   
                "987y_isjgt_9866"
            ]
        },
        {
            "schedule_id": 2,
            "schedule_name": "Test Number 1",
            "schedule_start_date": "2099-12-24",
            "schedule_end_date": "2099-12-25",
            "created_at": null,
            "updated_at": null,
            "schedule_status": true,
            "object_count": 1,
            "schedule_objects": [   
                "987y_isjgt_9866"
            ]
        },
        {
            "schedule_id": 3,
            "schedule_name": "Test Number 2",
            "schedule_start_date": "2099-12-25",
            "schedule_end_date": "2099-12-26",
            "created_at": null,
            "updated_at": null,
            "schedule_status": true,
            "object_count": 2,
            "schedule_objects": [
                "987y_isjgt_9866",
                "98s0_dy5k3_98h4"
            ]
        },
        {
            "schedule_id": 94,
            "schedule_name": "completed",
            "schedule_start_date": "2025-12-22",
            "schedule_end_date": "2025-12-23",
            "created_at": null,
            "updated_at": null,
            "schedule_status": true,
            "object_count": 2,
            "schedule_running": false,
            "schedule_processed": true,
            "schedule_objects": [
                "987y_isjgt_9866",
                "98s0_dy5k3_98h4"
            ]
        },
        {
            "schedule_id": 95,
            "schedule_name": "completed two",
            "schedule_start_date": "2024-12-22",
            "schedule_end_date": "2024-12-23",
            "created_at": null,
            "updated_at": null,
            "schedule_status": true,
            "object_count": 2,
            "schedule_running": false,
            "schedule_processed": false,
            "schedule_objects": [
                "987y_isjgt_9866",
                "98s0_dy5k3_98h4"
            ]
        },
    ]
}