export default {
  data: [
    {
      "site_id": 1,
      "site_id_displayed": "01",
      "site_name": "St Lucia",
      "asset_count": 120,
      "buildings": [
        {
          "building_id": 1,
          "building_name": "Forgan Smith Building",
          "building_id_displayed": "0001",
          "asset_count": 12,
          "building_excluded": false,
          "parent_excluded": false,
        },
        {
          "building_id": 2,
          "building_name": "Duhig Tower",
          "building_id_displayed": "0002",
          "asset_count": 0,
          "building_excluded": false,
          "parent_excluded": false,
        },
      ],
      "site_excluded": false,
    },
    {
      "site_id": 2,
      "site_id_displayed": "29",
      "site_name": "Gatton",
      "asset_count": 0,
      "buildings": [
        {
          "building_id": 8,
          "building_name": "J.K. Murray Library",
          "building_id_displayed": "8102",
          "asset_count": 4,
          "building_excluded": false,
          "parent_excluded": false,
        },
        {
          "building_id": 9,
          "building_name": "Library Warehouse",
          "building_id_displayed": "8248",
          "asset_count": 0,
          "building_excluded": true,
          "parent_excluded": false,
        }
      ],
      "site_excluded": false,
    },
    {
      "site_id": 3,
      "site_id_displayed": "99",
      "site_name": "Newsite",
      "asset_count": 0,
      "building_excluded": false,
      "parent_excluded": false,
      "buildings": [],
      "site_excluded": false,
    },
    {
      "site_id": 4,
      "site_id_displayed": "100",
      "site_name": "Excluded Site",
      "asset_count": 0,
      "buildings": [
        {
          "building_id": 100,
          "building_name": "Included building",
          "building_id_displayed": "100",
          "asset_count": 0,
          "building_excluded": false,
          "parent_excluded": true,
        },
        {
          "building_id": 101,
          "building_name": "Excluded building",
          "building_id_displayed": "101",
          "asset_count": 0,
          "building_excluded": true,
          "parent_excluded": true,
        }
      ],
      "site_excluded": true,
    },
  ]
};