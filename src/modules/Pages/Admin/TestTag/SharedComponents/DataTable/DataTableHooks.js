import React, { useState, useMemo } from 'react';
import RowMenuCell from './RowMenuCell';

export const useDataTableRow = (data = [], transform) => {
    const [row, _setRow] = useState(!!transform ? transform(data) : data);
    const setRow = data => _setRow(!!transform ? transform(data) : data);
    return { row, setRow };
};

export const useDataTableColumns = ({
    config,
    locale,
    handleEditClick,
    handleDeleteClick,
    filterKey = null,
    withActions = true,
    shouldDisableEdit,
    shouldDisableDelete,
}) => {
    const columns = useMemo(
        () => {
            const actionsCell = withActions
                ? {
                      field: 'actions',
                      headerName: locale?.actions,
                      renderCell: params => {
                          return (
                              <RowMenuCell
                                  {...params}
                                  withActions={[!!handleEditClick ? 'edit' : '', !!handleDeleteClick ? 'delete' : '']}
                                  {...((!!shouldDisableEdit ? !shouldDisableEdit(params.row) : true) &&
                                  !!handleEditClick
                                      ? { handleEditClick: handleEditClick }
                                      : {})}
                                  {...((!!shouldDisableDelete ? !shouldDisableDelete(params.row) : true) &&
                                  !!handleDeleteClick
                                      ? { handleDeleteClick: handleDeleteClick }
                                      : {})}
                              />
                          );
                      },
                      sortable: false,
                      width: 100,
                      headerAlign: 'center',
                      filterable: false,
                      align: 'center',
                      disableColumnMenu: true,
                      disableReorder: true,
                      renderInUpdate: false,
                  }
                : undefined;

            const columns = [];
            const configFiltered = !!!filterKey ? config : config?.[filterKey];
            const localeFiltered = !!!filterKey ? locale : locale?.[filterKey];

            const keys = Object.keys(configFiltered.fields);

            keys.forEach(key => {
                !!(configFiltered?.fields?.[key]?.fieldParams?.renderInTable ?? true) &&
                    columns.push({
                        field: key,
                        headerName: localeFiltered[key].label,
                        editable: false,
                        sortable: false,
                        ...configFiltered.fields[key].fieldParams,
                    });
            });

            withActions && columns && columns.length > 0 && columns.push(actionsCell);
            return columns;
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [handleDeleteClick, handleEditClick, filterKey],
    );

    return { columns };
};
