export default {
  data: [
  {
    "building_id": 1,
    "building_id_displayed": "0001",
    "building_name": "Forgan Smith Building",
    "site_id": 1,
    "site_id_displayed": "01",
    "site_name": "St Lucia",
    "floors": [
      {
        "floor_id": 1,
        "floor_id_displayed": "2",
        "asset_count": 1,
      },
      {
        "floor_id": 2,
        "floor_id_displayed": "3",
        "asset_count": 0,
      },
    ]
  },
  {
    "building_id": 2,
    "building_id_displayed": "0002",
    "building_name": "Duhig Tower",
    "site_id": 1,
    "site_id_displayed": "01",
    "site_name": "St Lucia",
    "floors": [
      {
        "floor_id": 4,
        "floor_id_displayed": "1",
        "asset_count": 1,
      },
      {
        "floor_id": 5,
        "floor_id_displayed": "2",
        "asset_count": 0,
      },
    ]
  },
  {
    "building_id": 8,
    "building_id_displayed": "8102",
    "building_name": "J.K. Murray Library",
    "site_id": 2,
    "site_id_displayed": "29",
    "site_name": "Gatton",
    "floors": [
      {
        "floor_id": 29,
        "floor_id_displayed": "1",
        "floor_plan_url": "http://29.a",
        "asset_count": 1,
      },
      {
        "floor_id": 30,
        "floor_id_displayed": "2",
        "asset_count": 0,
      }
    ]
  },{
    "building_id": 9,
    "building_id_displayed": "8248",
    "building_name": "Library Warehouse",
    "site_id": 2,
    "site_id_displayed": "29",
    "site_name": "Gatton",
    "floors": [
      {
        "floor_id": 31,
        "floor_id_displayed": "1",
        "asset_count": 1,
      },
      {
        "floor_id": 32,
        "floor_id_displayed": "2",
        "asset_count": 0,
      },
    ],
  },
  {
    "building_id": 100,
    "building_id_displayed": "100",
    "building_name": "Included building",
    "site_id": 4,
    "site_id_displayed": "100",
    "site_name": "Excluded Site",
    "floors": [
      {
        "floor_id": 100,
        "floor_id_displayed": "Included floor",
        "asset_count": 0,
        "floor_excluded": false,
        "parent_excluded": true,
      },
      {
        "floor_id": 101,
        "floor_id_displayed": "Excluded floor",
        "asset_count": 0,
        "floor_excluded": true,
        "parent_excluded": true,
      },
    ],
    "building_excluded": false,
    "parent_excluded": true,
  },
  {
    "building_id": 101,
    "building_id_displayed": "101",
    "building_name": "Excluded building",
    "site_id": 4,
    "site_id_displayed": "100",
    "site_name": "Excluded Site",
    "floors": [
      {
        "floor_id": 102,
        "floor_id_displayed": "Included floor",
        "asset_count": 0,
        "floor_excluded": false,
        "parent_excluded": true,
      },
      {
        "floor_id": 103,
        "floor_id_displayed": "Excluded floor",
        "asset_count": 0,
        "floor_excluded": true,
        "parent_excluded": true,
      },
    ],
    "building_excluded": true,
    "parent_excluded": true,
  },
]
};